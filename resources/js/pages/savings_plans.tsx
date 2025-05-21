import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney, percent } from '../lib/helpers';

import {
    Toast,
    ToastToggle,
    createTheme,
    Progress,
    Card
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownRight } from "react-icons/go";
import { RiCoinsFill } from "react-icons/ri";
import { TfiTarget } from "react-icons/tfi";
import { GrPlan } from "react-icons/gr";

import '../../css/app.css';
import dayjs from 'dayjs';
import CreateSavingsPlanModal from '@/components/savings_plans/create-savings-plan-modal';
import AddOrWithdrawFromSavingsPlan from '@/components/savings_plans/add-or-withdraw-from-savings-plan';
import EditCardModal from '@/components/cards/edit-card-modal';
import EditSavingsPlanModal from '@/components/savings_plans/edit-savings-plan-modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AccountTransactions from '@/components/main/account-transactions';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Savings Plans',
        href: route('savings_plan.index'),
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

export default function SavingsPlans({ savings_plans, transactionCategories, relatedAccounts, total_savings_gain, savingsChartData, transactionStatusList }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedSavingsPlanId, setSelectedSavingsPlanId] = useState(savings_plans[0].id);

    function selectSavingsPlan(savingsPlanId) {
        setSelectedSavingsPlanId(savingsPlanId);
    }

    function savingsPlanCompletionPercentage(savingsPlan) {
        return percent(savingsPlan.balance / savingsPlan.target_balance);
    }

    function daysRemainingUntil(targetDate) {
        const differenceInMilliseconds = new Date(targetDate) - new Date();
        const millisecondsInADay = 1000 * 60 * 60 * 24;

        return Math.ceil(differenceInMilliseconds / millisecondsInADay)
    }

    function selectedSavingsPlan() {
        return savings_plans.filter(plan => plan.id == selectedSavingsPlanId)[0];
    }

    const totalTarget = savings_plans.reduce(function(total, plan) {
        return total + Number(plan.target_balance);
    }, 0);

    const totalSavings = savings_plans.reduce(function(total, plan) {
        return total + Number(plan.balance);
    }, 0);

    let chartDataForCurrentSavingsPlan = Object.values(savingsChartData).find(savingsChart => savingsChart.find(column => column.savings_plan_id == selectedSavingsPlanId));
    chartDataForCurrentSavingsPlan = chartDataForCurrentSavingsPlan?.sort(function (a, b) {
        if (a.month < b.month) {
            return -1;
        } else if (a.month > b.month) {
            return 1;
        }

        return 0;
    });

    let processedChartData = [];

    for (let chartItem of chartDataForCurrentSavingsPlan ?? []) {
        processedChartData.push({
            name: chartItem.month,
            balance: chartItem.savings_plan_balance,
        });
    }

    const stats = [
        {
            title: 'Total Savings',
            value: `$ ${formatMoney(totalSavings)}`,
            change: total_savings_gain + ' %',
            increase: total_savings_gain > 0,
            icon: <RiCoinsFill size={36} />
        },
        {
            title: 'Total Target',
            value: `$ ${formatMoney(totalTarget)}`,
            change: null,
            increase: false,
            icon: <TfiTarget size={36} />
        },
        {
            title: 'Total Plans',
            value: savings_plans.length,
            change: null,
            increase: true,
            icon: <GrPlan size={36} />
        },
    ];

    const [transactionsPaginator, setTransactionsPaginator] = useState(null);

    const filters = {
        account_type: "App\\Models\\SavingsPlan",
        account_id: selectedSavingsPlanId
    };

    useEffect(() => {
        axios.post(route('account_transactions.index'), filters).then(
            response => setTransactionsPaginator(response.data)
        );
    }, [selectedSavingsPlanId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                    <ToastToggle />
                </Toast>
            )}

            <Head title="Savings Plans" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-4">
                {stats.map((stat, index) => (
                    <Card key={index}
                          className="bg-green-50 flex rounded-none shadow-sm"
                    >
                        <div className="flex w-full flex-row justify-between items-center">
                            <div className="flex flex-col">
                                <h5 className="text-md font-medium text-gray-700">{stat.title}</h5>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {stat.value}

                                    {stat.change != null && <span
                                        className={`inline-flex items-center px-2 py-0.5 text-sm font-medium rounded-full ml-2 mt-2 ${stat.increase ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {stat.increase ? (
                                             <GoArrowUpRight className="w-4 h-4 mr-1" />
                                        ) : (
                                             <GoArrowDownRight className="w-4 h-4 mr-1" />
                                        )}
                                        {stat.change}
                                    </span>}

                                    {stat.change != null && <span className='text-sm ml-2 font-thin'>Compared to previous month</span>}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Savings Plans</h2>
                        <CreateSavingsPlanModal setIsNotificationShown={setIsNotificationShown}
                                                setNotificationMessage={setNotificationMessage} />
                    </div>

                    {savings_plans.map((savingsPlan) => (
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
                                               savingsPlan={selectedSavingsPlan()}
                                               setIsNotificationShown={setIsNotificationShown}
                                               setNotificationMessage={setNotificationMessage} />
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
                           dangerouslySetInnerHTML={{ __html: selectedSavingsPlan().savings_tips }}></p>
                    </Card>
                    <div className='mt-4'>
                        <AddOrWithdrawFromSavingsPlan key={selectedSavingsPlanId}
                                                      setIsNotificationShown={setIsNotificationShown}
                                                      setNotificationMessage={setNotificationMessage}
                                                      savingsPlanId={selectedSavingsPlanId}
                                                      transactionCategories={transactionCategories}
                                                      relatedAccounts={relatedAccounts}
                        />
                    </div>
                    <div className='mt-4 text-center'>
                        <h2 className='font-bold text-2xl my-4'>Savings plan balance change over this year</h2>

                        {chartDataForCurrentSavingsPlan ?
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
                                             transactionStatusList={transactionStatusList}
                                             filters={filters} />
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
