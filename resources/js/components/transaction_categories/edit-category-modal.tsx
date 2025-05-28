import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, FileInput, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { useNotification } from '@/contexts/NotificationContext';

export default function EditCategoryModal({ category, updateUrl }) {
    const { showNotification } = useNotification();

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, errors, clearErrors, reset } = useForm({
        name: category.name,
        image: null,
    });

    const onCloseModal = () => {
        setOpenModal(false);
        clearErrors();
        reset();
    };

    const handleEdit = (event) => {
        event.preventDefault();

        post(updateUrl, {category: category.id}, {
            forceFormData: true,
            onSuccess: () => {
                onCloseModal();
                showNotification('Category updated');
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
                <ModalHeader>Edit Category</ModalHeader>
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
                            <Label htmlFor="image">Category image</Label>
                            <FileInput
                                id="image"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files[0])}
                            />
                            <p>If not chosen, category image is left unchanged</p>
                            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
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
