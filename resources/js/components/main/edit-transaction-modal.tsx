import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button, Datepicker, Label, Modal, ModalBody, ModalHeader, Radio, TextInput, Select, FileInput } from 'flowbite-react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import dayjs from 'dayjs';
import { useNotification } from '@/contexts/NotificationContext';

export function EditTransactionModal({ transaction }) {
    const { transactionStatusList, transactionCategories } = usePage().props;

    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: transaction.name,
        date: dayjs(transaction.date).format('YYYY-MM-DD'),
        time: dayjs(transaction.date).format('HH:mm:ss'),
        is_income: transaction.amount > 0 ? 1 : 0,
        amount: Math.abs(transaction.amount),
        note: transaction.note,
        category_id: transaction.category_id,
        destination_type: transaction.destination_type,
        destination_id: transaction.destination_id,
        receipts: [],
        card: '' //fake attribute to place validation errors in if card is expired
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
    };

    const handleEdit = (event) => {
        console.log(data);
        
        event.preventDefault();

        /*put(route('transaction.update', {transaction: transaction.id}), {
            onSuccess: () => {
                onCloseModal();
                showNotification('Transaction updated');
            },
            forceFormData: true,
        });*/
    };

    return (
        <>
            <a href="#" onClick={ (e) => {e.preventDefault(); setOpenModal(true)} } className='flex items-center text-blue-500 hover:underline'>
                 <MdOutlineModeEditOutline className='mr-2' size={20}/> Edit
            </a>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Edit transaction</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleEdit}>
                        <div>
                            <Label htmlFor="transaction-name">Transaction name</Label>
                            <TextInput
                                id="transaction-name"
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                            {errors.card && <p className="text-red-600 text-sm">{errors.card}</p>}
                        </div>

                        <div>
                            <Label htmlFor="transaction-date">Transaction Date</Label>
                            <Datepicker value={new Date(data.date)} onChange={date => setData('date', dayjs(date).format('YYYY-MM-DD'))} />

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

                        <div className="mb-4">
                            <Label htmlFor="files">Upload receipts</Label>
                            <FileInput id="files" multiple
                                       onChange={e => setData('receipts', e.target.files)} />
                        </div>

                        <div className="mb-4 flex max-w-md flex-col gap-4">
                            <Label>Transaction type</Label>
                            <div className="flex items-center gap-2">
                                <Radio id="income" name="is_income" value={1} defaultChecked={data.is_income == 1} onChange={e => e.target.checked && setData('is_income', e.target.value)} />
                                <Label htmlFor="income">Income</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="expense" name="is_income" value={0} defaultChecked={data.is_income == 0} onChange={e => e.target.checked && setData('is_income', e.target.value)} />
                                <Label htmlFor="expense">Expense</Label>
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
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" required value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                                <option selected></option>
                                {transactionCategories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
