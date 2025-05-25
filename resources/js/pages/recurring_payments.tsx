import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import {
    Badge,
    Button, Datepicker, Label, Modal, ModalBody, ModalHeader,
    Pagination, Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow, Textarea, TextInput, Toast, ToastToggle
} from 'flowbite-react';
import { formatMoney, formatDate, getPageUrl } from '../lib/helpers';

import { createTheme } from 'flowbite-react';
import dayjs from 'dayjs';
import { ImAttachment } from "react-icons/im";
import { CreateWalletModal } from '@/pages/wallets';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { HiCheck } from 'react-icons/hi';
import CreateRecurringPaymentModal from '@/components/recurring_payments/create-recurring-payment-modal';
import EditSavingsPlanModal from '@/components/savings_plans/edit-savings-plan-modal';
import EditRecurringPaymentModal from '@/components/recurring_payments/edit-recurring-payment-modal';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recurring Payments',
        href: route('recurring_payment.index'),
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

export default function RecurringPayments({ payments, transactionCategories, accounts }) {
    const onPageChange = (page: number) => router.visit(getPageUrl(payments, page));

    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recurring Payments" />

            {isNotificationShown && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                    <ToastToggle />
                </Toast>
            )}

            <div className='m-3'>
                <CreateRecurringPaymentModal setIsNotificationShown={setIsNotificationShown}
                                             setNotificationMessage={setNotificationMessage}
                                             transactionCategories={transactionCategories}
                                             accounts={accounts}/>
            </div>

            <Table>
                <TableHead>
                    <TableHeadCell>Transaction Name</TableHeadCell>
                    <TableHeadCell>Destination</TableHeadCell>
                    <TableHeadCell>Period Starting Date</TableHeadCell>
                    <TableHeadCell>Repeat Period (Days)</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Note</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {payments.data.map((payment) => (
                        <TableRow key={payment.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell className='py-1 px-3'>
                                <div className="flex w-full flex-row items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                        <img src={payment.category.imageUrl} className='rounded-full' />
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-lg font-bold text-gray-700">{payment.name}</h5>
                                        <h5 className="text-md text-gray-500">{payment.category.name}</h5>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <b>{payment.destination?.typeName}</b> {payment.destination?.name}
                            </TableCell>
                            <TableCell>
                                {dayjs(payment.period_starting_date).format('YYYY-MM-DD')}
                            </TableCell>
                            <TableCell>{payment.repeat_period}</TableCell>
                            <TableCell>${formatMoney(payment.amount)}</TableCell>
                            <TableCell className={'break-all'}>{payment.note ?? '-'}</TableCell>
                            <TableCell>
                                <EditRecurringPaymentModal key={payment.id}
                                                      recurringPayment={payment}
                                                      setIsNotificationShown={setIsNotificationShown}
                                                      setNotificationMessage={setNotificationMessage}
                                                      transactionCategories={transactionCategories}
                                                      accounts={accounts} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {payments.last_page > 1 && (
                <div className="flex overflow-x-auto sm:mr-3 sm:justify-end">
                    <Pagination currentPage={payments.current_page} totalPages={payments.last_page} onPageChange={onPageChange} showIcons />
                </div>
            )}
        </AppLayout>
    );
}
