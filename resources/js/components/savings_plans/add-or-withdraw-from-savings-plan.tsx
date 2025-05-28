import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Button, Datepicker, Label, Modal, ModalBody, ModalHeader, Radio, Select, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { useNotification } from '@/contexts/NotificationContext';

export default function AddOrWithdrawFromSavingsPlan({ savingsPlanId, relatedAccounts, refreshTransactionList }) {
    const { transactionCategories } = usePage().props;
    const { showNotification } = useNotification();

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
        card: ''
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
            card: ''
        });
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('savings_plan.transaction'), {
            onSuccess: () => {
                refreshTransactionList();
                onCloseModal();
                showNotification('Transaction created');
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
                            {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
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
                            {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
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
                            {errors.card && <p className="text-red-600 text-sm">{errors.card}</p>}
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
