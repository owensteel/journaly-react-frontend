import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertContextType {
    showAlert: (message: string, severity: AlertSeverity, title?: string) => void;
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
    const [alert, setAlert] = useState<{ message: string, severity: AlertSeverity, title?: string, open: boolean }>({
        message: '',
        severity: 'info',
        title: '',
        open: false,
    });

    const showAlert = (message: string, severity: AlertSeverity, title?: string) => {
        setAlert({ message, severity, title, open: true });
    };

    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                    {alert.message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};
