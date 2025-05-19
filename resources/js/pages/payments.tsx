import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useForm } from '@inertiajs/react';
import {
    Toast,
    ToastToggle,
    createTheme, Avatar, Label, TextInput, Select, FileInput, Datepicker, Textarea, Button
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import '../../css/app.css';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { ListGroup, ListGroupItem } from "flowbite-react";
import CreateCategoryModal from '@/components/transaction_categories/create-category-modal';
import EditCategoryModal from '@/components/transaction_categories/edit-category-modal';
import { CreatePayment } from '@/components/payments/create-payment';
import dayjs from 'dayjs';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: route('payment.index'),
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

export default function Payments({ payments, paymentCategories, transactionCategories, accounts }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedPaymentId, setSelectedPaymentId] = useState(payments[0].id);

    const { data, setData, post, errors, reset } = useForm({
        payment_id: payments[0].id,
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm:ss'),
        name: null,
        account_number: null,
        amount: null,
        category_id: null,
        payment_category_id: null,
        receipts: [],
        source_id: null,
        source_type: null,
        note: null,
        card: '' //fake attribute to place validation errors in if card is expired
    });

    function getPaymentById(id) {
        return payments.filter(p => p.id == id)[0];
    }

    function selectPayment(paymentId) {
        setSelectedPaymentId(paymentId);

        setData('payment_id', paymentId);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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

            <Head title="Payments" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Payments</h2>
                    </div>
                    <div className='flex flex-row justify-between my-3'>
                        <CreateCategoryModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} storeUrl={route('payment_category.store')} />
                        <CreatePayment setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} transactionCategories={transactionCategories} paymentCategories={paymentCategories} />
                    </div>

                    {paymentCategories.length > 0 && <Accordion className='bg-white'>
                        {paymentCategories.map(paymentCategory => (
                            <AccordionPanel>
                                <AccordionTitle className='cursor-pointer'>
                                    <div className='flex flex-row items-center'>
                                        <Avatar img={paymentCategory.image_path} alt="avatar of Jese" rounded />
                                        <p className='ml-4'>{paymentCategory.name}</p>
                                        <EditCategoryModal key={paymentCategory.id + paymentCategory.name}
                                                           category={paymentCategory}
                                                           setIsNotificationShown={setIsNotificationShown}
                                                           setNotificationMessage={setNotificationMessage}
                                                           updateUrl={route('payment_category.update', {category: paymentCategory.id})} />
                                    </div>
                                </AccordionTitle>
                                <AccordionContent className='p-0'>
                                    {payments.filter(payment => payment.payment_category_id == paymentCategory.id).length > 0 &&
                                        <ListGroup className="rounded-none">
                                            {payments
                                                .filter(payment => payment.payment_category_id == paymentCategory.id)
                                                .map(payment =>
                                                    selectedPaymentId == payment.id
                                                        ? <ListGroupItem className='payment-category-list-item' active>{payment.name}</ListGroupItem>
                                                        : <ListGroupItem className='payment-category-list-item' onClick={() => setSelectedPaymentId(payment.id)}>{payment.name}</ListGroupItem>
                                                )}
                                        </ListGroup>
                                    }
                                </AccordionContent>
                            </AccordionPanel>
                        ))}
                    </Accordion>}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <div className="max-w-xl mx-auto p-6 bg-green-50 rounded-none shadow-md" key={selectedPaymentId}>
                        <h3 className='font-bold text-xl mb-4'>Make a payment</h3>

                        {/* Transaction name */}
                        <div className="mb-4">
                            <Label htmlFor="name">Payment name</Label>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Payment name"
                                value={getPaymentById(selectedPaymentId).name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        {/* Account number of payment receiver */}
                        <div className="mb-4">
                            <Label htmlFor="account-number">Account number of payment receiver</Label>
                            <TextInput
                                id="account-number"
                                type="text"
                                value={getPaymentById(selectedPaymentId).account_number}
                                onChange={e => setData('account_number', e.target.value)}
                            />
                            {errors.account_number && <p className="text-red-600 text-sm">{errors.account_number}</p>}
                        </div>

                        {/* Select Account */}
                        <div className="mb-4">
                            <Label htmlFor="recipient">Select Account</Label>
                            <Select id="account" onChange={e => {
                                setData('source_id', JSON.parse(e.target.value).id);
                                setData('source_type', JSON.parse(e.target.value).type);
                            }}>
                                <option></option>
                                {accounts.map(account => (
                                    <option key={account.id + account.type}
                                            value={JSON.stringify({ id: account.id, type: account.type })}
                                    >{account.type == 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}":
                                        ${account.balance}</option>
                                ))}
                            </Select>
                            {errors.source_id && <p className="text-red-600 text-sm">{errors.source_id}</p>}
                            {errors.card && <p className="text-red-600 text-sm">{errors.card}</p>}
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <Label htmlFor="amount">Amount</Label>
                            <TextInput
                                id="amount"
                                type="text"
                                placeholder="250.00"
                                value={getPaymentById(selectedPaymentId).amount}
                                onChange={e => setData('amount', e.target.value)}
                            />
                            {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
                        </div>

                        {/* Receipts */}
                        <div className="mb-4">
                            <Label htmlFor="files">Upload receipts</Label>
                            <FileInput id="files" multiple
                                       onChange={e => setData('receipts', e.target.files)} />
                        </div>

                        {/* Transaction Date */}
                        <div className="mb-4">
                            <Label htmlFor="transaction-date">Transaction Date</Label>
                            <Datepicker onChange={date => setData('date', dayjs(date).format('YYYY-MM-DD'))} />

                            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
                        </div>

                        {/* Transaction Time */}
                        <div className="mb-4">
                            <Label htmlFor="transaction-time">Transaction Time</Label>
                            <br />
                            <input type="time" id="transaction-time" value={data.time}
                                   onChange={e => setData('time', e.target.value)} />
                            {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
                        </div>

                        {/* Transaction Category */}
                        <div className="mb-4">
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" onChange={e => setData('category_id', e.target.value)} value={getPaymentById(selectedPaymentId).category_id}>
                                <option></option>
                                {transactionCategories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
                        </div>

                        {/* Payment Category */}
                        <div className="mb-4">
                            <Label htmlFor="payment-category">Payment category</Label>
                            <Select id="payment-category" onChange={e => setData('payment_category_id', e.target.value)} value={getPaymentById(selectedPaymentId).payment_category_id}>
                                <option></option>
                                {paymentCategories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors.payment_category_id && <p className="text-red-600 text-sm">{errors.payment_category_id}</p>}
                        </div>

                        {/* Note */}
                        <div className="mb-4">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                placeholder="Payment for shared vacation expenses"
                                rows={3}
                                onChange={e => setData('note', e.target.value)}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="submit">Send Money</Button>
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
