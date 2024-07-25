// CreateGoalButton.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateGoalButton from './CreateGoalButton';
import axiosInstance from '../services/api';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

// Mock dependencies
jest.mock('../services/api');
jest.mock('js-cookie', () => ({
    get: jest.fn(() => 'mock-auth-token')
}));
jest.mock('./AlertContext', () => ({
    useAlert: jest.fn(() => ({
        showAlert: jest.fn()
    }))
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key // Mock translation function
    })
}));

describe('CreateGoalButton', () => {
    const mockFetchGoalsCallback = jest.fn();
    const mockShowAlert = jest.fn();
    const dayJsCurrentDate = dayjs();

    beforeEach(() => {
        (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
    });

    test('renders the button and opens the dialog', () => {
        const { t } = useTranslation();

        render(<CreateGoalButton fetchGoalsCallback={mockFetchGoalsCallback} />);

        const button = screen.getByText(t('createGoalButtonText'));
        fireEvent.click(button);

        expect(screen.getByText(t('createGoalDialogHeader'))).toBeInTheDocument();
        expect(screen.getByLabelText(t('createGoalDialogTitleLabel'))).toBeInTheDocument();
        expect(screen.getByLabelText(t('createGoalDialogDescriptionLabel'))).toBeInTheDocument();
        expect(screen.getByText(t('createGoalDialogEndDateLabel'))).toBeInTheDocument();
    });

    test('handles form submission with valid data', async () => {
        const { t } = useTranslation();

        render(<CreateGoalButton fetchGoalsCallback={mockFetchGoalsCallback} />);

        fireEvent.click(screen.getByText(t('createGoalButtonText')));

        fireEvent.change(screen.getByLabelText(t('createGoalDialogTitleLabel')), { target: { value: 'New Goal' } });
        fireEvent.change(screen.getByLabelText(t('createGoalDialogDescriptionLabel')), { target: { value: 'Goal Description' } });

        // Simulate date change
        const dateCalendar = screen.getByRole('grid');
        fireEvent.click(dateCalendar);

        const submissionTime = dayJsCurrentDate.format()

        fireEvent.click(screen.getByText(t('createGoalDialogCreate')));

        await waitFor(() => {
            expect(mockFetchGoalsCallback).toHaveBeenCalled();
        });

        expect(axiosInstance.post).toHaveBeenCalledWith(
            '/api/goals/create',
            expect.objectContaining({
                title: 'New Goal',
                description: 'Goal Description'
                // endTime cannot be properly tested due to unpredictable test latency
            }),
            expect.any(Object)
        );
    });

    test('shows alert if title or description is missing', async () => {
        const { t } = useTranslation();

        render(<CreateGoalButton fetchGoalsCallback={mockFetchGoalsCallback} />);

        fireEvent.click(screen.getByText(t('createGoalButtonText')));

        fireEvent.change(screen.getByLabelText(t('createGoalDialogTitleLabel')), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(t('createGoalDialogDescriptionLabel')), { target: { value: 'Goal Description' } });

        fireEvent.click(screen.getByText(t('createGoalDialogCreate')));

        await waitFor(() => {
            expect(mockShowAlert).toHaveBeenCalledWith(t('createGoalProvideTitleAndDescription'), 'error', 'Error');
        });
    });
});
