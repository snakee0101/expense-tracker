import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { formatCardDate, formatCardNumber } from '@/lib/helpers';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { useNotification } from '@/contexts/NotificationContext';

export default function EditCardModal({ card }) {
    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: card.name,
        card_number: card.card_number,
        expiry_date: card.expiry_date,
        expiry_date_formatted: formatCardDate(card.expiry_date)
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
    };

    const handleEdit = (event) => {
        event.preventDefault();

        data.expiry_date = data.expiry_date_formatted;

        put(route('card.update', {card: card.id}), {
            onSuccess: () => {
                onCloseModal();
                showNotification('Card updated');
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
                <ModalHeader>Edit Card</ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleEdit}>
                        <div>
                            <Label htmlFor="card-name">Card Name</Label>
                            <TextInput
                                id="card-name"
                                type="text"
                                placeholder="e.g. Travel Card"
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
                                placeholder="0000 1111 2222 3333"
                                value={formatCardNumber(data.card_number)}
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
                                value={data.expiry_date_formatted}
                                onChange={e => setData('expiry_date_formatted', e.target.value)}
                            />
                            {errors.expiry_date && <p className="text-red-600 text-sm">{errors.expiry_date}</p>}
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
