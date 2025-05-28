import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Datepicker, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { formatDate } from '@/lib/helpers';
import Editor from 'react-simple-wysiwyg';
import { useNotification } from '@/contexts/NotificationContext';

export default function CreateSavingsPlanModal() {
    const { showNotification } = useNotification();

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
                showNotification('Savings plan created');
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
                            <Label htmlFor="savings-tips">Savings tips</Label>
                            <Editor value={data.savings_tips} onChange={(e) => setData('savings_tips', e.target.value)} />
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
