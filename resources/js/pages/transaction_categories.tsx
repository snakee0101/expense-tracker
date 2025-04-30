import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import { FileInput, Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import {getPageUrl} from '../lib/helpers';

import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, createTheme } from "flowbite-react";
import { useState } from "react";
import { useForm } from '@inertiajs/react';

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
                <CreateCategoryModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage}/>
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

export function CreateCategoryModal({ setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        image: null
    });

    const onCloseModal = () => {
        setOpenModal(false);
        reset();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('transaction_category.store'), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Transaction category created')
                setIsNotificationShown(true)

                setTimeout(() => setIsNotificationShown(false), 2000)
            }
        });
    };

    return (
        <>
            <Button onClick={() => setOpenModal(true)} size="xs">Create Category</Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>
                    Create New Category
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="category-name" className="mb-2 block">Category Name</Label>
                            <TextInput
                                id="category-name"
                                placeholder="Enter category name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors && <p className='text-red-600 text-sm'>{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="category-image">Category Image</Label>
                            <FileInput
                                id="category-image"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files[0])}
                            />
                            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                        </div>

                        <div className="w-full flex justify-end">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
