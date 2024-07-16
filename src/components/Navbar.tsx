import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';

import "./Navbar.css"

const Navbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position='fixed' color="transparent" sx={{
            backgroundColor: "#fff"
        }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={
                    {
                        flexGrow: 1
                    }
                }>
                    <Link to="/" className="nav-app-logo">Journaly</Link>
                </Typography>
            </Toolbar>
        </AppBar >
    );
};

export default Navbar;
