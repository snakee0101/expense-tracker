import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { Card, Button } from 'flowbite-react';
import { useState } from 'react';

import '../../css/app.css';
import dayjs from 'dayjs';

import { RiDeleteBin6Line } from "react-icons/ri";
import { useNotification } from '@/contexts/NotificationContext';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inbox',
        href: route('inbox.index'),
    },
];

export default function Inbox({ notifications }) {
    const { showNotification } = useNotification();
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
        showNotification('Message deleted');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <h2 className="text-xl font-bold mb-3">My Notifications</h2>

                    {notifications.length > 0 && notifications.map((notification) => (
                        <div
                            className={`small-card ${selectedNotificationId == notification.id ? 'selected-card' : 'bg-white dark:bg-gray-800'} ${notification.read_at ? 'text-gray-400' : 'text-black'}`}
                            onClick={() => selectNotification(notification.id)}
                            key={notification.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className='flex justify-between'>
                                        <h3 className="text-lg font-semibold dark:text-gray-100">{notification.data.header}</h3>
                                        <p className='dark:text-gray-300'>{dayjs(notification.created_at).format('MMM D HH:mm')}</p>
                                    </div>
                                    <div className="text-sm mt-1 dark:text-gray-300">
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
