import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Fab } from '@mui/material';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';

interface CreateGoalButtonProps {
    fetchGoalsCallback: () => void;
}

const CreateGoalButton: React.FC<CreateGoalButtonProps> = ({ fetchGoalsCallback }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateGoal = async () => {
        const authToken = Cookies.get('auth_token');
        try {
            await axiosInstance.post('/api/goals', { title, description }, {
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
        <>
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
        </>
    );
};

export default CreateGoalButton;
