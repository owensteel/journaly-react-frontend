import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlertProvider, useAlert } from './AlertContext';
import { act } from 'react-dom/test-utils';

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Test component to use AlertContext
const TestComponent: React.FC = () => {
    const { showAlert, confirm } = useAlert();

    return (
        <div>
            <button onClick={() => showAlert('Test Alert Message', 'success', 'Test Alert Title')}>
                Show Alert
            </button>
            <button onClick={async () => {
                const result = await confirm('Are you sure?', 'Test Confirm Title');
                if (result) {
                    showAlert('Confirmed', 'info');
                } else {
                    showAlert('Cancelled', 'warning');
                }
            }}>
                Show Confirm
            </button>
        </div>
    );
};

describe('AlertContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows alert with correct message, severity, and title', async () => {
        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );

        fireEvent.click(screen.getByText('Show Alert'));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText('Test Alert Title')).toBeInTheDocument();
        expect(screen.getByText('Test Alert Message')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardSuccess');
    });

    it('shows confirm dialog and resolves correctly on confirm', async () => {
        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );

        fireEvent.click(screen.getByText('Show Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('alertContextConfirm'));

        await waitFor(() => {
            expect(screen.getByText('Confirmed')).toBeInTheDocument();
        });
    });

    it('shows confirm dialog and resolves correctly on cancel', async () => {
        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );

        fireEvent.click(screen.getByText('Show Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('alertContextCancel'));

        await waitFor(() => {
            expect(screen.getByText('Cancelled')).toBeInTheDocument();
        });
    });
});
