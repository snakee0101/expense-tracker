import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { createTheme } from 'flowbite-react';
import SpendingLimit from '@/components/dashboard/spending-limit';
import ExpenseBreakdown from '@/components/dashboard/expense-breakdown';
import TotalCashflow from '@/components/dashboard/total-cashflow';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

const toastThemeWithAbsolutePositioning = createTheme({
    toast: {
        root: {
            base: 'absolute top-2 right-2 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400',
            closed: 'opacity-0 ease-out',
        },
        toggle: {
            base: '-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white',
            icon: 'h-5 w-5 shrink-0',
        },
    },
});

export default function Dashboard({spendingLimit, amountSpent, expenseBreakdown, expenseBreakdownStartingDate, expenseBreakdownEndingDate, cashflow}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className='flex flex-row m-2 items-start'>
                <SpendingLimit spendingLimit={spendingLimit} amountSpent={amountSpent} />
                <ExpenseBreakdown breakdown={expenseBreakdown} expenseBreakdownStartingDate={expenseBreakdownStartingDate} expenseBreakdownEndingDate={expenseBreakdownEndingDate} />
            </div>
            <div className='flex flex-row m-2 items-start'>
                <TotalCashflow cashflow={cashflow}/>
            </div>
        </AppLayout>
    );
}
