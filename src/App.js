import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Game from './Components/Game/Game';
import Home from './Components/Home/Home';
import InstagramLocationsGame from './Components/Instagram/InstagramLocations/InstagramLocations';
import InstagramTagsGame from './Components/Instagram/InstagramTags/InstagramTags'
import SocialMedia from './Components/SocialMedia/SocialMedia';
import Team from './Components/Team/Team';
import Navbar from './Components/Navbar/Navbar';

import './App.css';
import ListenedSongs from './Components/ListenedSongs/ListenedSongs';


class App extends React.Component {

  language = localStorage.getItem('selectedLanguage');

  state = {
    selectedLanguage: this.language,
  }

  setLanguage = (lang) => {
    this.setState ({
      selectedLanguage: lang
    })
  }

  render() {

    const { selectedLanguage } = this.state;

    return (
      <div>
        <Navbar onChangeLanguage={this.setLanguage} language={this.language} />

        <Switch>
          <Route exact path='/' render={props => <Home language={this.language} {...props} />} />
          <Route path='/game' render={props => <Game language={this.language} {...props} />} />   
          <Route path='/team' render={props => <Team language={this.language} {...props} />} />
          
          {/* <Route exact path='/' render={props => <Home language={selectedLanguage} {...props} />} />
          <Route path='/game' render={props => <Game language={selectedLanguage} {...props} />} />   
          <Route path='/team' render={props => <Team language={selectedLanguage} {...props} />} />
           */}
           
          <Route path='/instagramlocations' render={props => <InstagramLocationsGame language={selectedLanguage} {...props} />} />
          <Route path='/instagramtags' render={props => <InstagramTagsGame language={selectedLanguage} {...props} />} />
          <Route parth='/listenedsongs' render={props => <ListenedSongs language={selectedLanguage} {...props} />} />
        </Switch> 
        
        <div className="social-media-follow-buttons">
          <SocialMedia language={selectedLanguage}/>
        </div>
      </div>
    );
  }
}

export default App;
