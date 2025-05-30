import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney } from '../lib/helpers';

import { useState } from 'react';

import '../../css/app.css';
import { CreateIncomeExpense } from '@/components/main/create-income-expense';
import CreateWalletModal from '@/components/wallets/create-wallet-modal';
import EditWalletModal from '@/components/wallets/edit-wallet-modal';
import TotalCashflow from '@/components/main/total-cashflow';
import AccountTransactions from '@/components/main/account-transactions';
import { useTransactions } from '@/hooks/use-transactions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallets',
        href: route('wallet.index'),
    },
];

export default function Wallets({ wallets, chartData }) {
    const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id);

    let chartDataForCurrentWallet = Object.values(chartData)
                                                    .filter(chart => chart.wallet_id == selectedWalletId);

    const {transactionsPaginator, setTransactionsPaginator, filters, refreshTransactionList} = useTransactions("App\\Models\\Wallet", selectedWalletId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wallets" />

            <div className="min-h-screen flex">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className='flex justify-between mb-4 items-center'>
                        <h2 className="text-xl font-bold">My Wallets</h2>
                        <CreateWalletModal />
                    </div>

                    {wallets.map(wallet => (
                        <div
                            className={`card p-6 pb-20 ${selectedWalletId == wallet.id ? 'selected-card' : 'bg-white dark:bg-gray-800'}`}
                            key={wallet.id}
                            onClick={() => setSelectedWalletId(wallet.id)}
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
                                                 wallet={wallet} />
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="flex-1 p-6 min-h-screen">
                    <div>
                        {selectedWalletId && <CreateIncomeExpense key={selectedWalletId}
                                             transactionable={{
                                                 destination_type: 'App\\Models\\Wallet',
                                                 destination_id: selectedWalletId
                                             }}
                                             refreshTransactionList={refreshTransactionList}
                        />}
                    </div>
                    <div className='mt-3'>
                        <TotalCashflow key={selectedWalletId} cashflow={chartDataForCurrentWallet} header='Cashflow' />
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
