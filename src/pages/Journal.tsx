import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Fab, Box, Container, Typography, Divider, Button, Toolbar } from '@mui/material';
import Cookies from 'js-cookie';
import axiosInstance from '../services/api';
import Loading from "../components/Loading"
import { Journal } from "../services/interfaces"
import { getTimeDifferenceString } from "../utils/timestampUtils"
import CreateJournalEntryButton from '../components/CreateJournalEntryButton';

const JournalPage: React.FC = () => {
    const navigate = useNavigate();

    const [journal, setJournal] = useState<Journal>();
    const [loading, setLoading] = useState<boolean>(true);
    const authToken = Cookies.get('auth_token');
    const { goalId } = useParams<{ goalId: string }>();

    const fetchJournal = async () => {
        try {
            const response = await axiosInstance.get('/api/journal/' + goalId, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setJournal(response.data);
        } catch (error) {
            console.error('Error fetching journal:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchJournal();
    }, [authToken]);

    if (loading || !journal) {
        return (
            <Loading />
        )
    }

    // Sort entries, newest first
    const journalEntries = journal.entries
    journalEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return (
        <div style={{ marginTop: "95px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            <Toolbar>
                <Button color="inherit" onClick={() => {
                    navigate('/dashboard')
                }}>
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                    Back to Dashboard
                </Button>
            </Toolbar>
            <Container>
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" component="div">
                        {journal.goal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {journal.goal.description} — {
                            getTimeDifferenceString(
                                new Date(),
                                new Date(journal.goal.end_date)
                            )
                        }
                    </Typography>
                    <CreateJournalEntryButton fetchJournalEntriesCallback={fetchJournal} />
                </Box>
                <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
                <Typography variant="overline" gutterBottom>
                    Journal entries for this Goal
                </Typography>
                <Box sx={{ minHeight: "250px" }}>
                    {journalEntries.map(journalEntry => (
                        <Card key={journalEntry.id} sx={{ position: 'relative', width: '100%', marginTop: 3 }}>
                            <CardContent>
                                <Typography variant="body1" color="text.primary">
                                    {journalEntry.text}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(journalEntry.created_at).toDateString()}
                                </Typography>
                                <Fab
                                    sx={{ float: 'right', margin: 1, marginBottom: 3 }}
                                    onClick={() => {
                                        /* Trigger editing */
                                    }}
                                >
                                    <span className="material-symbols-outlined">
                                        edit
                                    </span>
                                </Fab>
                            </CardContent>
                        </Card>
                    ))}
                    {journal.entries.length < 1 ? (
                        <Box padding={5}>
                            <Typography variant="body2" color="text.secondary">
                                No journal entries.
                            </Typography>
                        </Box>
                    ) : []}
                </Box>
                <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            </Container>
        </div>
    );
};

export default JournalPage;
