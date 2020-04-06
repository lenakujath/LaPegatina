import React, {Component} from 'react';
import Shuffle from '../../Utils/Shuffle'
import ButtonIgLocations from './ButtonIgLocations';
import texts from '../../../texts.json';

import '../../Instagram/Instagram.css';

import Loading from '../../Utils/Loading/Loading';

class InstagramLocationsGame extends Component {

    state = {
        randomImageSrc: "",
        randomImageLocation: "",
        locationOptions: [],
        data: [],
        gameStatus: "loading"
    }

    attempts= 0;
    counter= 0;
    apiCleanedResult = {}
    apiResultLength = 0


   //Cleans the object retrieved from the api and leaves an array of objects that just have the image source for the picture and the image location
    cleanApiResponse = () => {
        const images = this.state.data.filter(img => img.node.location !== null)

        const result = images.map((image) => ({
            src: image.node.thumbnail_resources[4].src,
            location: image.node.location.name
        }))

        this.apiCleanedResult = result;

        this.apiResultLength = result.length

        console.log("array a state amb el que torna api call", images)
    }

    //Takes off the first element of the array resulting in cleanApiResponse (called result) and takes the next 3 elements
    setRandomImageAndLocations = () => {

        Shuffle(this.apiCleanedResult)

        const firstElement = this.apiCleanedResult.shift();

        const imagesObjArr = this.apiCleanedResult.slice(0, 3);

        const threeLocationsArr = imagesObjArr.map((imageObj) => imageObj.location)

        threeLocationsArr.push(firstElement.location) //Cuando hacemos el push, el mismo array, con el mismo nombre, pasa de tener 3 elementos a tener 4. Si igualamos esta array a una constante, no estaríamos guardando la array de 4 elementos resultante sinó que guardaríamos el resultado del push, que sería soplo el número 4, tantos como elementos tiene dentro la array

        const threeRandomPlusCorrectLocationArr = Shuffle(threeLocationsArr)

        this.setState ({
            randomImageSrc: firstElement.src,
            randomImageLocation: firstElement.location,
            locationOptions: threeRandomPlusCorrectLocationArr,
            gameStatus: 'playing'
        })

        this.attempts = this.attempts+1

        if(this.attempts === this.apiResultLength) {
            this.setState ({
                gameStatus: "gameOver"
            })
        }
    }

    addOneToCounter = () => {
        this.counter = this.counter+1
    }


    // 'https://codeofaninja.com/tools/find-instagram-user-id'
    
    // profileId= '178522459';
    // //bestvacations ID


    // profileId = '42596988';
    //cuore ID

    profileId='32402644';
    //Rut's ID

    
    // profileId = '10934686';
    //LaPegatina ID
    numberOfPosts = '200000';

    componentDidMount() {
        
        fetch(`https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables={"id":"${this.profileId}","first":${this.numberOfPosts}}`)
          .then(res => res.json())
          .then(data => this.setState({ data: data.data.user.edge_owner_to_timeline_media.edges }))
          .then(() => this.cleanApiResponse())
          .then(() => this.setRandomImageAndLocations())
    }


    render () {

        const { randomImageSrc, locationOptions } = this.state;

        if (this.state.gameStatus === "loading") {
            return (
                <div className="loading">
                    <Loading/>
                </div>
            )
        }

        if (this.state.gameStatus==="playing") {
            return (
                <div className="instagram-game">
                    <div className="imageAndLocationsContainer">
                    <h1>{texts[this.props.language].instagramQuestion}</h1>
                        <div className="imageDisplayedContainer">
                            <div className="imageDisplayed">
                                <img src={randomImageSrc} alt="radom capture from the user's instagram feed" />
                            </div>
                        </div>
                        <div className="instagram-location-buttons">
                            {locationOptions.map((option, index) => {
                                return (
                                    <div key={index} className="instagram-option-button">
                                        <ButtonIgLocations value={option} currentLocation={this.state.randomImageLocation} addToCounter={this.addOneToCounter} key={index} setRandomImageAndLocations={this.setRandomImageAndLocations}
                                        >
                                        </ButtonIgLocations>
                                    </div>
                                )
                            })}
                        </div>
                        <p>{texts[this.props.language].correctAnswers} {this.counter}</p>
                    </div>
                </div>
            )
        } if (this.state.gameStatus==="gameOver") {
            return (
                <h1>Has llegado al final! Ahora prueba jugar con La Pegatina en Spotify o en Youtube</h1>
            )
        }
    }

}

export default InstagramLocationsGame;

