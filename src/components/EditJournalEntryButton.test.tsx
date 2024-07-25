// Tests components/EditJournalEntryButton

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditJournalEntryButton from './EditJournalEntryButton';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';
import { JournalEntry } from '../services/interfaces';
import { useAlert } from './AlertContext';
import { jest } from '@jest/globals';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

// Mock modules
jest.mock('../services/api');
jest.mock('js-cookie');
jest.mock('./AlertContext', () => ({
    useAlert: jest.fn(),
}));
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(() => ({
        t: (key: string) => key,
    })),
}));
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}));

// Setup mocks
const fetchJournalEntriesCallback = jest.fn();
const entryData: JournalEntry = {
    id: 1, text: 'Initial Entry Text',
    user_id: 0,
    goal_id: 0,
    created_at: new Date().toDateString()
};

const mockAuthToken = 'mock-auth-token';
const mockGoalId = 0;

type ConfirmFunction = (message: string, title?: string) => Promise<boolean>;

const mockConfirm: jest.MockedFunction<ConfirmFunction> = jest.fn();

beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({
        confirm: mockConfirm,
    });
    (Cookies.get as jest.Mock).mockReturnValue(mockAuthToken);
    (useParams as jest.Mock).mockReturnValue({ goalId: mockGoalId });
});

test('renders the button and opens the dialog', () => {
    render(
        <EditJournalEntryButton fetchJournalEntriesCallback={fetchJournalEntriesCallback} entryData={entryData} />
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Check if dialog opens
    expect(screen.getByText('editJournalEntryDialogHeader')).toBeInTheDocument();
    expect(screen.getByLabelText('createJournalEntryDialogTextLabel')).toHaveValue(entryData.text);
});

test('shows confirmation dialog if text is empty and user does not confirm', async () => {
    mockConfirm.mockResolvedValue(false);  // Simulate user canceling

    const mockPut = jest.fn();
    (axiosInstance.put as jest.Mock).mockImplementation(mockPut);

    render(
        <EditJournalEntryButton fetchJournalEntriesCallback={fetchJournalEntriesCallback} entryData={entryData} />
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Clear the text field
    fireEvent.change(screen.getByLabelText('createJournalEntryDialogTextLabel'), {
        target: { value: '' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('createJournalEntryDialogSave'));

    await waitFor(() => {
        expect(axiosInstance.put).not.toHaveBeenCalled();  // Ensure put is not called
        expect(fetchJournalEntriesCallback).not.toHaveBeenCalled();  // Ensure callback is not called
    });
});

test('handles form submission with valid data', async () => {
    const mockPut = jest.fn();
    (axiosInstance.put as jest.Mock).mockImplementation(mockPut);

    render(
        <EditJournalEntryButton fetchJournalEntriesCallback={fetchJournalEntriesCallback} entryData={entryData} />
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Fill in the form
    fireEvent.change(screen.getByLabelText('createJournalEntryDialogTextLabel'), {
        target: { value: 'Updated Entry Text' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('createJournalEntryDialogSave'));

    await waitFor(() => {
        expect(axiosInstance.put).toHaveBeenCalledWith(
            `/api/journal/edit_entry/${entryData.id}`,
            { text: 'Updated Entry Text', goalId: mockGoalId },
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`
                }
            }
        );
        expect(fetchJournalEntriesCallback).toHaveBeenCalled();
    });
});
