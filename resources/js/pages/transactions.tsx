import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import { Badge, Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { formatMoney, getPageUrl } from '../lib/helpers';

import { createTheme } from 'flowbite-react';
import dayjs from 'dayjs';
import { ImAttachment } from "react-icons/im";


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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

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
                    {transactions.data.map((transaction) => (
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
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {transactions.last_page > 1 && (
                <div className="flex overflow-x-auto sm:mr-3 sm:justify-end">
                    <Pagination currentPage={transactions.current_page} totalPages={transactions.last_page} onPageChange={onPageChange} showIcons />
                </div>
            )}
        </AppLayout>
    );
}

function TransactionStatus({status, statusList})
{
    let badgeColor = null;

    switch (status) {
        case 1: //Pending
            badgeColor = 'warning';
            break;
        case 2: //Completed
            badgeColor = 'success';
            break;
        case 3: //Cancelled
            badgeColor = 'failure';
            break;
    }

    return <Badge color={badgeColor} className='inline'>{statusList[status]}</Badge>;
}
