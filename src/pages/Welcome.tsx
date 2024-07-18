import React from 'react';
import { Container } from '@mui/material';
import Login from '../components/Login'

import "./Welcome.css"

const Welcome: React.FC = () => {
    return (
        <div className="welcome-wrapper">
            <Container>
                <div className="welcome-hero"></div>
                <h1>Let's keep on track.</h1>
                <p>A journal for your journeys towards your goals and pledges, with accountability when you need it — don't worry if you forget, because this journal won't forget you. 🔔</p>
                <Login />
            </Container>
        </div>
    );
};

export default Welcome;
