import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import dayjs from 'dayjs';
import { JournalEntry } from '../services/interfaces'
import theme from '../theme/theme'
import { useTranslation } from 'react-i18next';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface JournalReviewChartProps {
    entries: JournalEntry[];
}

const JournalReviewChart: React.FC<JournalReviewChartProps> = ({ entries }) => {
    const { t } = useTranslation();

    // Not enough data
    if (entries.length < 1) {
        return (
            <Box>
                <Typography variant="body2">
                    {t('journalReviewChartNotEnoughData')}
                </Typography>
            </Box>
        );
    }

    // Initialise weekday counts
    const weekdayCounts = new Array(7).fill(0);

    // Time of day sum (in minutes from midnight)
    let totalMinutes = 0;
    let totalEntries = 0;

    entries.forEach(entry => {
        const date = dayjs(entry.created_at);
        const weekday = date.day(); // 0 (Sunday) to 6 (Saturday)
        weekdayCounts[weekday]++;

        // Calculate minutes from midnight
        const timeOfDayMinutes = date.hour() * 60 + date.minute();
        totalMinutes += timeOfDayMinutes;
        totalEntries++;
    });

    // Calculate average weekday and time of day
    const avgWeekday = weekdayCounts.indexOf(Math.max(...weekdayCounts));
    const avgTimeOfDayMinutes = totalEntries ? totalMinutes / totalEntries : 0;
    const avgHour = Math.floor(avgTimeOfDayMinutes / 60);
    const avgMinute = Math.floor(avgTimeOfDayMinutes % 60);

    const data = {
        labels: [
            t('journalReviewChartWeekdayLabelSunday'),
            t('journalReviewChartWeekdayLabelMonday'),
            t('journalReviewChartWeekdayLabelTuesday'),
            t('journalReviewChartWeekdayLabelWednesday'),
            t('journalReviewChartWeekdayLabelThursday'),
            t('journalReviewChartWeekdayLabelFriday'),
            t('journalReviewChartWeekdayLabelSaturday')
        ],
        datasets: [
            {
                label: t('journalReviewChartDatasetLabel'),
                data: weekdayCounts,
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.main,
                borderWidth: 0,
            },
        ],
    };

    return (
        <Box>
            <Bar style={{ marginBottom: '15px' }} data={data} />
            <Typography variant="overline">
                <span style={{ verticalAlign: 'middle' }} className="material-symbols-outlined">
                    lightbulb
                </span>
                <span style={{ verticalAlign: 'middle', marginLeft: '7.5px' }}>{t('journalReviewChartRecommendationHeader')}</span>
            </Typography>
            <Typography variant="body2" dangerouslySetInnerHTML={
                // Seemingly the only way to implement a translatable string with HTML formatting
                {
                    __html: t('journalReviewChartRecommendationBodyDaily')
                        .replace("{TIME}", `<strong>${avgHour}:${avgMinute < 10 ? '0' : ''}${avgMinute}</strong>`)
                        .replace("{WEEKDAY}", `<strong>${data.labels[avgWeekday]}</strong>`)
                }
            }></Typography>
        </Box>
    );
};

export default JournalReviewChart;