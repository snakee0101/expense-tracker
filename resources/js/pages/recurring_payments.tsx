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
                    <TableHeadCell>Source</TableHeadCell>
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
                                name + category
                            </TableCell>
                            <TableCell>
                                <b>{payment.source?.typeName}</b> {payment.source?.name}
                            </TableCell>
                            <TableCell>
                                {dayjs(payment.period_starting_date).format('YYYY-MM-DD')}
                            </TableCell>
                            <TableCell>{payment.repeat_period}</TableCell>
                            <TableCell>${formatMoney(payment.amount)}</TableCell>
                            <TableCell className={'break-all'}>{payment.note ?? '-'}</TableCell>
                            <TableCell></TableCell>
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

export function CreateRecurringPaymentModal({ setIsNotificationShown, setNotificationMessage, transactionCategories, accounts }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        note: null,
        amount: 0,
        category_id: null,
        source_id: null,
        source_type: null,
        period_starting_date: null,
        repeat_period: null
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('recurring_payment.store'), {
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Recurring payment created')
                setIsNotificationShown(true)

                setTimeout(() => setIsNotificationShown(false), 2000)
            }
        });
    };

    return (
        <>
            <Button size='xs' color='dark' className='cursor-pointer' onClick={() => setOpenModal(true)}>
                <FaPlus className='mr-2' size={15}/> Add
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>
                    Create Recurring Payment
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="transaction-name" className="mb-2 block">Transaction Name</Label>
                            <TextInput
                                id="transaction-name"
                                placeholder="Enter Transaction Name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors && <p className='text-red-600'>{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" required onChange={e => setData('category_id', e.target.value)}>
                                <option selected></option>
                                {transactionCategories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors && <p className='text-red-600'>{errors.category_id}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="amount">Amount</Label>
                            <TextInput
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min={0.01}
                                onChange={e => setData('amount', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors && <p className='text-red-600'>{errors.amount}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="recipient">Account to withdraw money from</Label>
                            <Select id="account" onChange={e => {
                                setData('source_id', JSON.parse(e.target.value).id);
                                setData('source_type', JSON.parse(e.target.value).type);
                            }}>
                                <option></option>
                                {accounts.map(account => (
                                    <option key={account.id + account.type}
                                            value={JSON.stringify({id: account.id, type: account.type})}
                                    >{account.type == 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}": ${account.balance}</option>
                                ))}
                            </Select>
                            {errors.source_id && <p className="text-red-600 text-sm">{errors.source_id}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="date">Period Starting Date</Label>
                            <Datepicker onChange={date => setData('period_starting_date', formatDate(date))} />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="repeat_period">Repeat period (days)</Label>
                            <TextInput
                                id="repeat_period"
                                name="repeat_period"
                                type="number"
                                min={1}
                                onChange={e => setData('repeat_period', e.target.value)}
                                placeholder="1"
                            />
                            {errors && <p className='text-red-600'>{errors.repeat_period}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                name="note"
                                onChange={e => setData('note', e.target.value)}
                                placeholder="Additional details..."
                                rows={3}
                            />
                            {errors && <p className='text-red-600'>{errors.note}</p>}
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
