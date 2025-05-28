import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import {getPageUrl} from '../lib/helpers';

import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { createTheme } from "flowbite-react";
import { useState } from "react";
import CreateCategoryModal from '@/components/transaction_categories/create-category-modal';
import EditCategoryModal from '@/components/transaction_categories/edit-category-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaction Categories',
        href: route('transaction_category.index'),
    },
];

const toastThemeWithAbsolutePositioning = createTheme({
    toast: {
        root: {
            base: "absolute top-2 right-2 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400",
            closed: "opacity-0 ease-out"
        },
        toggle: {
            base: "-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white",
            icon: "h-5 w-5 shrink-0"
        }
    },
});

export default function TransactionCategories({ transactionCategoryPaginator }) {
    const onPageChange = (page: number) => router.visit(
        getPageUrl(transactionCategoryPaginator, page)
    );

    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                <ToastToggle />
            </Toast>}

            <Head title="Transaction Categories" />

            <div className='flex mb-4 mx-2'>
                <CreateCategoryModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} storeUrl={route('transaction_category.store')} />
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
                                                      setIsNotificationShown={setIsNotificationShown}
                                                      setNotificationMessage={setNotificationMessage}
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
