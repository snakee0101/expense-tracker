import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from 'flowbite-react';
import { formatMoney, getPageUrl } from '../lib/helpers';

import dayjs from 'dayjs';
import CreateRecurringPaymentModal from '@/components/recurring_payments/create-recurring-payment-modal';
import EditRecurringPaymentModal from '@/components/recurring_payments/edit-recurring-payment-modal';
import { MdOutlineHourglassDisabled } from "react-icons/md";
import { CiRedo } from "react-icons/ci";
import { useNotification } from '@/contexts/NotificationContext';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recurring Payments',
        href: route('recurring_payment.index'),
    },
];

export default function RecurringPayments({ payments, accounts }) {
    const { showNotification } = useNotification();
    const onPageChange = (page: number) => router.visit(getPageUrl(payments, page));

    const { data, put } = useForm({
        is_active: null,
    });

    function setPaymentActiveState(paymentId, isActive) {
        data.is_active = isActive;

        put(route('recurring_payment.set_active_state', {recurring_payment: paymentId}), {
            onSuccess: () => showNotification(isActive ? 'Payment Activated' : 'Payment Inactivated')
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recurring Payments" />

            <div className='m-3'>
                <CreateRecurringPaymentModal accounts={accounts}/>
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
                        <TableRow key={payment.id} className={`${payment.is_active == true ? 'bg-white' : 'bg-gray-100'} dark:border-gray-700 dark:bg-gray-800`}>
                            <TableCell className='py-1 px-3'>
                                <div className="flex w-full flex-row items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                        <img src={payment.category.imageUrl} className='rounded-full' />
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-lg font-bold text-gray-700 dark:text-gray-100">{payment.name}</h5>
                                        <h5 className="text-md text-gray-500 dark:text-gray-300">{payment.category.name}</h5>
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
                            <TableCell className='flex flex-row'>
                                <EditRecurringPaymentModal key={payment.id}
                                                      recurringPayment={payment}
                                                      accounts={accounts} />
                                {payment.is_active ? (
                                    <a href='#' onClick={(e) => {
                                        e.preventDefault();
                                        setPaymentActiveState(payment.id, false);
                                    }} className='flex text-red-500 ml-4'>
                                        <MdOutlineHourglassDisabled className='mr-2' size={20}/> <span>Inactivate</span>
                                    </a>
                                ) : (
                                    <a href='#' onClick={(e) => {
                                        e.preventDefault();
                                        setPaymentActiveState(payment.id, true);
                                    }} className='flex text-green-500 ml-4'>
                                        <CiRedo className='mr-2' size={20}/> <span>Activate</span>
                                    </a>
                                )}
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
