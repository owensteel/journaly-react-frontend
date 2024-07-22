// Dashboard
import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import GoalsList from '../components/GoalsList';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container sx={{ marginTop: "95px" }}>
            <Box sx={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
                <Typography variant="overline" gutterBottom>
                    {t('dashboardYourGoals')}
                </Typography>
                <GoalsList />
                <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            </Box>
        </Container>
    );
};

export default Dashboard;
