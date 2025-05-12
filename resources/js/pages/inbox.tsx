import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import {
    Toast,
    ToastToggle,
    createTheme,
    Card,
    Button
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';

import '../../css/app.css';
import dayjs from 'dayjs';

import { RiDeleteBin6Line } from "react-icons/ri";


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

    const {post} = useForm();

    const [selectedNotificationId, setSelectedNotificationId] = useState(notifications[0]?.id ?? null);

    function selectNotification(notificationId) {
        post(route('inbox.read_notification', {notificationId: notificationId}));

        setSelectedNotificationId(notificationId);
    }

    function selectedNotification() {
        return notifications.filter(notification => notification.id == selectedNotificationId)[0];
    }

    function deleteNotification(notification_id) {
        post(route('inbox.delete_notification', {notificationId: notification_id}));
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
                    <h2 className="text-xl font-bold mb-3">My Notifications</h2>

                    {notifications.length > 0 && notifications.map((notification) => (
                        <div
                            className={`small-card ${selectedNotificationId == notification.id ? 'selected-card' : 'bg-white'} ${notification.read_at ? 'text-gray-400' : 'text-black'}`}
                            onClick={() => selectNotification(notification.id)}
                            key={notification.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className='flex justify-between'>
                                        <h3 className="text-lg font-semibold">{notification.data.header}</h3>
                                        <p>{dayjs(notification.created_at).format('MMM D HH:mm')}</p>
                                    </div>
                                    <div className="text-sm mt-1">
                                        {notification.data.description}
                                    </div>
                                    <div className='flex flex-row-reverse mt-2'>
                                        <Button size="xs" color="red" outline className='cursor-pointer' onClick={() => deleteNotification(notification.id)}>
                                            <RiDeleteBin6Line size={18}/>
                                        </Button>
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
                            {selectedNotification()?.data?.header ?? ''}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400"
                           dangerouslySetInnerHTML={{ __html: selectedNotification()?.data?.htmlContent ?? '' }}></p>
                    </Card>
                </main>
            </div>
        </AppLayout>
    );
}
