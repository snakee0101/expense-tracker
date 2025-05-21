import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

import { formatMoney, getPageUrl } from '../lib/helpers';

import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { createTheme } from "flowbite-react";
import { useEffect, useState } from 'react';

import '../../css/app.css';
import { CreateIncomeExpense } from '@/components/main/create-income-expense';
import CreateWalletModal from '@/components/wallets/create-wallet-modal';
import EditWalletModal from '@/components/wallets/edit-wallet-modal';
import TotalCashflow from '@/components/main/total-cashflow';
import AccountTransactions from '@/components/main/account-transactions';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallets',
        href: route('wallet.index'),
    },
];

const toastThemeWithAbsolutePositioning = createTheme({
    toast: {
        root: {
            base: "absolute top-2 right-2 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400",
            closed: "opacity-0 ease-out"
        },
        toggle: {
            base: "-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white",
            icon: "h-5 w-5 shrink-0"
        }
    },
});

export default function Wallets({ wallets, transactionCategories, chartData, transactionStatusList }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedWalletId, setSelectedWalletId] = useState(wallets[0].id);

    let chartDataForCurrentWallet = Object.values(chartData)
                                                    .filter(chart => chart.wallet_id == selectedWalletId);

    function selectWallet(walletId) {
        setSelectedWalletId(walletId);
    }

    function selectedWallet() {
        return wallets.find(w => w.id = selectedWalletId);
    }

    const [transactionsPaginator, setTransactionsPaginator] = useState(null);

    const filters = {
        account_type: "App\\Models\\Wallet",
        account_id: selectedWalletId
    };

    useEffect(() => {
        axios.post(route('account_transactions.index'), filters).then(
            response => setTransactionsPaginator(response.data)
        );
    }, [selectedWalletId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                <div
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                <ToastToggle />
            </Toast>}

            <Head title="Wallets" />

            <div className="min-h-screen flex">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className='flex justify-between mb-4 items-center'>
                        <h2 className="text-xl font-bold">My Wallets</h2>
                        <CreateWalletModal setIsNotificationShown={setIsNotificationShown}
                                           setNotificationMessage={setNotificationMessage} />
                    </div>

                    {wallets.map(wallet => (
                        <div
                            className={`card p-6 pb-20 ${selectedWalletId == wallet.id ? 'selected-card' : 'bg-white'}`}
                            key={wallet.id}
                            onClick={() => selectWallet(wallet.id)}
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="font-medium">{wallet.name}</h2>
                            </div>

                            <div className="text-3xl font-semibold">
                                <span className='mr-1'>$</span>
                                {formatMoney(wallet.balance)}
                            </div>

                            <div className='text-right'>
                                <EditWalletModal key={selectedWalletId}
                                                 wallet={wallet}
                                                 setIsNotificationShown={setIsNotificationShown}
                                                 setNotificationMessage={setNotificationMessage} />
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="flex-1 p-6 min-h-screen">
                    <div>
                        <CreateIncomeExpense key={selectedWalletId}
                                             transactionable={{
                                                 destination_type: 'App\\Models\\Wallet',
                                                 destination_id: selectedWalletId
                                             }}
                                             setIsNotificationShown={setIsNotificationShown}
                                             setNotificationMessage={setNotificationMessage}
                                             transactionCategories={transactionCategories}
                        />
                    </div>
                    <div className='mt-3'>
                        <TotalCashflow key={selectedWalletId} cashflow={chartDataForCurrentWallet} header='Cashflow' />
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
