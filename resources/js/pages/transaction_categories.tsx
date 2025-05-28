import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import {getPageUrl} from '../lib/helpers';

import CreateCategoryModal from '@/components/transaction_categories/create-category-modal';
import EditCategoryModal from '@/components/transaction_categories/edit-category-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaction Categories',
        href: route('transaction_category.index'),
    },
];

export default function TransactionCategories({ transactionCategoryPaginator }) {
    const onPageChange = (page: number) => router.visit(
        getPageUrl(transactionCategoryPaginator, page)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Categories" />

            <div className='flex mb-4 mx-2'>
                <CreateCategoryModal storeUrl={route('transaction_category.store')} />
            </div>

            <Table>
                <TableHead>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {transactionCategoryPaginator.data.map((transactionCategory) => (
                        <TableRow key={transactionCategory.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell>
                                <div className="flex w-full flex-row items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                        <img src={transactionCategory.imageUrl} className='rounded-full' />
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-gray-700">{transactionCategory.name}</h5>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <EditCategoryModal key={transactionCategory.id + transactionCategory.name}
                                                      category={transactionCategory}
                                                      updateUrl={route('transaction_category.update', {category: transactionCategory.id})} />
                                </div>
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
