import React, { useState } from 'react';

const ButtonIgRoundTwo = (props) => {

    const [colorClass, setColorClass] = useState('gray')

    const ANSWERS_TIME_DISPLAYED = 2

    const checkRightOrWrong = () => {

        if (props.userClicked) {
            // A button has been already clicked, this will block
            // clicks on the rest of the buttons
            return
        }

        // set userClicked to true, so next buttons clicked will do nothing
        props.userHasClicked()

        if (props.value === props.currentLocation) {

            setColorClass('green')            
            props.addToCounter()

        } else {
            setColorClass('red')
        }

        setTimeout(() => {
            setColorClass('gray')
            props.setRandomImageAndLocations()
        }, ANSWERS_TIME_DISPLAYED * 1000)
    }

    const classGreen = (props.value === props.currentLocation) && props.userClicked
        ? 'solutionGreen'
        : ''

    return (
        <button className={`instagram-game-button ${colorClass} ${classGreen}`} onClick={checkRightOrWrong}>
            {props.value}
        </button>
    )
};

export default ButtonIgRoundTwo;