import React, { useState } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';
import { JournalEntry } from '../services/interfaces';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';

interface EditJournalEntryButtonProps {
    fetchJournalEntriesCallback: () => void;
    entryData: JournalEntry;
}

const EditJournalEntryButton: React.FC<EditJournalEntryButtonProps> = ({ fetchJournalEntriesCallback, entryData }) => {
    const { t } = useTranslation();
    const { confirm } = useAlert();

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
        if (text.length < 1) {
            // Does user mean to delete the entry?
            const userConfirmed = await confirm(t('editJournalEntryConfirmDeletionDialog'), t('editJournalEntryConfirmDeletionDialogHeader'));
            if (!userConfirmed) {
                // No, stop here
                return
            }
        }

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
                <DialogTitle>{t('editJournalEntryDialogHeader')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('createJournalEntryDialogTextLabel')}
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
                        {t('alertContextCancel')}
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {t('createJournalEntryDialogSave')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditJournalEntryButton;
