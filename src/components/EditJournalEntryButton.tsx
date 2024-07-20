import React, { useState, useEffect } from 'react';
import { Fab, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';
import Loading from './Loading';
import { JournalEntry } from '../services/interfaces';

interface EditJournalEntryButtonProps {
    fetchJournalEntriesCallback: () => void;
    entryData: JournalEntry;
}

const EditJournalEntryButton: React.FC<EditJournalEntryButtonProps> = ({ fetchJournalEntriesCallback, entryData }) => {
    const { goalId } = useParams<{ goalId: string }>();

    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
        setText(entryData.text)
    };

    const handleClose = () => {
        setOpen(false);
        setText("");
        fetchJournalEntriesCallback();
    };

    const handleSubmit = async () => {
        const authToken = Cookies.get('auth_token');
        try {
            await axiosInstance.put(`/api/journal/edit_entry/${entryData.id}`, { text, goalId }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            handleClose();
        } catch (error) {
            console.error('Error updating journal entry:', error);
        }
    };

    return (
        <div>
            <Fab
                sx={{ float: 'right', margin: 1, marginBottom: 3 }}
                onClick={handleClickOpen}
            >
                <span className="material-symbols-outlined">
                    edit
                </span>
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit an entry</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Text"
                        type="text"
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        multiline
                        rows={5}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditJournalEntryButton;
