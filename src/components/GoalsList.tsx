// src/components/GoalsList.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Container, Box } from '@mui/material';
import Cookies from 'js-cookie';
import axiosInstance from '../services/api';
import SearchBar from './SearchBar';
import Loading from './Loading';
import CreateGoalButton from './CreateGoalButton';

interface Goal {
    id: number;
    title: string;
    description: string;
}

const GoalsList: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState<string>('');
    const authToken = Cookies.get('auth_token');

    const fetchGoals = async () => {
        try {
            const response = await axiosInstance.get('/api/goals', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchGoals();
    }, [authToken]);

    const filteredGoals = goals.filter(goal =>
        goal.title.toLowerCase().includes(query.toLowerCase())
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <Box>
            <CreateGoalButton fetchGoalsCallback={fetchGoals}></CreateGoalButton>
            <SearchBar query={query} setQuery={setQuery} />
            <Box sx={{ minHeight: "250px" }}>
                {filteredGoals.map(goal => (
                    <Card key={goal.id} sx={{ width: '100%', marginTop: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {goal.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {goal.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
                {filteredGoals.length < 1 ? (
                    <Box padding={5}>
                        <Typography variant="body2" color="text.secondary">
                            No goals here!
                        </Typography>
                    </Box>
                ) : []}
            </Box>
        </Box>
    );
};

export default GoalsList;
