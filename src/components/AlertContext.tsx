import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Snackbar, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertContextType {
    showAlert: (message: string, severity: AlertSeverity, title?: string) => void;
    confirm: (message: string, title?: string) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const { t } = useTranslation();

    const [alert, setAlert] = useState<{ message: string, severity: AlertSeverity, title?: string, open: boolean }>({
        message: '',
        severity: 'info',
        title: '',
        open: false,
    });

    const [confirmDialog, setConfirmDialog] = useState<{ message: string, title?: string, open: boolean, resolve?: (value: boolean) => void }>({
        message: '',
        title: '',
        open: false,
    });

    const showAlert = (message: string, severity: AlertSeverity, title?: string) => {
        setAlert({ message, severity, title, open: true });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const confirm = (message: string, title?: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmDialog({ message, title, open: true, resolve });
        });
    };

    const handleConfirm = (response: boolean) => {
        if (confirmDialog.resolve) {
            confirmDialog.resolve(response);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    return (
        <AlertContext.Provider value={{ showAlert, confirm }}>
            {children}
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                    {alert.message}
                </Alert>
            </Snackbar>
            <Dialog open={confirmDialog.open} onClose={() => handleConfirm(false)}>
                {confirmDialog.title && <DialogTitle>{confirmDialog.title}</DialogTitle>}
                <DialogContent>
                    <DialogContentText>{confirmDialog.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirm(false)} color="secondary">
                        {t('alertContextCancel')}
                    </Button>
                    <Button onClick={() => handleConfirm(true)} color="primary">
                        {t('alertContextConfirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </AlertContext.Provider>
    );
};
