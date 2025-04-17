import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney } from '../lib/helpers';

import { FaPlus } from 'react-icons/fa6';

import { useForm } from '@inertiajs/react';
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, Toast, ToastToggle, createTheme } from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cards',
        href: route('card.index'),
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

export default function Wallets({ cards }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedCardId, setSelectedCardId] = useState(cards[0].id);

    function selectCard(cardId) {
        setSelectedCardId(cardId);
    }

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

            <Head title="Cards" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="max-h-screen overflow-y-scroll rounded-lg bg-green-100 p-4 shadow-xl" style={{ width: 400 }}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Cards</h2>
                        <CreateCardModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} />
                    </div>

                    {cards.map((card) => (
                        <div
                            className="mb-4 max-w-sm cursor-pointer space-y-6 rounded-xl bg-green-800 p-6 pb-30 font-sans text-white shadow-lg"
                            style={{
                                background:
                                    selectedCardId == card.id
                                        ? 'repeating-linear-gradient(-45deg, #1E3D34, #1E3D34 10px, rgba(75, 75, 75, 1) 10px, rgba(75, 75, 75, 1) 60px, #1E3D34 60px, #1E3D34 140px)'
                                        : '',
                            }}
                            key={card.id}
                            onClick={() => selectCard(card.id)}
                        >
                            <div className="flex items-start justify-between">
                                <h2 className="font-medium">{card.name}</h2>
                            </div>

                            <div className="text-3xl font-semibold">
                                <span className="mr-1">$</span>
                                {formatMoney(card.balance)}
                            </div>
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <h1 className="mb-4 text-xl font-semibold">Main Content</h1>
                </main>
            </div>
        </AppLayout>
    );
}

export function CreateCardModal({ setIsNotificationShown, setNotificationMessage }) {
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
                onCloseModal();

                setNotificationMessage('Wallet created');
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
                <ModalHeader>Create New Wallet</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="wallet-name" value="Wallet Name" className="mb-2 block" />
                            <TextInput
                                id="wallet-name"
                                placeholder="Enter wallet name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors && <p className="text-red-600">{errors.name}</p>}
                        </div>

                        <div className="flex w-full justify-end">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
