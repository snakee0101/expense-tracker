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
import { useState } from 'react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inbox',
        href: route('inbox.index'),
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

export default function Inbox({ notifications }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedNotificationId, setSelectedNotificationId] = useState(notifications[0].id);

    function selectNotification(notificationId) {
        setSelectedNotificationId(notificationId);
    }

    function selectedNotification() {
        return notifications.filter(notification => notification.id == selectedNotificationId)[0];
    }

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

            <Head title="Inbox" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    {notifications.map((notification) => (
                        <div
                            className={`small-card ${selectedNotificationId == notification.id ? 'selected-card' : 'bg-white'} ${notification.read_at ? 'text-gray-400' : 'text-black'}`}
                            onClick={() => selectNotification(notification.id)}
                            key={notification.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{notification.data.header}</h3>
                                    <div className="text-sm mt-1">
                                        {notification.data.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <Card className="savings-tips w-full rounded-none">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {selectedNotification().data.header}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400"
                           dangerouslySetInnerHTML={{ __html: selectedNotification().data.htmlContent }}></p>
                    </Card>
                </main>
            </div>
        </AppLayout>
    );
}
