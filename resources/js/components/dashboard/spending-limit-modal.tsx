import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Modal, ModalHeader, ModalBody, Label, TextInput, FileInput } from 'flowbite-react';
import { GrEdit } from 'react-icons/gr';

export default function SpendingLimitModal({ setIsNotificationShown, setNotificationMessage, spendingLimit }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
        limit_amount: spendingLimit.limit_amount,
        day_of_month_period_start: spendingLimit.day_of_month_period_start
    });

    const onCloseModal = () => {
        setOpenModal(false);
        reset();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('spending_limit.store'), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Spending limit changed')
                setIsNotificationShown(true)

                setTimeout(() => setIsNotificationShown(false), 2000)
            }
        });
    };

    function clearLimit() {
        setData('limit_amount', null);
        setData('day_of_month_period_start', null);

        destroy(route('spending_limit.destroy'), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Spending limit cleared')
                setIsNotificationShown(true)

                setTimeout(() => setIsNotificationShown(false), 2000)
            }
        });
    }

    return (
        <>
            <Button size="xs" color='dark' onClick={() => setOpenModal(true)}>
                <GrEdit className='mr-2' /> Edit
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>
                    Edit Spending Limit
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div className="mb-4">
                            <Label htmlFor="limit_amount">Limit Amount (per month)</Label>
                            <TextInput
                                id="limit_amount"
                                name="limit_amount"
                                type="number"
                                step="0.01"
                                min={0.01}
                                value={data.limit_amount}
                                onChange={e => setData('limit_amount', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors && <p className='text-red-600'>{errors.limit_amount}</p>}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="day_of_month_period_start">Day of month when period starts</Label>
                            <TextInput
                                id="day_of_month_period_start"
                                name="day_of_month_period_start"
                                type="number"
                                min={1}
                                max={31}
                                value={data.day_of_month_period_start}
                                onChange={e => setData('day_of_month_period_start', e.target.value)}
                                placeholder="1"
                            />
                            {errors && <p className='text-red-600'>{errors.day_of_month_period_start}</p>}
                        </div>

                        <div className="w-full flex justify-end">
                            <Button type="submit">Set</Button>
                        </div>
                    </form>
                    
                    <Button color="red" onClick={clearLimit}>Clear</Button>
                </ModalBody>
            </Modal>
        </>
    );
}
