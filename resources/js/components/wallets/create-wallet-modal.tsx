import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';

export default function CreateWalletModal({ setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData('name', '');
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('wallet.store'), {
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Wallet created')
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
                    Create New Wallet
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="wallet-name" className="mb-2 block">Wallet Name</Label>
                            <TextInput
                                id="wallet-name"
                                placeholder="Enter wallet name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors && <p className='text-red-600'>{errors.name}</p>}
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
