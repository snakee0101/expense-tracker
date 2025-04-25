import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { router } from '@inertiajs/react';
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import {formatMoney} from '../lib/helpers';

import { FaPlus } from "react-icons/fa6";

import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, createTheme } from "flowbite-react";
import { useState } from "react";
import { useForm } from '@inertiajs/react';

import '../../css/app.css';
import { CreateIncomeExpense } from '@/components/main/create-income-expense';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallets',
        href: route('wallet.index'),
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

export default function Wallets({ wallets, transactionCategories }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedWalletId, setSelectedWalletId] = useState(wallets[0].id);

    function selectWallet(walletId) {
        setSelectedWalletId(walletId);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                <ToastToggle />
            </Toast>}

            <Head title="Wallets" />

            <div className="min-h-screen flex">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className='flex justify-between mb-4 items-center'>
                        <h2 className="text-xl font-bold">My Wallets</h2>
                        <CreateWalletModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage}/>
                    </div>

                    {wallets.map(wallet => (
                        <div className={`card p-6 pb-30 ${selectedWalletId == wallet.id ? 'selected-card' : 'bg-white'}`}
                             key={wallet.id}
                             onClick={() => selectWallet(wallet.id)}
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="font-medium">{wallet.name}</h2>
                            </div>

                            <div className="text-3xl font-semibold">
                                <span className='mr-1'>$</span>
                                {formatMoney(wallet.balance)}
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="flex-1 p-6 min-h-screen">
                    <CreateIncomeExpense key={selectedWalletId}
                                         transactionable={{ destination_type: 'App\\Models\\Wallet', destination_id: selectedWalletId }}
                                         setIsNotificationShown={setIsNotificationShown}
                                         setNotificationMessage={setNotificationMessage}
                                         transactionCategories={transactionCategories}
                    />
                </main>
            </div>
        </AppLayout>
    );
}

export function CreateWalletModal({ setIsNotificationShown, setNotificationMessage }) {
        const [openModal, setOpenModal] = useState(false);

        const { data, setData, post, processing, errors, clearErrors } = useForm({
            name: '',
        });

        const onCloseModal = () => {
            setOpenModal(false);
            clearErrors();
            setData('name', '');
        };

        const handleCreate = (event) => {
            event.preventDefault();

            post(route('wallet.store'), {
                onSuccess: () => {
                    onCloseModal()

                    setNotificationMessage('Wallet created')
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
                        Create New Wallet
                    </ModalHeader>
                    <ModalBody>
                        <form className="space-y-6" onSubmit={handleCreate}>
                            <div>
                                <Label htmlFor="wallet-name" className="mb-2 block">Wallet Name</Label>
                                <TextInput
                                    id="wallet-name"
                                    placeholder="Enter wallet name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors && <p className='text-red-600'>{errors.name}</p>}
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
