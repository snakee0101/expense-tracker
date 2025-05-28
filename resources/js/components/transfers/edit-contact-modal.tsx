import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, FileInput, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { formatCardNumber } from '@/lib/helpers';
import { useNotification } from '@/contexts/NotificationContext';

export default function EditContactModal({ contact }) {
    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, errors, clearErrors, reset } = useForm({
        name: contact.name,
        card_number: contact.card_number,
        avatar: null,
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        reset();
    };

    const handleEdit = (event) => {
        event.preventDefault();

        post(route('contact.update', {contact: contact.id}), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal();
                showNotification('Contact updated');
            },
        });
    };

    return (
        <>
            <div className='flex flex-row-reverse'>
                <a href="#" onClick={ (e) => {e.preventDefault(); setOpenModal(true)} } className='flex items-center text-blue-500 hover:underline'>
                    <MdOutlineModeEditOutline className='mr-2' size={20}/> Edit
                </a>
            </div>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>Edit Contact</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleEdit} encType="multipart/form-data">
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
                                value={formatCardNumber(data.card_number)}
                                onChange={(e) =>
                                    setData('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))
                                }
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
                            <p>If not chosen, avatar is left unchanged</p>
                            {errors.avatar && <p className="text-red-600 text-sm">{errors.avatar}</p>}
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
