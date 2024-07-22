import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useParams, } from 'react-router-dom';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';

interface CreateJournalEntryButtonProps {
    fetchJournalEntriesCallback: () => void;
}

const CreateJournalEntryButton: React.FC<CreateJournalEntryButtonProps> = ({ fetchJournalEntriesCallback }) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const { goalId } = useParams<{ goalId: string }>();

    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setText("");
        fetchJournalEntriesCallback();
    };

    const handleSubmit = async () => {
        if (text.length < 1) {
            showAlert(t('createJournalEntryProvideText'), 'error', 'Error');
            return
        }

        const authToken = Cookies.get('auth_token');
        try {
            await axiosInstance.post('/api/journal/create_entry', { text, goalId }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            handleClose();
        } catch (error) {
            console.error('Error creating journal entry:', error);
        }
    };

    return (
        <div>
            <Button sx={{ marginTop: 2 }} variant="contained" color="primary" onClick={handleClickOpen}>
                <span className="material-symbols-outlined">
                    add
                </span>
                {t('createJournalEntryButtonText')}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('createJournalEntryDialogHeader')}</DialogTitle>
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

export default CreateJournalEntryButton;
