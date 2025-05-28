import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import SpendingLimit from '@/components/dashboard/spending-limit';
import ExpenseBreakdown from '@/components/dashboard/expense-breakdown';
import TotalCashflow from '@/components/main/total-cashflow';
import Balance from '@/components/dashboard/balance';
import SavingsPlans from '@/components/dashboard/savings_plans';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import IncomeExpenseStatistics from '@/components/dashboard/income-expense-statistics';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard({spendingLimit, amountSpent, expenseBreakdown, expenseBreakdownStartingDate, expenseBreakdownEndingDate, cashflow, accounts, savingsPlans, recentTransactions, transactionStatusList, incomeExpenseStatistics}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className='flex flex-row m-2 items-start'>
                <SpendingLimit spendingLimit={spendingLimit} amountSpent={amountSpent} />
                <ExpenseBreakdown breakdown={expenseBreakdown} expenseBreakdownStartingDate={expenseBreakdownStartingDate} expenseBreakdownEndingDate={expenseBreakdownEndingDate} />
            </div>
            <div className='flex flex-row m-2 items-start'>
                <TotalCashflow cashflow={cashflow} header='Total Cashflow' />
                <Balance accounts={accounts}/>
                <SavingsPlans savingsPlans={savingsPlans}/>
            </div>
            <div className='flex flex-row m-2 items-start'>
                <RecentTransactions transactions={recentTransactions} transactionStatusList={transactionStatusList} />
                <IncomeExpenseStatistics statistics={incomeExpenseStatistics} />
            </div>
        </AppLayout>
    );
}
