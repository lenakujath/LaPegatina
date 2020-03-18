import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';
import './Game.css';
import Button from '../Button/Button';
import Shuffle from '../Utils/Shuffle';
import Spotify from '../Utils/Spotify';
import PlayerCountdown from '../PlayerCountdown/PlayerCountdown';
import Sound from 'react-sound';


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

  state = {
 
    songNames:[],
    currentSong: {
        preview_url: "",
        name: "",
    },  

    hideResults: true,
    correctAnswers: 0,
    total: 0,
    songUrl: "",
    playerState: Sound.status.PLAYING,
    playing: false,
    replayingSong: "",

    // Default playlist
    playlistID: "37i9dQZF1DZ06evO2EUrsw",
  }

  //API call to get the playlist data.
  async componentDidMount() {

    this.spotifyObject = await Spotify.getPlaylist(sessionStorage.selectedPlaylistId || this.state.playlistID);
    
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

    this.setState({
      currentSong: {
        preview_url: randomSong.preview_url,
        name: randomSong.name
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

    if (this.coincidence !== true) { 
      this.unknownSongs.push(this.state.currentSong.name)
    }

    this.setState({
      hideResults: false,
      correctAnswers: this.coincidence ? (this.state.correctAnswers +1) : this.state.correctAnswers
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
  
  //since we're probably only play with one playlist we might not need the following method
  //BUT: it could be useful for the next stages (playing with different levels/prices)
            
  /* componentDidUpdate  = async  (prevProps, prevState) => {
    if (prevState.clave !== this.state.clave) {
        
      this.spotifyObject = await Spotify.getPlaylist(this.state.playlistID)
      this.filterRightSongsFromSpotifyObject();
    }
  } 

  show = (event) => {

    let newList = event.target.className; 

    this.setState({
 
      clave: newList,

    })
  }*/

  render() {
    return (
      <section>
        <div className="show"> 
          <div className="QuestionAndAnswers">
            <div className="Countdown">
              <PlayerCountdown
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
              <p className={this.answerCountShow ? "show" : "hide"}>Respuestas correctas: {this.state.correctAnswers}  de {this.state.total}</p>
            </div>
            <div className={this.unknownSongs.length > 0 ? "show" : "hide"}>
                <h4 className="instruct">Aprende de tus errores:</h4>
                <ul id="mistakes" className="instruct">  
                  {this.unknownSongs.map((song) => {
                    return (
                        <li key={song} className="mistake-list">
                          <div className="song-name">
                            {song} 
                          </div>
                          <button className="repeat-button" onClick={this.state.playing ? () => this.stopMusic() : () => this.getSongUrl(song)}>
                            {this.state.playing ? "Pausa" : "Vuelve a escucharla"} 
                          {/* We write it with an arrow function instead of a 'normal' function so we can avoid an infinite loop 
                          when setting the state */}  
                          </button> 
                        </li>
                    )
                  })}
                </ul>
                <Sound 
                  url={this.state.songUrl}
                  playStatus={this.state.playerState}
                  autoLoad
                />
            </div>
          </div>
        </div>
        
        <h3><Link className="link" to="/">Volver al inicio</Link></h3>   

        {
          //ALSO: intermediate button, before getting to the game needs to be removed"
        }
      </section>
    );
  }
}

export default Game;
