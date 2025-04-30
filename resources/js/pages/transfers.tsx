import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatCardNumber } from '../lib/helpers';

import { useForm } from '@inertiajs/react';
import {
    Toast,
    ToastToggle,
    createTheme,
    Card,
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import '../../css/app.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transfers',
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

export default function Transfers({ contacts, transactionCategories, accounts }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                    <ToastToggle />
                </Toast>
            )}

            <Head title="Transfers" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Contacts</h2>
                        <button>+</button>
                    </div>

                    {contacts.map((contact, index) => (
                        <Card key={index}
                              className={`cursor-pointer bg-green-50 flex rounded-2xl shadow-sm mb-3 ${selectedContactId == contact.id ? 'selected-card' : 'bg-white'}`}
                              onClick={() => setSelectedContactId(contact.id)}
                        >
                            <div className="flex w-full flex-row items-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white mr-3">
                                    <img src={contact.avatar_path} />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-lg text-gray-700 font-bold">{contact.name}</h5>
                                    <h5 className="text-md text-gray-700">{formatCardNumber(contact.card_number)}</h5>
                                </div>
                            </div>
                        </Card>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    main content
                </main>
            </div>
        </AppLayout>
    );
}
