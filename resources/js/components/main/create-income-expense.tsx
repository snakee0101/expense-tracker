import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Button,
    Datepicker,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Radio,
    TextInput,
    Select,
    FileInput
} from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import dayjs from 'dayjs';

export function CreateIncomeExpense({ transactionable, setIsNotificationShown, setNotificationMessage, transactionCategories }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm:ss'),
        is_income: true,
        amount: 0,
        note: null,
        category_id: null,
        destination_type: transactionable.destination_type,
        destination_id: transactionable.destination_id,
        receipts: [],
        card: '' //fake attribute to place validation errors in if card is expired
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData({
            name: '',
            date: dayjs().format('YYYY-MM-DD'),
            time: dayjs().format('HH:mm:ss'),
            is_income: true,
            amount: 0,
            note: null,
            category_id: null,
            destination_type: transactionable.destination_type,
            destination_id: transactionable.destination_id,
            receipts: [],
            card: ''
        });
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('income_expense.store'), {
            onSuccess: () => {
                onCloseModal();
                setNotificationMessage('Transaction created');
                setIsNotificationShown(true);
                setTimeout(() => setIsNotificationShown(false), 3000);
            },
            forceFormData: true,
        });
    };

    return (
        <>
            <Button size="xs" color="dark" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaPlus className="mr-2" size={15} /> Create Income/Expense
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Create Income/Expense</ModalHeader>
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
                            {errors.card && <p className="text-red-600 text-sm">{errors.card}</p>}
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
                                <Radio id="income" name="is_income" value={1} defaultChecked onChange={e => e.target.checked && setData('is_income', e.target.value)} />
                                <Label htmlFor="income">Income</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="expense" name="is_income" value={0} onChange={e => e.target.checked && setData('is_income', e.target.value)} />
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
