import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatCardNumber, formatDate } from '../lib/helpers';

import { useForm } from '@inertiajs/react';
import {
    Toast,
    ToastToggle,
    createTheme,
    Card,
    Button,
    Modal,
    ModalBody,
    ModalHeader, Label, TextInput, FileInput, Select, Textarea, Datepicker
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import '../../css/app.css';
import { CreateSavingsPlanModal } from '@/pages/savings_plans';
import { FaPlus } from 'react-icons/fa6';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transfers',
        href: route('savings_plan.index'),
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

export default function Transfers({ contacts, transactionCategories, accounts }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);

    const { data, setData, post, errors, reset } = useForm({
        name: '',
        related_account_id: null,
        related_account_type: null,
        amount: null,
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm:ss'),
        note: null,
        contact_id: contacts[0].id,
        category_id: null,
        receipts: []
    });

    function selectContact(contactId)
    {
        setSelectedContactId(contactId);

        setData('contact_id', contactId);
    }

    const handleCreateTransfer = (event) => {
        event.preventDefault();

        post(route('transfer.store'), {
            onSuccess: () => {
                setNotificationMessage('Transfer created');
                setIsNotificationShown(true);
                setTimeout(() => setIsNotificationShown(false), 3000);
            },
            forceFormData: true,
        });
    };

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

            <Head title="Transfers" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Contacts</h2>
                        <CreateContactModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} />
                    </div>

                    {contacts.map((contact, index) => (
                        <Card key={index}
                              className={`cursor-pointer bg-green-50 flex rounded-2xl shadow-sm mb-3 ${selectedContactId == contact.id ? 'selected-card' : 'bg-white'}`}
                              onClick={() => selectContact(contact.id)}
                        >
                            <div className="flex w-full flex-row items-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white mr-3">
                                    <img src={contact.avatar_path} className='rounded-full'/>
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-lg text-gray-700 font-bold">{contact.name}</h5>
                                    <h5 className="text-md text-gray-700">{formatCardNumber(contact.card_number)}</h5>
                                </div>
                            </div>
                        </Card>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <form className="max-w-xl mx-auto p-6 bg-green-50 rounded-xl shadow-md" onSubmit={handleCreateTransfer}>
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
                                setData('related_account_id', JSON.parse(e.target.value).id);
                                setData('related_account_type', JSON.parse(e.target.value).type);
                            }}>
                                <option></option>
                                {accounts.map(account => (
                                    <option key={account.id + account.type}
                                            value={JSON.stringify({id: account.id, type: account.type})}
                                    >{account.type == 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}": ${account.balance}</option>
                                ))}
                            </Select>
                            {errors.related_account_id && <p className="text-red-600 text-sm">{errors.related_account_id}</p>}
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
                            <input type="time" id="transaction-time" value={data.time} onChange={e => setData('time', e.target.value)} />
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
                    </form>
                </main>
            </div>
        </AppLayout>
    );
}

function CreateContactModal({ setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, errors, clearErrors, reset } = useForm({
        name: '',
        card_number: '',
        avatar: null,
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        reset();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('contact.store'), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal();
                setNotificationMessage('Contact created');
                setIsNotificationShown(true);
                setTimeout(() => setIsNotificationShown(false), 2000);
            },
        });
    };

    return (
        <>
            <Button size="xs" color="dark" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaPlus className="mr-2" size={15} /> Add
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Create Contact</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate} encType="multipart/form-data">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <TextInput
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="card-number">Card Number</Label>
                            <TextInput
                                id="card-number"
                                type="text"
                                inputMode="numeric"
                                placeholder="1234 5678 9012 3456"
                                value={data.card_number}
                                onChange={(e) => setData('card_number', e.target.value)}
                            />
                            {errors.card_number && <p className="text-red-600 text-sm">{errors.card_number}</p>}
                        </div>

                        <div>
                            <Label htmlFor="avatar">Avatar</Label>
                            <FileInput
                                id="avatar"
                                accept="image/*"
                                onChange={(e) => setData('avatar', e.target.files[0])}
                            />
                            {errors.avatar && <p className="text-red-600 text-sm">{errors.avatar}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
