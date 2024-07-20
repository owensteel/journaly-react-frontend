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

interface CreateGoalButtonProps {
    fetchGoalsCallback: () => void;
}

const CreateGoalButton: React.FC<CreateGoalButtonProps> = ({ fetchGoalsCallback }) => {
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
            showAlert('Please select a date in the future.', 'error', 'Error');
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
            showAlert('Please provide a title and description.', 'error', 'Error');
            return
        }

        const endDateAsString = endDate.format()
        if (!isAfter(endDateAsString, startOfToday())) {
            showAlert('Please select a date in the future.', 'error', 'Error');
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
                Create Goal
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a new Goal</DialogTitle>
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
                        End date to aim for
                    </Typography>
                    <DateCalendar
                        value={endDate}
                        onChange={handleDateChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateGoal} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default CreateGoalButton;
