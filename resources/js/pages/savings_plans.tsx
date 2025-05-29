import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney, daysRemainingUntil, savingsPlanCompletionPercentage } from '../lib/helpers';

import { Progress, Card } from 'flowbite-react';
import { useState } from 'react';

import '../../css/app.css';
import dayjs from 'dayjs';
import CreateSavingsPlanModal from '@/components/savings_plans/create-savings-plan-modal';
import AddOrWithdrawFromSavingsPlan from '@/components/savings_plans/add-or-withdraw-from-savings-plan';
import EditSavingsPlanModal from '@/components/savings_plans/edit-savings-plan-modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AccountTransactions from '@/components/main/account-transactions';
import { useTransactions } from '@/hooks/use-transactions';
import SavingsPlansStatistics from '@/components/savings_plans/savings-plans-statistics';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Savings Plans',
        href: route('savings_plan.index'),
    },
];

export default function SavingsPlans({ savingsPlans, relatedAccounts, totalSavingsGain, savingsChartData }) {
    const [selectedSavingsPlanId, setSelectedSavingsPlanId] = useState(savingsPlans[0]?.id);

    function selectSavingsPlan(savingsPlanId) {
        setSelectedSavingsPlanId(savingsPlanId);
    }

    function selectedSavingsPlan() {
        return savingsPlans.filter(plan => plan.id == selectedSavingsPlanId)[0] ?? null;
    }

    let chartDataForCurrentSavingsPlan = Object.values(savingsChartData).filter(savingsChart => savingsChart.savings_plan_id == selectedSavingsPlanId);

    let processedChartData = [];

    for (let chartItem of chartDataForCurrentSavingsPlan ?? []) {
        processedChartData.push({
            name: chartItem.month,
            balance: chartItem.savings_plan_balance,
        });
    }

    const {transactionsPaginator, setTransactionsPaginator, filters, refreshTransactionList} = useTransactions("App\\Models\\SavingsPlan", selectedSavingsPlanId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Savings Plans" />

            <SavingsPlansStatistics savingsPlans={savingsPlans} totalSavingsGain={totalSavingsGain} />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Savings Plans</h2>
                        <CreateSavingsPlanModal />
                    </div>

                    {savingsPlans.map((savingsPlan) => (
                        <div
                            className={`small-card ${selectedSavingsPlanId == savingsPlan.id ? 'selected-card' : 'bg-white'}`}
                            onClick={() => selectSavingsPlan(savingsPlan.id)}
                            key={savingsPlan.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{savingsPlan.name}</h3>
                                    <div className="text-sm mt-1">
                                        <span className="font-medium">${formatMoney(savingsPlan.balance)}</span>
                                        <span className=""> / ${formatMoney(savingsPlan.target_balance)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">{savingsPlanCompletionPercentage(savingsPlan)}%</p>
                                    <p style={{ textWrap: 'nowrap' }}
                                       className={`text-sm font-medium
                                                    ${selectedSavingsPlanId == savingsPlan.id ? 'text-black' : (
                                           savingsPlanCompletionPercentage(savingsPlan) == 100 ? 'text-emerald-600' : 'text-red-600'
                                       )}`}>{savingsPlanCompletionPercentage(savingsPlan) == 100 ? 'Completed' : 'In Progress'}</p>
                                </div>
                            </div>
                            <div className='mt-1'>
                                <p><span
                                    className='font-bold'>Due date</span>: {dayjs(savingsPlan.due_date).format('DD MMMM, YYYY')}
                                </p>
                                <p>{`(${daysRemainingUntil(savingsPlan.due_date)} days remaining)`}</p>
                            </div>
                            <div className='text-right my-2'>
                                <EditSavingsPlanModal key={selectedSavingsPlanId}
                                                      savingsPlan={selectedSavingsPlan()} />
                            </div>
                            <Progress progress={savingsPlanCompletionPercentage(savingsPlan)} color="teal" />
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <Card className="savings-tips w-full rounded-none">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Saving tips
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400"
                           dangerouslySetInnerHTML={{ __html: selectedSavingsPlan()?.savings_tips }}></p>
                    </Card>
                    <div className='mt-4'>
                        {selectedSavingsPlanId && <AddOrWithdrawFromSavingsPlan key={selectedSavingsPlanId}
                                                      savingsPlanId={selectedSavingsPlanId}
                                                      relatedAccounts={relatedAccounts}
                                                      refreshTransactionList={refreshTransactionList}
                        />}
                    </div>
                    <div className='mt-4 text-center'>
                        <h2 className='font-bold text-2xl my-4'>Savings plan balance change over this year</h2>

                        {processedChartData.length > 0 ?
                        <ResponsiveContainer height={500} width={600} className='m-auto'>
                            <LineChart
                                width={500}
                                height={300}
                                data={processedChartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" label={{ value: 'Month number', position: 'insideBottomRight', offset: 0 }} />
                                <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}  />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer> : <p>No savings yet</p>}
                    </div>
                    <div className='mt-5'>
                        <AccountTransactions key={transactionsPaginator}
                                             transactionsPaginator={transactionsPaginator}
                                             setTransactionsPaginator={setTransactionsPaginator}
                                             filters={filters} />
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
