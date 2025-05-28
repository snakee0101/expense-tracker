import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Datepicker, Label, Modal, ModalBody, ModalHeader, Select, Textarea, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { formatDate } from '@/lib/helpers';
import dayjs from 'dayjs';

export default function CreateRecurringPaymentModal({ transactionCategories, accounts }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        note: null,
        amount: 0,
        category_id: null,
        destination_id: null,
        destination_type: null,
        period_starting_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        repeat_period: null,
        card: ''
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('recurring_payment.store'), {
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Recurring payment created')
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
                    Create Recurring Payment
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="transaction-name" className="mb-2 block">Transaction Name</Label>
                            <TextInput
                                id="transaction-name"
                                placeholder="Enter Transaction Name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors && <p className='text-red-600'>{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" onChange={e => setData('category_id', e.target.value)}>
                                <option selected></option>
                                {transactionCategories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors && <p className='text-red-600'>{errors.category_id}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="amount">Amount</Label>
                            <TextInput
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min={0.01}
                                onChange={e => setData('amount', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors && <p className='text-red-600'>{errors.amount}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="account">Account to withdraw money from</Label>
                            <Select id="account" onChange={e => {
                                setData('destination_id', JSON.parse(e.target.value).id);
                                setData('destination_type', JSON.parse(e.target.value).type);
                            }}>
                                <option></option>
                                {accounts.map(account => (
                                    <option key={account.id + account.type}
                                            value={JSON.stringify({id: account.id, type: account.type})}
                                    >{account.type == 'App\\Models\\Wallet' ? 'Wallet' : 'Card'} "{account.name}": ${account.balance}</option>
                                ))}
                            </Select>
                            {errors.destination_id && <p className="text-red-600 text-sm">{errors.destination_id}</p>}
                            {errors.card && <p className="text-red-600 text-sm">{errors.card}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="date">Period Starting Date</Label>
                            <Datepicker onChange={date => setData('period_starting_date', formatDate(date))} />
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
                                onChange={e => setData('note', e.target.value)}
                                placeholder="Additional details..."
                                rows={3}
                            />
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
