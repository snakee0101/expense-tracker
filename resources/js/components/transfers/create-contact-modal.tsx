import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, FileInput, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { useNotification } from '@/contexts/NotificationContext';

export default function CreateContactModal() {
    const { showNotification } = useNotification();
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, errors, clearErrors, reset } = useForm({
        name: '',
        card_number: '',
        avatar: null,
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        reset();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('contact.store'), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal();
                showNotification('Contact created');
            },
        });
    };

    return (
        <>
            <Button size="xs" color="dark" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaPlus className="mr-2" size={15} /> Add
            </Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Create Contact</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate} encType="multipart/form-data">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <TextInput
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={data.name}
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
                                placeholder="1234 5678 9012 3456"
                                value={data.card_number}
                                onChange={(e) => setData('card_number', e.target.value)}
                            />
                            {errors.card_number && <p className="text-red-600 text-sm">{errors.card_number}</p>}
                        </div>

                        <div>
                            <Label htmlFor="avatar">Avatar</Label>
                            <FileInput
                                id="avatar"
                                accept="image/*"
                                onChange={(e) => setData('avatar', e.target.files[0])}
                            />
                            {errors.avatar && <p className="text-red-600 text-sm">{errors.avatar}</p>}
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
