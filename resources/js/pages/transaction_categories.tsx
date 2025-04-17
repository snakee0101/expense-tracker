import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { useState } from 'react';
import {getPageUrl} from '../lib/helpers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaction Categories',
        href: route('transaction_category.index'),
    },
];

export default function TransactionCategories({ transactionCategoryPaginator }) {
    console.log(transactionCategoryPaginator);

    const onPageChange = (page: number) => router.visit(
        getPageUrl(transactionCategoryPaginator, page)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Categories" />

            <Table>
                <TableHead>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {transactionCategoryPaginator.data.map((transactionCategory) => (
                        <TableRow key={transactionCategory.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell>{transactionCategory.name}</TableCell>
                            <TableCell>
                                Actions
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {transactionCategoryPaginator.last_page > 1 && <div className="flex overflow-x-auto sm:mr-3 sm:justify-end">
                <Pagination
                    currentPage={transactionCategoryPaginator.current_page}
                    totalPages={transactionCategoryPaginator.last_page}
                    onPageChange={onPageChange}
                    showIcons
                />
            </div>}
        </AppLayout>
    );
}
