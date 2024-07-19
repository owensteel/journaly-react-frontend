// Dashboard
import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import GoalsList from '../components/GoalsList';

const Dashboard: React.FC = () => {
    return (
        <Container sx={{ marginTop: "95px" }}>
            <Box sx={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
                <Typography variant="overline" gutterBottom>
                    Your goals
                </Typography>
                <GoalsList />
                <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            </Box>
        </Container>
    );
};

export default Dashboard;
