import React from 'react';
import { Container } from '@mui/material';
import Login from '../components/Login'
import { useTranslation } from 'react-i18next';

import "./Welcome.css"

const Welcome: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="welcome-wrapper">
            <div className="welcome-container">
                <Container>
                    <div className="welcome-hero"></div>
                    <h1>{t('welcomeHeader')}</h1>
                    <p>{t('welcomeBody')}</p>
                    <Login />
                </Container>
            </div>
        </div>
    );
};

export default Welcome;
