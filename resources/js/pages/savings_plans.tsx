import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { formatMoney, percent, formatDate } from '../lib/helpers';

import { FaPlus } from 'react-icons/fa6';

import { useForm } from '@inertiajs/react';
import {
    Datepicker,
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
    Toast,
    ToastToggle,
    createTheme,
    Progress,
    Card,
    Radio, Select
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownRight } from "react-icons/go";
import { RiCoinsFill } from "react-icons/ri";
import { TfiTarget } from "react-icons/tfi";
import { GrPlan } from "react-icons/gr";

import '../../css/app.css';
import dayjs from 'dayjs';
import Editor from 'react-simple-wysiwyg';

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

export default function SavingsPlans({ savings_plans, transactionCategories, relatedAccounts }) {
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

    const totalTarget = savings_plans.reduce(function (total, plan) {
        return total + Number(plan.target_balance);
    }, 0);

    const totalSavings = savings_plans.reduce(function (total, plan) {
        return total + Number(plan.balance);
    }, 0);

    const stats = [
        {
            title: 'Total Savings',
            value: `$ ${formatMoney(totalSavings)}`,
            change: '??? %',
            increase: true,
            icon: <RiCoinsFill size={36} />
        },
        {
            title: 'Total Target',
            value: `$ ${formatMoney(totalTarget)}`,
            change: '??? %',
            increase: false,
            icon: <TfiTarget size={36} />
        },
        {
            title: 'Total Plans',
            value: savings_plans.length,
            change: '??? %',
            increase: true,
            icon: <GrPlan size={36} />
        },
    ];

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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-4">
                {stats.map((stat, index) => (
                    <Card key={index}
                        className="bg-green-50 flex rounded-2xl shadow-sm"
                    >
                        <div className="flex w-full flex-row justify-between items-center">
                            <div className="flex flex-col">
                                <h5 className="text-md font-medium text-gray-700">{stat.title}</h5>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {stat.value}
                                    <span className={`inline-flex items-center px-2 py-0.5 text-sm font-medium rounded-full ml-2 mt-2 ${stat.increase ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {stat.increase ? (
                                            <GoArrowUpRight className="w-4 h-4 mr-1" />
                                        ) : (
                                            <GoArrowDownRight className="w-4 h-4 mr-1" />
                                        )}
                                        {stat.change}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

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
                                    <p className="text-lg font-semibold">{savingsPlanCompletionPercentage(savingsPlan)}%</p>
                                    <p style={{textWrap: 'nowrap'}}
                                       className={`text-sm font-medium
                                                    ${selectedSavingsPlanId == savingsPlan.id ? 'text-black' : (
                                                        savingsPlanCompletionPercentage(savingsPlan) == 100 ? 'text-emerald-600' : 'text-red-600'
                                                    )}`}>{savingsPlanCompletionPercentage(savingsPlan) == 100 ? 'Completed' : 'In Progress'}</p>
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
                    <div className='mt-4'>
                        <AddOrWithdrawFromSavingsPlan key={selectedSavingsPlanId}
                                                      setIsNotificationShown={setIsNotificationShown}
                                                      setNotificationMessage={setNotificationMessage}
                                                      savingsPlanId={selectedSavingsPlanId}
                                                      transactionCategories={transactionCategories}
                                                      relatedAccounts={relatedAccounts}
                        />
                    </div>
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

    function onSavingsTipsChange(e) {
        setData('savings_tips', e.target.value)
    }

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
                            <Label htmlFor="savings-tips">Savings tips</Label>
                            <Editor value={data.savings_tips} onChange={onSavingsTipsChange} />
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

export function AddOrWithdrawFromSavingsPlan({ savingsPlanId, setIsNotificationShown, setNotificationMessage, transactionCategories, relatedAccounts }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm:ss'),
        is_withdraw: true,
        amount: 0,
        note: null,
        category_id: null,
        savings_plan_id: savingsPlanId,
        related_account_id: null,
        related_account_type: null,
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData({
            name: '',
            date: dayjs().format('YYYY-MM-DD'),
            time: dayjs().format('HH:mm:ss'),
            is_withdraw: true,
            amount: 0,
            note: null,
            category_id: null,
            savings_plan_id: savingsPlanId,
            source_id: null,
            related_account_type: null,
        });
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('savings_plan.transaction'), {
            onSuccess: () => {
                onCloseModal();
                setNotificationMessage('Transaction created');
                setIsNotificationShown(true);
                setTimeout(() => setIsNotificationShown(false), 3000);
            },
        });
    };

    return (
        <>
            <Button size="xs" color="dark" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaPlus className="mr-2" size={15} /> Add To/Withdraw From Savings plan
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Add To/Withdraw From Savings plan</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="transaction-name">Transaction name</Label>
                            <TextInput
                                id="transaction-name"
                                type="text"
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="transaction-date">Transaction Date</Label>
                            <Datepicker onChange={date => setData('date', dayjs(date).format('YYYY-MM-DD'))} />

                            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="transaction-time">Transaction Time</Label>
                            <br />
                            <input type="time" id="transaction-time" value={data.time} onChange={e => setData('time', e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="amount">Amount</Label>
                            <TextInput
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min={0.01}
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="mb-4 flex max-w-md flex-col gap-4">
                            <Label>Transaction type</Label>
                            <div className="flex items-center gap-2">
                                <Radio id="withdraw" name="is_withdraw" value={1} defaultChecked onChange={e => e.target.checked && setData('is_withdraw', e.target.value)} />
                                <Label htmlFor="withdraw">Withdraw from savings plan</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="add" name="is_withdraw" value={0} onChange={e => e.target.checked && setData('is_withdraw', e.target.value)} />
                                <Label htmlFor="add">Add to savings plan</Label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="note">Note</Label>
                            <TextInput
                                id="note"
                                name="note"
                                type="text"
                                value={data.note}
                                onChange={e => setData('note', e.target.value)}
                                placeholder="Additional details..."
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="account">Account to withdraw from/to transfer to</Label>
                            <Select id="account" required onChange={e => {
                                setData('related_account_id', JSON.parse(e.target.value).id);
                                setData('related_account_type', JSON.parse(e.target.value).type);
                            }}>
                                <option selected></option>
                                {relatedAccounts.map(account => (
                                    <option value={JSON.stringify({id: account.id, type: account.type})}>{account.type == 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}": ${account.balance}</option>
                                ))}
                            </Select>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" required onChange={e => setData('category_id', e.target.value)}>
                                <option selected></option>
                                {transactionCategories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Select>
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
