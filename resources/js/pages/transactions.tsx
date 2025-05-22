import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import {
    Badge,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Button,
    Toast, ToastToggle
} from 'flowbite-react';
import { formatMoney, getPageUrl } from '../lib/helpers';

import { createTheme } from 'flowbite-react';
import dayjs from 'dayjs';
import { ImAttachment } from "react-icons/im";
import Link from "next/link";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { CiRedo } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiCheck } from 'react-icons/hi';
import { useState } from 'react';
import TransactionStatus from '@/components/main/transaction-status';
import Filters from '@/components/dashboard/filters';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: route('transaction.index'),
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

export default function Transactions({ transactions, transactionStatusList }) {
    const onPageChange = (page: number) => router.visit(getPageUrl(transactions, page));

    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [transactionPaginator, setTransactionPaginator] = useState(transactions);

    const { data, setData, delete: destroy, errors, reset } = useForm({});

        function handleDelete(event, transaction) {
        event.preventDefault();

        if(confirm('Are you sure to delete a transaction? The operation is irreversible')) {
            destroy(route('transaction.destroy', {transaction: transaction.id}), {
                onSuccess: () => {
                    setNotificationMessage('Transaction deleted');
                    setIsNotificationShown(true);
                    setTimeout(() => setIsNotificationShown(false), 3000);
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

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

            <Filters setTransactionPaginator={setTransactionPaginator} />

            <Table>
                <TableHead>
                    <TableHeadCell>Transaction Name</TableHeadCell>
                    <TableHeadCell>Source</TableHeadCell>
                    <TableHeadCell>Destination</TableHeadCell>
                    <TableHeadCell>Date & Time</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Note</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Attachments</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {transactionPaginator.data.map((transaction) => (
                        <TableRow key={transaction.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell className='py-1 px-3'>
                                <div className="flex w-full flex-row items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                        <img src={transaction.category.imageUrl} className='rounded-full' />
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-lg font-bold text-gray-700">{transaction.name}</h5>
                                        <h5 className="text-md text-gray-500">{transaction.category.name}</h5>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><b>{transaction.source?.typeName}</b> {transaction.source?.name}</TableCell>
                            <TableCell><b>{transaction.destination?.typeName}</b> {transaction.destination?.name}</TableCell>
                            <TableCell>
                                <p className="text-black font-bold">{dayjs(transaction.date).format('YYYY-MM-DD')}</p>
                                <p className="text-gray-400">{dayjs(transaction.date).format('hh:mm A')}</p>
                            </TableCell>
                            <TableCell>${formatMoney(transaction.amount)}</TableCell>
                            <TableCell className={'break-all'}>{transaction.note ?? '-'}</TableCell>
                            <TableCell>
                                <TransactionStatus status={transaction.status}
                                                   statusList={transactionStatusList}
                                />
                            </TableCell>
                            <TableCell>
                                <dl>
                                    {transaction.attachments.map(attachment => (
                                        <dd className='flex items-center mb-1'>
                                            <ImAttachment size={16}/>
                                            <a href={route('download_attachment', attachment.id)} className='text-blue-500 underline hover:no-underline ml-1'>{attachment.original_filename}</a>
                                        </dd>
                                    ))}
                                </dl>
                            </TableCell>
                            <TableCell>
                                {transaction.status == 3
                                    ? (<a href={route('transaction.redo', {transaction: transaction.id})} className='text-green-600 hover:underline flex items-center mb-1'>
                                            <CiRedo className='mr-1' size={18}/> Redo
                                        </a>)
                                    : (<a href={route('transaction.cancel', {transaction: transaction.id})} className='text-red-600 hover:underline flex items-center mb-1'>
                                            <MdOutlineCancel className='mr-1' size={18}/> Cancel
                                        </a>)
                                }
                                <a href="#" onClick={(event) => handleDelete(event, transaction)} className='text-red-800 hover:underline flex items-center'>
                                    <RiDeleteBin6Line className='mr-1' size={18}/> Delete
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {transactionPaginator.last_page > 1 && (
                <div className="flex overflow-x-auto sm:mr-3 sm:justify-end">
                    <Pagination currentPage={transactionPaginator.current_page} totalPages={transactionPaginator.last_page} onPageChange={onPageChange} showIcons />
                </div>
            )}
        </AppLayout>
    );
}
