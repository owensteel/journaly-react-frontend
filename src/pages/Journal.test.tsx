import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JournalPage from './Journal';
import axiosInstance from '../services/api';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../components/AlertContext';
import { Journal } from '../services/interfaces';

jest.mock('../services/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('../components/AlertContext', () => ({
    useAlert: jest.fn(),
}));

jest.mock('js-cookie');

describe('JournalPage Component', () => {
    const mockNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
    const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
    const mockGet = axiosInstance.get as jest.MockedFunction<typeof axiosInstance.get>;
    const mockPost = axiosInstance.post as jest.MockedFunction<typeof axiosInstance.post>;
    const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;

    const mockJournal: Journal = {
        goal: {
            id: 1,
            title: 'Mock Goal',
            description: 'Mock Description',
            end_date: new Date().toISOString(),
            completed: false,
            created_at: ''
        },
        entries: [
            {
                id: 1,
                text: 'Mock Entry 1',
                created_at: new Date().toISOString(),
                user_id: 0,
                goal_id: 0
            },
            {
                id: 2,
                text: 'Mock Entry 2',
                created_at: new Date().toISOString(),
                user_id: 0,
                goal_id: 0
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock Cookies.get to return the token correctly
        (Cookies.get as jest.Mock).mockReturnValue('mockAuthToken');
        mockNavigate.mockReturnValue(jest.fn());
        mockUseParams.mockReturnValue({ goalId: '1', contentType: 'entries' });
        mockUseAlert.mockReturnValue({
            showAlert: jest.fn(),
            confirm: function (message: string, title?: string): Promise<boolean> {
                throw new Error('Function not implemented.');
            }
        });
    });

    test('renders loading spinner initially', () => {
        mockGet.mockResolvedValueOnce({ data: {} });

        render(<JournalPage />);

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test('fetches and displays journal data', async () => {
        mockGet.mockResolvedValueOnce({ data: mockJournal });

        render(<JournalPage />);

        await waitFor(() => {
            expect(screen.getByText('Mock Goal')).toBeInTheDocument();
            expect(screen.getByText('Mock Description — 0 utilsTimestampDifferenceStringSecond utilsTimestampDifferenceStringOverdue')).toBeInTheDocument();
            expect(screen.getByText('Mock Entry 1')).toBeInTheDocument();
            expect(screen.getByText('Mock Entry 2')).toBeInTheDocument();
        });
    });

    test('handles goal completion toggle', async () => {
        mockGet.mockResolvedValueOnce({ data: mockJournal });
        mockPost.mockResolvedValueOnce({});

        render(<JournalPage />);

        // Wait for the page to finish loading and display elements
        await waitFor(() => {
            expect(screen.getByText('Mock Goal')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /check/i })).toBeInTheDocument();
        });

        const markGoalButton = screen.getByRole('button', { name: /check/i });
        fireEvent.click(markGoalButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                '/api/goals/toggle_completed',
                { goalId: '1' },
                {
                    headers: {
                        Authorization: 'Bearer mockAuthToken'
                    }
                });
        });
    });

    test('link that navigates back to dashboard is present', async () => {
        mockGet.mockResolvedValueOnce({ data: mockJournal });

        render(<JournalPage />);

        // Wait for the page to finish loading and display elements
        await waitFor(() => {
            expect(screen.getByText('Mock Goal')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /arrow_back/i })).toBeInTheDocument();
        });
    });
});
