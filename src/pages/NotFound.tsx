import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h1">404</Typography>
            <Typography variant="h6" gutterBottom>
                Page Not Found
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;
