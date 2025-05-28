import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button, Datepicker, Label, Modal, ModalBody, ModalHeader, Select, Textarea, TextInput } from 'flowbite-react';
import { formatDate } from '@/lib/helpers';
import dayjs from 'dayjs';
import { MdOutlineModeEditOutline } from 'react-icons/md';

import { useNotification } from '@/contexts/NotificationContext';

export default function EditRecurringPaymentModal({ recurringPayment, accounts }) {
    const { transactionCategories } = usePage().props;
    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: recurringPayment.name,
        note: recurringPayment.note,
        amount: recurringPayment.amount,
        category_id: recurringPayment.category_id,
        destination_id: recurringPayment.destination_id,
        destination_type: recurringPayment.destination_type,
        period_starting_date: new Date(dayjs(recurringPayment.period_starting_date).format('YYYY-MM-DD HH:mm:ss')),
        repeat_period: recurringPayment.repeat_period,
        card: ''
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
    };

    const handleEdit = (event) => {
        event.preventDefault();

        put(route('recurring_payment.update', {'recurring_payment': recurringPayment.id}), {
            onSuccess: () => {
                onCloseModal()
                showNotification('Recurring payment updated')
            }
        });
    };

    return (
        <>
            <a href='#' onClick={(e) => {
                e.preventDefault();
                setOpenModal(true);
            }} className='flex text-blue-500'>
                <MdOutlineModeEditOutline className='mr-2' size={20}/> <span>Edit</span>
            </a>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>
                    Edit Recurring Payment
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleEdit}>
                        <div>
                            <Label htmlFor="transaction-name" className="mb-2 block">Transaction Name</Label>
                            <TextInput
                                id="transaction-name"
                                placeholder="Enter Transaction Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className='text-red-600'>{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" onChange={e => setData('category_id', e.target.value)}>
                                {transactionCategories.map(category => (
                                    <option value={category.id} selected={category.id == data.category_id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors.category_id && <p className='text-red-600'>{errors.category_id}</p>}
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
                            {errors.amount && <p className='text-red-600'>{errors.amount}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="account">Account to withdraw money from</Label>
                            <Select id="account" onChange={e => {
                                setData('destination_id', JSON.parse(e.target.value).id);
                                setData('destination_type', JSON.parse(e.target.value).type);
                            }}>
                                {accounts.map(account => (
                                    <option key={account.id + account.type}
                                            value={JSON.stringify({id: account.id, type: account.type})}
                                            selected={account.type == data.destination_type && account.id == data.destination_id}
                                    >{account.type == 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}": ${account.balance}</option>
                                ))}
                            </Select>
                            {errors.destination_id && <p className="text-red-600 text-sm">{errors.destination_id}</p>}
                            {errors.card && <p className="text-red-600 text-sm">{errors.card}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="date">Period Starting Date</Label>
                            <Datepicker value={data.period_starting_date}
                                        onChange={date => setData('period_starting_date', formatDate(date))} />
                            {errors.period_starting_date && <p className="text-red-600 text-sm">{errors.period_starting_date}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="repeat_period">Repeat period (days)</Label>
                            <TextInput
                                id="repeat_period"
                                name="repeat_period"
                                type="number"
                                min={1}
                                max={31}
                                value={data.repeat_period}
                                onChange={e => setData('repeat_period', e.target.value)}
                                placeholder="1"
                            />
                            {errors.repeat_period && <p className='text-red-600'>{errors.repeat_period}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                name="note"
                                value={data.note}
                                onChange={e => setData('note', e.target.value)}
                                placeholder="Additional details..."
                                rows={3}
                            />
                        </div>

                        <div className="w-full flex justify-end">
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
