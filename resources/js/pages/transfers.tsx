import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import { formatCardNumber } from '../lib/helpers';

import { useForm } from '@inertiajs/react';
import { Card, Button, Label, TextInput, FileInput, Select, Textarea, Datepicker } from 'flowbite-react';
import { useEffect, useState } from 'react';
import '../../css/app.css';
import dayjs from 'dayjs';
import CreateContactModal from '@/components/transfers/create-contact-modal';
import EditContactModal from '@/components/transfers/edit-contact-modal';
import AccountTransactions from '@/components/main/account-transactions';
import axios from 'axios';
import { useNotification } from '@/contexts/NotificationContext';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transfers',
        href: route('transfer.index'),
    },
];

export default function Transfers({ contacts, accounts }) {
    const { transactionCategories } = usePage().props;
    const { showNotification } = useNotification();

    const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id);

    const { data, setData, post, errors, reset } = useForm({
        name: '',
        source_id: null,
        source_type: null,
        amount: null,
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm:ss'),
        note: null,
        contact_id: contacts[0]?.id,
        category_id: null,
        receipts: [],
        card: ''
    });

    function selectContact(contactId) {
        setSelectedContactId(contactId);

        setData('contact_id', contactId);
    }

    const handleCreateTransfer = (event) => {
        event.preventDefault();

        post(route('transfer.store'), {
            onSuccess: () => showNotification('Transfer created'),
            forceFormData: true,
        });
    };

    const [transactionsPaginator, setTransactionsPaginator] = useState(null);

    const filters = {
        account_type: "App\\Models\\Contact",
        account_id: selectedContactId
    };

    const refreshTransactionList = () => axios.post(route('account_transactions.index'), filters).then(
        response => setTransactionsPaginator(response.data)
    );

    useEffect(() => {
        refreshTransactionList();
    }, [selectedContactId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transfers" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Contacts</h2>
                        <CreateContactModal />
                    </div>

                    {contacts.map((contact, index) => (
                        <Card key={index}
                              className={`cursor-pointer bg-green-50 flex rounded-none shadow-sm mb-3 ${selectedContactId == contact.id ? 'selected-card' : 'bg-white'}`}
                              onClick={() => selectContact(contact.id)}
                        >
                            <div className="flex w-full flex-row items-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white mr-3">
                                    <img src={contact.avatar_path} className='rounded-full' />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-lg text-gray-700 font-bold">{contact.name}</h5>
                                    <div className='flex'>
                                        <h5 className="text-md text-gray-700 mr-4">{formatCardNumber(contact.card_number)}</h5>
                                        <EditContactModal key={contact.id}
                                                          contact={contact} />
                                    </div>
                                </div>
                            </div>
                            <div className='text-right'>

                            </div>
                        </Card>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    {selectedContactId && <form className="max-w-xl mx-auto p-6 bg-green-50 rounded-none shadow-md"
                          onSubmit={handleCreateTransfer}>
                        <h3 className='font-bold text-xl mb-4'>Create Transfer</h3>

                        {/* Transaction name */}
                        <div className="mb-4">
                            <Label htmlFor="name">Transaction name</Label>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Transaction name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
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
                            <Select id="category" onChange={e => setData('category_id', e.target.value)}>
                                <option></option>
                                {transactionCategories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
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
                    </form>}

                    <div className='mt-5'>
                        <AccountTransactions key={transactionsPaginator}
                                             transactionsPaginator={transactionsPaginator}
                                             setTransactionsPaginator={setTransactionsPaginator}
                                             filters={filters} />
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
