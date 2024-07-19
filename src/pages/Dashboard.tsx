// Dashboard
import React from 'react';
import { Container, Typography, Divider } from '@mui/material';
import GoalsList from '../components/GoalsList';

const Dashboard: React.FC = () => {
    return (
        <Container sx={{ marginTop: "95px", maxWidth: "500px" }}>
            <Typography variant="overline" gutterBottom>
                Your goals
            </Typography>
            <GoalsList />
            <Divider sx={{ marginTop: 3 }} />
        </Container>
    );
};

export default Dashboard;
