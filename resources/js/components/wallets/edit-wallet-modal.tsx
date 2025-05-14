import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { MdOutlineModeEditOutline } from "react-icons/md";

export default function EditWalletModal({ wallet, setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: wallet.name,
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        setData('name', '');
    };

    const handleCreate = (event) => {
        event.preventDefault();

        put(route('wallet.update', {'wallet': wallet.id}), {
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
            <div className='flex flex-row-reverse'>
                <a href="#" onClick={ (e) => {e.preventDefault(); setOpenModal(true)} } className='flex items-center text-blue-500 hover:underline'>
                    <MdOutlineModeEditOutline className='mr-2' size={20}/> Edit
                </a>
            </div>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>
                    Edit Wallet
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
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
