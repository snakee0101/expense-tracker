import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { useNotification } from '@/contexts/NotificationContext';

export default function CreateCardModal() {
    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        card_number: '',
        expiry_date: '',
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData({
            name: '',
            card_number: '',
            expiry_date: '',
        });
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('card.store'), {
            onSuccess: () => {
                onCloseModal();
                showNotification('Card created');
            },
        });
    };

    return (
        <>
            <Button size="xs" color="dark" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaPlus className="mr-2" size={15} /> Add
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Create New Card</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="card-name">Card Name</Label>
                            <TextInput
                                id="card-name"
                                type="text"
                                placeholder="e.g. Travel Card"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="card-number">Card Number</Label>
                            <TextInput
                                id="card-number"
                                type="text"
                                inputMode="numeric"
                                placeholder="0000 1111 2222 3333"
                                onChange={(e) =>
                                    setData('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))
                                }
                            />
                            {errors.card_number && <p className="text-red-600 text-sm">{errors.card_number}</p>}
                        </div>

                        <div>
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <TextInput
                                id="expiry-date"
                                type="text"
                                placeholder="09/29"
                                onChange={e => setData('expiry_date', e.target.value)}
                            />

                            {errors.expiry_date && <p className="text-red-600 text-sm">{errors.expiry_date}</p>}
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
