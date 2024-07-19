// src/components/GoalsList.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';
import Cookies from 'js-cookie';
import axiosInstance from '../services/api';
import SearchBar from './SearchBar';
import Loading from './Loading';
import CreateGoalButton from './CreateGoalButton';

function getTimeDifferenceString(date1: Date, date2: Date): string {
    const diff = date2.getTime() - date1.getTime();
    const diffAbs = Math.abs(diff);

    const seconds = Math.floor(diffAbs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    let result = '';
    if (weeks > 0) {
        result = `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else if (days > 0) {
        result = `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        result = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        result = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        result = `${seconds} second${seconds > 1 ? 's' : ''}`;
    }

    if (diff > 0) {
        return `${result} left`;
    } else {
        return `${result} overdue`;
    }
}

function getTimeCompletionPercentage(startDate: Date, endDate: Date, currentDate: Date = new Date()): number {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedTime = currentDate.getTime() - startDate.getTime();

    if (totalDuration <= 0) {
        throw new Error("End date must be after start date");
    }

    const completionPercentage = (elapsedTime / totalDuration) * 100;

    return Math.min(100, Math.max(0, completionPercentage));
}

interface Goal {
    id: number;
    title: string;
    description: string;
    end_date: string;
    created_at: string;
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
                    <Card key={goal.id} sx={{ position: 'relative', width: '100%', marginTop: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {goal.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {goal.description} — {
                                    getTimeDifferenceString(
                                        new Date(),
                                        new Date(goal.end_date)
                                    )
                                }
                            </Typography>
                            <LinearProgress sx={{
                                position: "absolute",
                                width: "100%",
                                top: 0,
                                left: 0,
                                right: 0
                            }} variant="determinate" value={
                                getTimeCompletionPercentage(new Date(goal.created_at), new Date(goal.end_date))
                            } />
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
