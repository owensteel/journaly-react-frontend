// Common utils for timestamps

function getTimeDifferenceString(date1: Date, date2: Date, t: (refKey: string) => {}): string {

    const diff = date2.getTime() - date1.getTime();
    const diffAbs = Math.abs(diff);

    const seconds = Math.floor(diffAbs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    let result = '';
    if (weeks > 0) {
        result = `${weeks} ${t('utilsTimestampDifferenceStringWeek' + (weeks > 1 ? 's' : ''))}`;
    } else if (days > 0) {
        result = `${days} ${t('utilsTimestampDifferenceStringDay' + (days > 1 ? 's' : ''))}`;
    } else if (hours > 0) {
        result = `${hours} ${t('utilsTimestampDifferenceStringHour' + (hours > 1 ? 's' : ''))}`;
    } else if (minutes > 0) {
        result = `${minutes} ${t('utilsTimestampDifferenceStringMinute' + (minutes > 1 ? 's' : ''))}`;
    } else {
        result = `${seconds} ${t('utilsTimestampDifferenceStringSecond' + (seconds > 1 ? 's' : ''))}`;
    }

    if (diff > 0) {
        return `${result} ${t('utilsTimestampDifferenceStringTimeRemaining')}`;
    } else {
        return `${result} ${t('utilsTimestampDifferenceStringOverdue')}`;
    }
}

function getTimeCompletionPercentage(startDate: Date, endDate: Date, currentDate: Date = new Date()): number {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedTime = currentDate.getTime() - startDate.getTime();

    if (totalDuration <= 0) {
        throw new Error("End date must be after start date");
    }

    const completionPercentage = (elapsedTime / totalDuration) * 100;

    return Math.min(100, Math.max(0, completionPercentage));
}

const getTimeDifferenceToNow = (timestamp: string) => {
    return new Date().getTime() - new Date(timestamp).getTime()
}

export { getTimeDifferenceString, getTimeCompletionPercentage, getTimeDifferenceToNow }