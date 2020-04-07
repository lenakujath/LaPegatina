import React from 'react';
import '../../../App.css';
import './Game.css';
import Button from '../Button/Button';
import Shuffle from '../../Utils/Shuffle';
import Spotify from '../../Utils/Spotify';
import PlayerCountdown from '../PlayerCountdown/PlayerCountdown';
import ShareTheGame from '../../ShareTheGame/ShareTheGame';
import Sound from 'react-sound';
import texts from '../../../texts.json';
import ListenedSongs from '../ListenedSongs/ListenedSongs';
// import {Link} from 'react-router-dom';

class Game extends React.Component {

  // We have the object coming from the API call, here
  spotifyObject = {}; 
  //This array contains the songs coming from the spotifyObject that DO ave a preview_url
  spotifyFilteredObjArr = []; 
  //Here the actual game mechanics start
  chosenSong = "";
  coincidence = false;
  answerCountShow= false;
  //All the songs that the user guessed wrong are pushed into this array
  unknownSongs= []; 

  selectedLanguage = localStorage.getItem('selectedLanguage');


  state = {
 
    songNames:[],
    currentSong: {
        preview_url: "",
        name: "",
        uri: "",
    },  

    hideResults: true,
    correctAnswers: 0,
    total: 0,
    score: 0,
    songUrl: "",
    playerState: Sound.status.PLAYING,
    playing: false,
    replayingSong: "",

    playlistID: "37i9dQZF1DZ06evO2EUrsw",
  }

  //API call to get the playlist data.
  async componentDidMount() {   
    this.spotifyObject = await Spotify.getPlaylist(this.state.playlistID);
    this.filterRightSongsFromSpotifyObject();
    this.setNewRandomSong();
  }

  /**
   * This fn returns an array with 4 song names randomly including the current song 
   * @param {string} currentSong - name of the current song playing
   * @returns {array} songsToDisplay
  */
  getSongsToDisplay = (currentSongName) => {

    let allSongsArr = this.spotifyObject.tracks.items.map(function (item){
      return item.track.name;
    });
    
    let filteredSongsArr = allSongsArr.filter(function (song) {

      return song !== currentSongName;
    });

    let shuffledFilterSongsArr = Shuffle(filteredSongsArr);

    let fourNonShuffledSongsArr = shuffledFilterSongsArr.slice(0, 3); // actually 3
    fourNonShuffledSongsArr.push(currentSongName); // now 4
    
    let fourShuffledSongsArr = Shuffle(fourNonShuffledSongsArr)

    return fourShuffledSongsArr;
  }

  chooseSongs = () => {
    this.setState({
      songNames: this.getSongsToDisplay(this.state.currentSong.name)
    })
  }

  setNewRandomSong = () => {

    if (this.spotifyFilteredObjArr.length === 0) {
      return
    }

    let randomSong = this.spotifyFilteredObjArr[Math.floor(Math.random()*this.spotifyFilteredObjArr.length)].track;

    this.spotifyFilteredObjArr = this.spotifyFilteredObjArr.filter(song => song.track.id !== randomSong.id)

    this.setState({
      currentSong: {
        preview_url: randomSong.preview_url,
        name: randomSong.name,
        uri: randomSong.uri
      },
      songNames: this.getSongsToDisplay(randomSong.name),
      hideResults: true,
      total: this.state.total +1,
      playerState: Sound.status.STOPPED
    });
  }
  
  writeChosenSong = (songName) => {
    this.chosenSong = songName;
  }
  
  checkCoincidence = () => {  
    this.coincidence = this.state.currentSong.name === this.chosenSong

    this.unknownSongs.push(this.state.currentSong)

    this.setState({
      hideResults: false,
      correctAnswers: this.coincidence ? (this.state.correctAnswers +1) : this.state.correctAnswers,
      score: this.coincidence ? (this.state.score +10) : this.state.score
    })
  }
  
  showAnswerCount = () => {
    this.answerCountShow= true;
  }
  
  getSongUrl = (songName) => {
    
    //allTracksArr is an array made of tracks (each one, in an object,
    // and as much tracks as songs are in the playlist)
    let allTracksArr = this.spotifyFilteredObjArr.map((item) => { 
      return item.track;
    })

    //trackArr is an array with an only index which is an object with 2 properties: name and preview_url
    
    let oneTrackArr = allTracksArr.filter((track) => { 
      //Returns an array with the (only) object that fulfills this condition 
      return track.name === songName 
    })

    let songUrl = oneTrackArr[0].preview_url;

    this.setState({
      songUrl: songUrl,
      playerState: Sound.status.PLAYING,
      playing: true,
      replayingSong: songName
      // return this.spotifyObject.tracks.items.filter(item => item.track.name === songName)[0].preview_url 
      // This does the same as getSongUrl but with much less lines
    }) 
  }
  
  stopMusic = () => {
    this.setState({
      playerState: Sound.status.STOPPED,
      playing: false
    })
  }
  
  filterRightSongsFromSpotifyObject = (spotifyObject) => {
    this.spotifyFilteredObjArr = this.spotifyObject.tracks.items.filter(function (item) {
    return item.track.preview_url !== null})
  }
  
  setPlayingToFalse = () => {
    this.setState({
      playing: false
    })
  }
  

  render() {
    return (
      <section>
        
        <ShareTheGame score={this.state.score} />
        
        <div className="show"> 
          <div className="QuestionAndAnswers">
            <div className="Countdown">
              <PlayerCountdown
                language={this.selectedLanguage}
                onMusicPlays={this.chooseSongs}
                setNewRandomSong={this.setNewRandomSong}
                songURL={this.state.currentSong.preview_url} 
                coincidence={this.checkCoincidence}
                showAnswerCount={this.showAnswerCount}
              />
            </div>
            <div className={"FourButtons " + (this.state.hideResults ? 'forceGrayColor' : "")} >
              {this.state.songNames.map((songName) => {
                return (
                  <Button 
                    key={songName} 
                    printedSong={songName} 
                    //We write it like this so the function writeChoosenSong isn't executed when the button is rendered but when the button 
                    //is clicked. Different than what we're doing some lines above in the onMusicPlays, setNewRandomSong or songURL
                    onClick={() => this.writeChosenSong(songName)}
                    currentSong={this.state.currentSong.name}
                  />
                )
              })}
            </div>
            <div id="counter" className="instruct">
              <p className={this.answerCountShow ? "show" : "hide"}>{texts[this.selectedLanguage].correctAnswers} {this.state.correctAnswers} {texts[this.props.language].outofText} {this.state.total}</p>
              <br/>
              <p className={this.answerCountShow ? "show" : "hide"}>{texts[this.selectedLanguage].pointsText} {this.state.score}</p>
            </div>
            
            <ListenedSongs unknownSongs={this.unknownSongs} language={this.selectedLanguage} url={this.state.songUrl} playStatus={this.state.playerState} onClick={this.state.playing} />
          </div>
        </div>  
      </section>
    );
  }
}

export default Game;
