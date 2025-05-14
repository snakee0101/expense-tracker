import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Datepicker, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { formatDate } from '@/lib/helpers';
import Editor from 'react-simple-wysiwyg';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import dayjs from 'dayjs';

export default function EditSavingsPlanModal({ savingsPlan, setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: savingsPlan.name,
        target_balance: savingsPlan.target_balance,
        due_date: new Date(dayjs(savingsPlan.due_date).format('YYYY-MM-DD HH:mm:ss')),
        savings_tips: savingsPlan.savings_tips
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
    };

    const handleEdit = (event) => {
        event.preventDefault();

        data.due_date = dayjs(data.due_date).format('YYYY-MM-DD HH:mm:ss');

        put(route('savings_plan.update', {savings_plan: savingsPlan.id}), {
            onSuccess: () => {
                onCloseModal();
                setNotificationMessage('Savings plan updated');
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
            <div className='flex flex-row-reverse'>
                <a href="#" onClick={ (e) => {e.preventDefault(); setOpenModal(true)} } className='flex items-center text-blue-500 hover:underline'>
                    <MdOutlineModeEditOutline className='mr-2' size={20}/> Edit
                </a>
            </div>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Edit Savings Plan</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleEdit}>
                        <div>
                            <Label htmlFor="plan-name">Savings plan name</Label>
                            <TextInput
                                id="plan-name"
                                type="text"
                                placeholder="e.g. Vacation"
                                value={data.name}
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
                                value={data.target_balance}
                                onChange={(e) => setData('target_balance', e.target.value)}
                            />
                            {errors.target_balance && <p className="text-red-600 text-sm">{errors.target_balance}</p>}
                        </div>

                        <div>
                            <Label htmlFor="due-date">Due Date</Label>
                            <Datepicker value={data.due_date}
                                        onChange={date => setData('due_date', formatDate(date))} />

                            {errors.due_date && <p className="text-red-600 text-sm">{errors.due_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="savings-tips">Savings tips</Label>
                            <Editor value={data.savings_tips} onChange={onSavingsTipsChange} />
                            {errors.savings_tips && <p className="text-red-600 text-sm">{errors.savings_tips}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Edit</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
