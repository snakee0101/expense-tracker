import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatCardNumber, formatDate } from '../lib/helpers';

import { useForm } from '@inertiajs/react';
import {
    Toast,
    ToastToggle,
    createTheme,
    Card,
    Button,
    Modal,
    ModalBody,
    ModalHeader, Label, TextInput, FileInput, Select, Textarea, Datepicker
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import '../../css/app.css';
import { CreateSavingsPlanModal } from '@/pages/savings_plans';
import { FaPlus } from 'react-icons/fa6';
import dayjs from 'dayjs';
import CreateContactModal from '@/components/transfers/create-contact-modal';
import EditSavingsPlanModal from '@/components/savings_plans/edit-savings-plan-modal';
import EditContactModal from '@/components/transfers/edit-contact-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: route('payment.index'),
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

export default function Payments({ payments, paymentCategories, accounts }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedPaymentId, setSelectedPaymentId] = useState(payments[0].id);

    const { data, setData, post, errors, reset } = useForm({
        payment_id: payments[0].id,
    });

    console.log(payments);
    console.log(paymentCategories);
    console.log(accounts);

    function selectPayment(paymentId) {
        setSelectedPaymentId(paymentId);

        setData('payment_id', paymentId);
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

            <Head title="Transfers" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Contacts</h2>
                        <CreateContactModal setIsNotificationShown={setIsNotificationShown}
                                            setNotificationMessage={setNotificationMessage} />
                    </div>

                    <p>payment categories list</p>
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    payment form
                </main>
            </div>
        </AppLayout>
    );
}
