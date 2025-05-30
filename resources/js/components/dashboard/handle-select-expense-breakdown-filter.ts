import { router } from '@inertiajs/react';
import dayjs from 'dayjs';

export function handleSelectExpenseBreakdownFilter(event) {
    let expenseBreakdownDateRangeStart = null;
    let expenseBreakdownDateRangeEnd = null;

    const today = dayjs();

    switch (event.target.value) {
        case 'this year':
            expenseBreakdownDateRangeStart = today.startOf('year');
            expenseBreakdownDateRangeEnd = today.endOf('year');
            break;
        case 'these 6 months': {
            const month = today.month();
            if (month < 6) {
                expenseBreakdownDateRangeStart = today.startOf('year');
                expenseBreakdownDateRangeEnd = dayjs().month(5).endOf('month'); // June
            } else {
                expenseBreakdownDateRangeStart = dayjs().month(6).startOf('month'); // July
                expenseBreakdownDateRangeEnd = today.endOf('year');
            }
            break;
        }
        case 'this month':
            expenseBreakdownDateRangeStart = today.startOf('month');
            expenseBreakdownDateRangeEnd = today.endOf('month');
            break;
        case 'this week':
            expenseBreakdownDateRangeStart = today.startOf('week');
            expenseBreakdownDateRangeEnd = today.endOf('week');
            break;
        case 'this day':
            expenseBreakdownDateRangeStart = today.startOf('day');
            expenseBreakdownDateRangeEnd = today.endOf('day');
            break;
        default:
            return;
    }

    router.get(
        route('dashboard', {
            expenseBreakdownDateRangeStart: expenseBreakdownDateRangeStart.format('YYYY-MM-DD HH:mm:ss'),
            expenseBreakdownDateRangeEnd: expenseBreakdownDateRangeEnd.format('YYYY-MM-DD HH:mm:ss'),
        }),
    );
}
