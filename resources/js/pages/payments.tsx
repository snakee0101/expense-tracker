import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { CreatePayment } from '@/components/payments/create-payment';
import CreateCategoryModal from '@/components/transaction_categories/create-category-modal';
import EditCategoryModal from '@/components/transaction_categories/edit-category-modal';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
    Accordion,
    AccordionContent,
    AccordionPanel,
    AccordionTitle,
    Avatar,
    Button,
    Datepicker,
    FileInput,
    Label,
    ListGroup,
    ListGroupItem,
    Select,
    TextInput,
    Textarea,
    Toast,
    ToastToggle,
    createTheme,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import '../../css/app.css';
import AccountTransactions from '@/components/main/account-transactions';
import axios from 'axios';

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

export default function Payments({ payments, paymentCategories, transactionCategories, accounts, transactionStatusList }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedPaymentId, setSelectedPaymentId] = useState(payments[0]?.id);

    const { data, setData, post, put, errors, reset } = useForm({
        payment_id: payments[0]?.id,
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm:ss'),
        name: payments[0]?.name,
        account_number: payments[0]?.account_number,
        amount: payments[0]?.amount,
        category_id: payments[0]?.category_id,
        payment_category_id: payments[0]?.payment_category_id,
        receipts: [],
        source_id: null,
        source_type: null,
        note: null,
        card: '', //fake attribute to place validation errors in if card is expired
    });

    function getPaymentById(id) {
        return payments.filter((p) => p.id == id)[0];
    }

    function selectPayment(paymentId) {
        setSelectedPaymentId(paymentId);
        const payment = getPaymentById(paymentId);

        setData({
            ...data,
            payment_id: paymentId,
            name: payment.name ?? '',
            account_number: payment.account_number ?? '',
            amount: payment.amount ?? '',
            category_id: payment.category_id ?? '',
            payment_category_id: payment.payment_category_id ?? '',
            note: payment.note ?? '',
        });
    }

    function handleEdit() {
        put(route('payment.update', { payment: selectedPaymentId }), {
            onSuccess: () => {
                setNotificationMessage('Payment updated');
                setIsNotificationShown(true);
                setTimeout(() => setIsNotificationShown(false), 3000);
            },
        });
    }

    function handlePayment() {
        post(route('payment.transaction', { payment: selectedPaymentId }), {
            onSuccess: () => {
                setNotificationMessage('Payment completed');
                setIsNotificationShown(true);
                setTimeout(() => setIsNotificationShown(false), 3000);
            },
        });
    }

    const [transactionsPaginator, setTransactionsPaginator] = useState(null);

    const filters = {
        account_type: "App\\Models\\Payment",
        account_id: selectedPaymentId
    };

    const refreshTransactionList = () => axios.post(route('account_transactions.index'), filters).then(
        response => setTransactionsPaginator(response.data)
    );

    useEffect(() => {
        refreshTransactionList();
    }, [selectedPaymentId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
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
                    <div className="my-3 flex flex-row justify-between">
                        <CreateCategoryModal
                            setIsNotificationShown={setIsNotificationShown}
                            setNotificationMessage={setNotificationMessage}
                            storeUrl={route('payment_category.store')}
                        />
                        <CreatePayment
                            setIsNotificationShown={setIsNotificationShown}
                            setNotificationMessage={setNotificationMessage}
                            transactionCategories={transactionCategories}
                            paymentCategories={paymentCategories}
                        />
                    </div>

                    {paymentCategories.length > 0 && (
                        <Accordion className="bg-white">
                            {paymentCategories.map((paymentCategory) => (
                                <AccordionPanel>
                                    <AccordionTitle className="cursor-pointer">
                                        <div className="flex flex-row items-center">
                                            <Avatar img={paymentCategory.image_path} alt="avatar of Jese" rounded />
                                            <p className="ml-4">{paymentCategory.name}</p>
                                            <EditCategoryModal
                                                key={paymentCategory.id + paymentCategory.name}
                                                category={paymentCategory}
                                                setIsNotificationShown={setIsNotificationShown}
                                                setNotificationMessage={setNotificationMessage}
                                                updateUrl={route('payment_category.update', { category: paymentCategory.id })}
                                            />
                                        </div>
                                    </AccordionTitle>
                                    <AccordionContent className="p-0">
                                        {payments.filter((payment) => payment.payment_category_id == paymentCategory.id).length > 0 && (
                                            <ListGroup className="rounded-none">
                                                {payments
                                                    .filter((payment) => payment.payment_category_id == paymentCategory.id)
                                                    .map(payment => (
                                                        <ListGroupItem
                                                            key={payment.id}
                                                            className="payment-category-list-item"
                                                            active={selectedPaymentId === payment.id}
                                                            onClick={() => selectPayment(payment.id)}
                                                        >
                                                            {payment.name}
                                                        </ListGroupItem>
                                                    ))
                                                }
                                            </ListGroup>
                                        )}
                                    </AccordionContent>
                                </AccordionPanel>
                            ))}
                        </Accordion>
                    )}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <div className="mx-auto max-w-xl rounded-none bg-green-50 p-6 shadow-md" key={selectedPaymentId}>
                        <h3 className="mb-4 text-xl font-bold">Make a payment</h3>

                        {/* Payment Name */}
                        <div className="mb-4">
                            <Label htmlFor="name">Payment name</Label>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Payment name"
                                value={data.name ?? ''}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Account Number */}
                        <div className="mb-4">
                            <Label htmlFor="account-number">Account number of payment receiver</Label>
                            <TextInput
                                id="account-number"
                                type="text"
                                value={data.account_number ?? ''}
                                onChange={(e) => setData('account_number', e.target.value)}
                            />
                            {errors.account_number && <p className="text-sm text-red-600">{errors.account_number}</p>}
                        </div>

                        {/* Select Account */}
                        <div className="mb-4">
                            <Label htmlFor="account">Select Account</Label>
                            <Select
                                id="account"
                                onChange={(e) => {
                                    const value = JSON.parse(e.target.value);
                                    setData('source_id', value.id);
                                    setData('source_type', value.type);
                                }}
                            >
                                <option></option>
                                {accounts.map((account) => (
                                    <option key={account.id + account.type} value={JSON.stringify({ id: account.id, type: account.type })}>
                                        {account.type === 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}": ${account.balance}
                                    </option>
                                ))}
                            </Select>
                            {errors.source_id && <p className="text-sm text-red-600">{errors.source_id}</p>}
                            {errors.card && <p className="text-sm text-red-600">{errors.card}</p>}
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <Label htmlFor="amount">Amount</Label>
                            <TextInput
                                id="amount"
                                type="text"
                                placeholder="250.00"
                                value={data.amount ?? ''}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                        </div>

                        {/* Receipts */}
                        <div className="mb-4">
                            <Label htmlFor="files">Upload receipts</Label>
                            <FileInput id="files" multiple onChange={(e) => setData('receipts', e.target.files)} />
                        </div>

                        {/* Transaction Date */}
                        <div className="mb-4">
                            <Label htmlFor="transaction-date">Transaction Date</Label>
                            <Datepicker onChange={(date) => setData('date', dayjs(date).format('YYYY-MM-DD'))} />
                            {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                        </div>

                        {/* Transaction Time */}
                        <div className="mb-4">
                            <Label htmlFor="transaction-time">Transaction Time</Label>
                            <input type="time" id="transaction-time" value={data.time ?? ''} onChange={(e) => setData('time', e.target.value)} />
                            {errors.time && <p className="text-sm text-red-600">{errors.time}</p>}
                        </div>

                        {/* Transaction Category */}
                        <div className="mb-4">
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" value={data.category_id ?? ''} onChange={(e) => setData('category_id', e.target.value)}>
                                <option></option>
                                {transactionCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                        </div>

                        {/* Payment Category */}
                        <div className="mb-4">
                            <Label htmlFor="payment-category">Payment category</Label>
                            <Select
                                id="payment-category"
                                value={data.payment_category_id ?? ''}
                                onChange={(e) => setData('payment_category_id', e.target.value)}
                            >
                                <option></option>
                                {paymentCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.payment_category_id && <p className="text-sm text-red-600">{errors.payment_category_id}</p>}
                        </div>

                        {/* Note */}
                        <div className="mb-4">
                            <Label htmlFor="note">Note</Label>
                            <Textarea id="note" rows={3} value={data.note ?? ''} onChange={(e) => setData('note', e.target.value)} />
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex justify-end gap-2">
                            <Button color="yellow" onClick={handleEdit}>
                                Edit template
                            </Button>
                            <Button onClick={handlePayment}>Make payment</Button>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <AccountTransactions key={selectedPaymentId}
                                             transactionsPaginator={transactionsPaginator}
                                             setTransactionsPaginator={setTransactionsPaginator}
                                             transactionStatusList={transactionStatusList}
                                             filters={filters} />
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
