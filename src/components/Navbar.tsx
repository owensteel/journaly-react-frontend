import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Button, Typography, Avatar } from '@mui/material';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

import "./Navbar.css"

const Navbar: React.FC = () => {
    const { isLoggedIn, name, picture } = useSelector((state: RootState) => state.user);

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

            <AppBar position='fixed' color="transparent" sx={{
                backgroundColor: "#fff"
            }}>
                <Toolbar>
                    <Typography className="journaly-logo" variant="h6" component="div" sx={
                        {
                            flexGrow: 1
                        }
                    }>
                        <Link to="/">
                            <span className="material-symbols-outlined">
                                edit
                            </span>
                            <span className="logo-text">Journaly</span>
                        </Link>
                    </Typography>
                    <div>
                        {isLoggedIn ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" style={{ marginRight: '10px' }}>
                                    {name}
                                </Typography>
                                <Avatar src={picture} alt={name} />
                            </div>
                        ) : (
                            <Button href="/welcome" color="inherit">Login</Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar >
        </div>
    );
};

export default Navbar;
