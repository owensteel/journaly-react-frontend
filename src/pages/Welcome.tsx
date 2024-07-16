import React from 'react';

import Login from '../components/Login'

import "./Welcome.css"

const Welcome: React.FC = () => {
    return (
        <div className="welcome-wrapper">

            <div className="welcome-hero"></div>

            <h1>Let's get started.</h1>
            <p>A journal for your journeys. Accountability for your goals and pledges. Don't worry if you forget, because it won't forget you.</p>

            <Login />

        </div>
    );
};

export default Welcome;
