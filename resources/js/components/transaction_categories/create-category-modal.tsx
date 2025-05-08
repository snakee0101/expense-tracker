import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Modal, ModalHeader, ModalBody, Label, TextInput, FileInput } from 'flowbite-react';

export default function CreateCategoryModal({ setIsNotificationShown, setNotificationMessage }) {
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        image: null
    });

    const onCloseModal = () => {
        setOpenModal(false);
        reset();
    };

    const handleCreate = (event) => {
        event.preventDefault();

        post(route('transaction_category.store'), {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal()

                setNotificationMessage('Transaction category created')
                setIsNotificationShown(true)

                setTimeout(() => setIsNotificationShown(false), 2000)
            }
        });
    };

    return (
        <>
            <Button onClick={() => setOpenModal(true)} size="xs">Create Category</Button>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader>
                    Create New Category
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-6" onSubmit={handleCreate}>
                        <div>
                            <Label htmlFor="category-name" className="mb-2 block">Category Name</Label>
                            <TextInput
                                id="category-name"
                                placeholder="Enter category name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors && <p className='text-red-600 text-sm'>{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="category-image">Category Image</Label>
                            <FileInput
                                id="category-image"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files[0])}
                            />
                            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
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
