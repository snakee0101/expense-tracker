import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney, percent, formatDate } from '../lib/helpers';

import { FaPlus } from 'react-icons/fa6';

import { useForm } from '@inertiajs/react';
import { Datepicker, Button, Label, Modal, ModalBody, ModalHeader, TextInput, Toast, ToastToggle, createTheme, Progress, Card, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';

import '../../css/app.css';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Savings Plans',
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

export default function SavingsPlans({ savings_plans }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedSavingsPlanId, setSelectedSavingsPlanId] = useState(savings_plans[0].id);

    function selectSavingsPlan(savingsPlanId) {
        setSelectedSavingsPlanId(savingsPlanId);
    }

    function savingsPlanCompletionPercentage(savingsPlan) {
        return percent(savingsPlan.balance / savingsPlan.target_balance);
    }

    function daysRemainingUntil(targetDate) {
        const differenceInMilliseconds = new Date(targetDate) - new Date();
        const millisecondsInADay = 1000 * 60 * 60 * 24;

        return Math.ceil(differenceInMilliseconds / millisecondsInADay)
    }

    function selectedSavingsPlan() {
        return savings_plans.filter(plan => plan.id == selectedSavingsPlanId)[0];
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

            <Head title="Savings Plans" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">My Savings Plans</h2>
                        <CreateSavingsPlanModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} />
                    </div>

                    {savings_plans.map((savingsPlan) => (
                        <div className={`small-card ${selectedSavingsPlanId == savingsPlan.id ? 'selected-card' : 'bg-white'}`}
                             onClick={() => selectSavingsPlan(savingsPlan.id)}
                             key={savingsPlan.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{savingsPlan.name}</h3>
                                    <div className="text-sm mt-1">
                                        <span className="font-medium">${formatMoney(savingsPlan.balance)}</span>
                                        <span className=""> / ${formatMoney(savingsPlan.target_balance)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold">{savingsPlanCompletionPercentage(savingsPlan)}%</div>
                                    <div className={`text-sm font-medium
                                                    ${selectedSavingsPlanId == savingsPlan.id ? 'text-black' : (
                                                        savingsPlanCompletionPercentage(savingsPlan) == 100 ? 'text-emerald-600' : 'text-red-600'
                                                    )}`}>{savingsPlanCompletionPercentage(savingsPlan) == 100 ? 'Completed' : 'In Progress'}</div>
                                </div>
                            </div>
                            <div className='mt-1 mb-3'>
                                <p><span className='font-bold'>Due date</span>: {dayjs(savingsPlan.due_date).format('DD MMMM, YYYY')}</p>
                                <p>{`(${daysRemainingUntil(savingsPlan.due_date)} days remaining)`}</p>
                            </div>
                            <Progress progress={savingsPlanCompletionPercentage(savingsPlan)} color="teal" />
                        </div>
                    ))}
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    <Card className="savings-tips w-full">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Saving tips
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: selectedSavingsPlan().savings_tips }}></p>
                    </Card>
                </main>
            </div>
        </AppLayout>
    );
}

export function CreateSavingsPlanModal({ setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        target_balance: '',
        due_date: '',
        savings_tips: ''
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData({
            name: '',
            target_balance: '',
            due_date: '',
            savings_tips: ''
        });
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('savings_plan.store'), {
            onSuccess: () => {
                onCloseModal();
                setNotificationMessage('Savings plan created');
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
                <ModalHeader>Create Savings Plan</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="plan-name">Savings plan name</Label>
                            <TextInput
                                id="plan-name"
                                type="text"
                                placeholder="e.g. Vacation"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="target-balance">Target balance</Label>
                            <TextInput
                                id="target-balance"
                                type="text"
                                inputMode="numeric"
                                placeholder="500.50"
                                onChange={(e) => setData('target_balance', e.target.value)}
                            />
                            {errors.target_balance && <p className="text-red-600 text-sm">{errors.target_balance}</p>}
                        </div>

                        <div>
                            <Label htmlFor="due-date">Due Date</Label>
                            <Datepicker onChange={date => setData('due_date', formatDate(date))} />

                            {errors.due_date && <p className="text-red-600 text-sm">{errors.due_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="due-date">Savings tips</Label>
                            <Textarea id="due-date" placeholder="Savings tips..." rows={4} onChange={e => setData('savings_tips', e.target.value)} />

                            {errors.savings_tips && <p className="text-red-600 text-sm">{errors.savings_tips}</p>}
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
