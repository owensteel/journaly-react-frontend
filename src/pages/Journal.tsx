import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Container, Typography, Divider, Button, Toolbar } from '@mui/material';
import Cookies from 'js-cookie';
import axiosInstance from '../services/api';
import Loading from "../components/Loading"
import { Journal } from "../services/interfaces"
import { getTimeDifferenceString } from "../utils/timestampUtils"
import JournalReviewChart from '../components/JournalReviewChart'
import CreateJournalEntryButton from '../components/CreateJournalEntryButton';
import EditJournalEntryButton from '../components/EditJournalEntryButton';
import { useTranslation } from 'react-i18next';

const JournalPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [journal, setJournal] = useState<Journal>();
    const [loading, setLoading] = useState<boolean>(true);
    const authToken = Cookies.get('auth_token');
    const { goalId } = useParams<{ goalId: string }>();
    const { contentType } = useParams<{ contentType: string }>();

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

    const MarkGoalCompletedButton = () => {
        return (
            <Button sx={{ marginTop: 2 }} onClick={async () => {
                setLoading(true);
                await axiosInstance.post('/api/goals/toggle_completed', { goalId }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                fetchJournal();
            }}>
                <span style={{ verticalAlign: 'middle' }} className="material-symbols-outlined">
                    {journal.goal.completed ? "close" : "check"}
                </span>
                <span style={{ verticalAlign: 'middle', marginLeft: '7.5px' }}>
                    {journal.goal.completed ?
                        t('goalMarkIncompleteButtonText') :
                        t('goalMarkCompleteButtonText')}
                </span>
            </Button>
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
                    {t('journalBackToDashboard')}
                </Button>
            </Toolbar>
            <Container>
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" component="div">
                        {journal.goal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {journal.goal.description} — {
                            journal.goal.completed ? (
                                <strong>{t('goalDescriptionCompleted')}</strong>
                            ) :
                                getTimeDifferenceString(
                                    new Date(),
                                    new Date(journal.goal.end_date),
                                    t
                                )
                        }
                    </Typography>
                    <MarkGoalCompletedButton />
                    {
                        (contentType !== "chart" && !journal.goal.completed) ? (
                            <CreateJournalEntryButton fetchJournalEntriesCallback={fetchJournal} />
                        ) : (
                            <></>
                        )
                    }
                </Box>
            </Container>
            <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            {
                contentType == "chart" ? (
                    /* Chart */
                    <Container>
                        <Typography variant="overline" gutterBottom>
                            {t('journalReviewChart')}
                        </Typography>
                        <JournalReviewChart entries={journalEntries} />
                    </Container>
                ) : (
                    /* Entries */
                    <Container>
                        <Typography variant="overline" gutterBottom>
                            {t('journalJournalEntriesForThisGoal')}
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
                                        <EditJournalEntryButton entryData={journalEntry} fetchJournalEntriesCallback={fetchJournal} />
                                    </CardContent>
                                </Card>
                            ))}
                            {journal.entries.length < 1 ? (
                                <Box padding={5}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('journalNoEntries')}
                                    </Typography>
                                </Box>
                            ) : []}
                        </Box>
                        <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
                    </Container>
                )
            }
        </div>
    );
};

export default JournalPage;
