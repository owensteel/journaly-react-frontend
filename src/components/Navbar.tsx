import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

const NavBarLinks: React.FC = () => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            {/* "Home" goes to "/", so that the homepage is always decided by the App for state reasons */}
            <Button component={Link} to="/" color="inherit">
                Home
            </Button>
            <Button component={Link} to="/login" color="primary" variant="contained">
                Login
            </Button>
        </Box>
    )
}

const Navbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position='fixed' color="transparent" sx={{
            backgroundColor: "#fff",
            position: "fixed",
            alignItems: (isMobile ? "center" : "inherit"),
            bottom: (isMobile ? "0px" : "inherit"),
            top: (isMobile ? "auto" : "0px")
        }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={
                    {
                        flexGrow: 1,
                        display: (isMobile ? "none" : "inherit")
                    }
                }>
                    Journaly
                </Typography>
                <NavBarLinks></NavBarLinks>
            </Toolbar>
        </AppBar >
    );
};

export default Navbar;
