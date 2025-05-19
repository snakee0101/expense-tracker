import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney, formatCardDate, formatCardNumber } from '../lib/helpers';

import { Toast, ToastToggle, createTheme } from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';

import '../../css/app.css';
import { CreateIncomeExpense } from '@/components/main/create-income-expense';
import CreateCardModal from '@/components/cards/create-card-modal';
import EditWalletModal from '@/components/wallets/edit-wallet-modal';
import EditCardModal from '@/components/cards/edit-card-modal';
import TotalCashflow from '@/components/main/total-cashflow';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cards',
        href: route('card.index'),
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

export default function Cards({ cards, transactionCategories, chartData }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedCardId, setSelectedCardId] = useState(cards.find(card => card.is_expired == false).id);

    let chartDataForCurrentCard = Object.values(chartData)
                                                   .filter(chart => chart.card_id == selectedCardId);

    function selectCard(cardId) {
        setSelectedCardId(cardId);
    }

    function selectedCard() {
        return cards.find(c => c.id = selectedCardId);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                    <ToastToggle />
                </Toast>
            )}

            <Head title="Cards" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Cards</h2>
                        <CreateCardModal setIsNotificationShown={setIsNotificationShown}
                                         setNotificationMessage={setNotificationMessage} />
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
                                                 card={card}
                                                 setIsNotificationShown={setIsNotificationShown}
                                                 setNotificationMessage={setNotificationMessage} />
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <div>
                        <CreateIncomeExpense key={selectedCardId}
                                             transactionable={{
                                                 destination_type: 'App\\Models\\Card',
                                                 destination_id: selectedCardId
                                             }}
                                             setIsNotificationShown={setIsNotificationShown}
                                             setNotificationMessage={setNotificationMessage}
                                             transactionCategories={transactionCategories}
                        />
                    </div>
                    <div className='mt-3'>
                        <TotalCashflow key={selectedCardId} cashflow={chartDataForCurrentCard} header='Cashflow' />
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
