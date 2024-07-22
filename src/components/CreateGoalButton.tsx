import React, { useState } from 'react';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { isAfter, startOfToday } from 'date-fns';
import { useAlert } from './AlertContext';
import formatDate from '../utils/formatDate';
import { useTranslation } from 'react-i18next';

interface CreateGoalButtonProps {
    fetchGoalsCallback: () => void;
}

const CreateGoalButton: React.FC<CreateGoalButtonProps> = ({ fetchGoalsCallback }) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const dayJsCurrentDate = dayjs(formatDate(new Date()))

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [endDate, setEndDate] = useState(dayJsCurrentDate);

    const handleDateChange = (date: Dayjs) => {
        const dateString = date.format()
        if (isAfter(dateString, startOfToday())) {
            setEndDate(date);
        } else {
            showAlert(t('createGoalSelectDateInFuture'), 'error', 'Error');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTitle("")
        setDescription("")
        setEndDate(dayJsCurrentDate)
    };

    const handleCreateGoal = async () => {
        if (title.length < 1 || description.length < 1) {
            showAlert(t('createGoalProvideTitleAndDescription'), 'error', 'Error');
            return
        }

        const endDateAsString = endDate.format()
        if (!isAfter(endDateAsString, startOfToday())) {
            showAlert(t('createGoalSelectDateInFuture'), 'error', 'Error');
            return
        }

        const authToken = Cookies.get('auth_token');
        try {
            await axiosInstance.post('/api/goals/create', { title, description, endDate: endDateAsString }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            fetchGoalsCallback();
            handleClose();
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button sx={{
                width: "100%",
                marginBottom: "25px"
            }} variant="contained" color="primary" onClick={handleClickOpen}>
                <span className="material-symbols-outlined">
                    add
                </span>
                {t('createGoalButtonText')}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('createGoalDialogHeader')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Typography variant="overline" gutterBottom>
                        {t('createGoalDialogEndDateLabel')}
                    </Typography>
                    <DateCalendar
                        value={endDate}
                        onChange={handleDateChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t('alertContextCancel')}
                    </Button>
                    <Button onClick={handleCreateGoal} color="primary">
                        {t('createGoalDialogCreate')}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default CreateGoalButton;
