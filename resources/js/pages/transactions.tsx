import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { formatMoney, buildQueryUrl, findKeyByValue } from '../lib/helpers';

import dayjs from 'dayjs';
import { ImAttachment } from "react-icons/im";
import { MdOutlineCancel } from "react-icons/md";
import { CiRedo } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from 'react';
import TransactionStatus from '@/components/main/transaction-status';
import Filters from '@/components/dashboard/filters';
import axios from 'axios';
import { useNotification } from '@/contexts/NotificationContext';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: route('transaction.index'),
    },
];

export default function Transactions({ transactions }) {
    const { transactionStatusList } = usePage().props;
    const { showNotification } = useNotification();

    const [searchFilters, setSearchFilters] = useState({});

    const onPageChange = (page: number) => {
        const url = buildQueryUrl(route('transaction.search'), page, searchFilters);
        axios.get(url)
            .then(response => setTransactionPaginator(response.data));
    };

    const [transactionPaginator, setTransactionPaginator] = useState(transactions);

    const { delete: destroy } = useForm({});

    function handleDelete(event, transaction) {
        event.preventDefault();

        if(confirm('Are you sure to delete a transaction? The operation is irreversible')) {
            destroy(route('transaction.destroy', {transaction: transaction.id}), {
                onSuccess: () => {
                    showNotification('Transaction deleted');
                    onPageChange(transactionPaginator.current_page);
                },
            });
        }
    }

    const cancelled = findKeyByValue(transactionStatusList, 'Cancelled');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

            <Filters setTransactionPaginator={setTransactionPaginator} setSearchFilters={setSearchFilters} />

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
                                        <h5 className="text-lg font-bold text-gray-700 dark:text-gray-100">{transaction.name}</h5>
                                        <h5 className="text-md text-gray-500 dark:text-gray-300">{transaction.category.name}</h5>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><b>{transaction.source?.typeName}</b> {transaction.source?.name}</TableCell>
                            <TableCell><b>{transaction.destination?.typeName}</b> {transaction.destination?.name}</TableCell>
                            <TableCell>
                                <p className="text-black dark:text-gray-100 font-bold">{dayjs(transaction.date).format('YYYY-MM-DD')}</p>
                                <p className="text-gray-400">{dayjs(transaction.date).format('hh:mm A')}</p>
                            </TableCell>
                            <TableCell>${formatMoney(transaction.amount)}</TableCell>
                            <TableCell className={'break-all'}>{transaction.note ?? '-'}</TableCell>
                            <TableCell>
                                <TransactionStatus status={transaction.status} />
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
                                {transaction.status == cancelled
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
