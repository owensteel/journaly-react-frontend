// Tests components/CreateJournalEntryButton

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateJournalEntryButton from './CreateJournalEntryButton';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../services/api';
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import axiosMock from 'axios-mock-adapter';

const mockAxios = new axiosMock(axiosInstance);

jest.mock('./AlertContext', () => ({
    useAlert: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const fetchJournalEntriesCallback = jest.fn();
const showAlert = jest.fn();

beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ showAlert });
    Cookies.get = jest.fn().mockReturnValue('test_token');
    mockAxios.reset();
});

test('renders CreateJournalEntryButton and opens dialog on click', () => {
    render(
        <Router>
            <CreateJournalEntryButton fetchJournalEntriesCallback={fetchJournalEntriesCallback} />
        </Router>
    );

    fireEvent.click(screen.getByText('createJournalEntryButtonText'));

    expect(screen.getByText('createJournalEntryDialogHeader')).toBeInTheDocument();
});

test('shows error when trying to submit without text', async () => {
    render(
        <Router>
            <CreateJournalEntryButton fetchJournalEntriesCallback={fetchJournalEntriesCallback} />
        </Router>
    );

    fireEvent.click(screen.getByText('createJournalEntryButtonText'));
    fireEvent.click(screen.getByText('createJournalEntryDialogSave'));

    await waitFor(() => expect(showAlert).toHaveBeenCalledWith('createJournalEntryProvideText', 'error', 'Error'));
});

test('submits form with text and calls API', async () => {
    mockAxios.onPost('/api/journal/create_entry').reply(200);

    render(
        <Router>
            <CreateJournalEntryButton fetchJournalEntriesCallback={fetchJournalEntriesCallback} />
        </Router>
    );

    fireEvent.click(screen.getByText('createJournalEntryButtonText'));

    fireEvent.change(screen.getByLabelText('createJournalEntryDialogTextLabel'), { target: { value: 'Test entry' } });
    fireEvent.click(screen.getByText('createJournalEntryDialogSave'));

    await waitFor(() => expect(mockAxios.history.post.length).toBe(1));
    expect(mockAxios.history.post[0].data).toEqual(JSON.stringify({ text: 'Test entry', goalId: undefined }));
    await waitFor(() => expect(fetchJournalEntriesCallback).toHaveBeenCalled());
});
