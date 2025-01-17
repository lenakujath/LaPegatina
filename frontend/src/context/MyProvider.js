/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';

export const MyContext = React.createContext();

class MyProvider extends Component {

    state = {
        first_name: '',
        last_name: '',
        username: '',
        birth_date: '',
        email: '',
        points_spotify_round_one: '',
        points_spotify_round_two: '',
        points_instagram_round_one: '',
        points_instagram_round_two: '',
        points_youtube_round_one: '',
        points_youtube_round_two: '',
        total_app_points: '',

        activePanel: 'login',
        language: 'spanish',
        authed: true,
    }

    render() {

        const { points: total_app_points, activePanel } = this.state;
        // We rename points so we can after do 'points: this.state.points + points' without problems

        const { children } = this.props;

        return (
            <MyContext.Provider value={{
                state: this.state,
                addPoints: (points) => this.setState({
                    points: total_app_points + points,
                }),

                clearUser: () => this.setState({
                    first_name: '',
                    last_name: '',
                    username: '',
                    birth_date: '',
                    email: '',
                    points_spotify_round_one: '',
                    points_spotify_round_two: '',
                    points_instagram_round_one: '',
                    points_instagram_round_two: '',
                    points_youtube_round_one: '',
                    points_youtube_round_two: '',
                    total_app_points: '',
                    activePanel: 'login',
                    language: 'spanish',
                    authed: false,
                }),

                logUserIntoContext: (data) => this.setState({
                    first_name: data[0].first_name,
                    last_name: data[0].last_name,
                    username: data[0].username,
                    birth_date: data[0].birth_date,
                    email: data[0].email,
                    activePanel: 'login',
                    language: 'spanish',
                    authed: true,
                }),


                // login sign up switch
                activePanel,
                actions: {
                    handlePanelSwitch: (newPanel) => {
                        this.setState({
                            activePanel: newPanel,
                        });
                    },
                },
            }}
            >
                {children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;
