import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney, formatCardDate, formatCardNumber } from '../lib/helpers';
import { useEffect, useState } from 'react';

import '../../css/app.css';
import { CreateIncomeExpense } from '@/components/main/create-income-expense';
import CreateCardModal from '@/components/cards/create-card-modal';
import EditCardModal from '@/components/cards/edit-card-modal';
import TotalCashflow from '@/components/main/total-cashflow';
import axios from 'axios';
import AccountTransactions from '@/components/main/account-transactions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cards',
        href: route('card.index'),
    },
];

export default function Cards({ cards, chartData }) {
    const [selectedCardId, setSelectedCardId] = useState(cards.find(card => card.is_expired == false)?.id);

    let chartDataForCurrentCard = Object.values(chartData)
                                                   .filter(chart => chart.card_id == selectedCardId);

    function selectCard(cardId) {
        setSelectedCardId(cardId);
    }

    function selectedCard() {
        return cards.find(c => c.id = selectedCardId);
    }

    const [transactionsPaginator, setTransactionsPaginator] = useState(null);

    const filters = {
        account_type: "App\\Models\\Card",
        account_id: selectedCardId
    };

    const refreshTransactionList = () => axios.post(route('account_transactions.index'), filters).then(
        response => setTransactionsPaginator(response.data)
    );

    useEffect(() => {
        refreshTransactionList();
    }, [selectedCardId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cards" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Cards</h2>
                        <CreateCardModal />
                    </div>

                    {cards.map((card) => (
                        <div
                            className={`card p-6 pb-10 ${selectedCardId == card.id ? 'selected-card' : 'bg-white'} ${card.is_expired && 'text-gray-400'}`}
                            key={card.id}
                            onClick={() => selectCard(card.id)}
                        >
                            <div className="flex items-start justify-between">
                                <h2 className="font-medium">{card.name}</h2>
                                {card.is_expired && <span className='text-sm text-red-800'>Expired</span>}
                            </div>

                            <div className="text-3xl font-semibold">
                                <span className="mr-1">$</span>
                                {formatMoney(card.balance)}
                            </div>

                            <div className="text-xl flex justify-between">
                                <div>
                                    <span className="block text-sm text-gray-600">Card Number</span>
                                    <span>{formatCardNumber(card.card_number)}</span>
                                </div>

                                <div>
                                    <span className="block text-sm text-gray-600">Expiry Date</span>
                                    <span>{formatCardDate(card.expiry_date)}</span>
                                </div>
                            </div>

                            <div className='text-right'>
                                <EditCardModal key={selectedCardId}
                                                 card={card} />
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <div>
                        {selectedCardId && <CreateIncomeExpense key={selectedCardId}
                                             transactionable={{
                                                 destination_type: 'App\\Models\\Card',
                                                 destination_id: selectedCardId
                                             }}
                                             refreshTransactionList={refreshTransactionList}
                        />}
                    </div>
                    <div className='mt-3'>
                        <TotalCashflow key={selectedCardId} cashflow={chartDataForCurrentCard} header='Cashflow' />
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
