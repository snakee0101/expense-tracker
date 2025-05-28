import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
    Select,
} from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { useNotification } from '@/contexts/NotificationContext';

export function CreatePayment({ transactionCategories, paymentCategories }) {
    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        amount: 0,
        payment_category_id: null,
        category_id: null,
        account_number: ''
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData({
            name: '',
            amount: 0,
            payment_category_id: null,
            category_id: null,
            account_number: ''
        });
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('payment.store'), {
            onSuccess: () => {
                onCloseModal();
                showNotification('Payment created');
            },
            forceFormData: true,
        });
    };

    return (
        <>
            <Button size="xs" color="dark" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaPlus className="mr-2" size={15} /> Create Payment
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Create Payment</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="payment-name">Payment name</Label>
                            <TextInput
                                id="payment-name"
                                type="text"
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="account-number">Account number of payment receiver</Label>
                            <TextInput
                                id="account-number"
                                type="text"
                                onChange={e => setData('account_number', e.target.value)}
                            />
                            {errors.account_number && <p className="text-red-600 text-sm">{errors.account_number}</p>}
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
                            <Label htmlFor="category">Transaction category</Label>
                            <Select id="category" required onChange={e => setData('category_id', e.target.value)}>
                                <option selected></option>
                                {transactionCategories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="payment-category">Payment category</Label>
                            <Select id="payment-category" required onChange={e => setData('payment_category_id', e.target.value)}>
                                <option selected></option>
                                {paymentCategories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Select>
                            {errors.payment_category_id && <p className="text-red-600 text-sm">{errors.payment_category_id}</p>}
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
