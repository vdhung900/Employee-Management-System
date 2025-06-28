export function getAllWorkingDatesBetween(startDate: Date | string, endDate: Date | string): Date[] {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format');
        }

        if (start > end) {
            throw new Error('Start date must be before or equal to end date');
        }

        const dates: Date[] = [];
        const current = new Date(start);

        while (current <= end) {
            const day = normalizeDate(current);
            const dow = day.getDay(); // 0: Sunday, 6: Saturday

            if (dow !== 0 && dow !== 6) {
                dates.push(new Date(day)); // Clone to avoid reference issues
            }

            current.setDate(current.getDate() + 1);
        }

        return dates;
    } catch (error) {
        console.error('Error in getAllWorkingDatesBetween:', error);
        throw error;
    }
}

export function normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
