import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h1">404</Typography>
            <Typography variant="h6" gutterBottom>
                {t('notFoundHeader')}
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                {t('notFoundBackToHome')}
            </Button>
        </Box>
    );
};

export default NotFound;
