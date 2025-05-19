import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useForm } from '@inertiajs/react';
import {
    Toast,
    ToastToggle,
    createTheme, Avatar
} from 'flowbite-react';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import '../../css/app.css';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { ListGroup, ListGroupItem } from "flowbite-react";
import CreateCategoryModal from '@/components/transaction_categories/create-category-modal';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: route('payment.index'),
    },
];

const toastThemeWithAbsolutePositioning = createTheme({
    toast: {
        root: {
            base: 'absolute top-2 right-2 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400',
            closed: 'opacity-0 ease-out',
        },
        toggle: {
            base: '-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white',
            icon: 'h-5 w-5 shrink-0',
        },
    },
});

export default function Payments({ payments, paymentCategories, accounts }) {
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [selectedPaymentId, setSelectedPaymentId] = useState(payments[0].id);

    const { data, setData, post, errors, reset } = useForm({
        payment_id: payments[0].id,
    });

    function selectPayment(paymentId) {
        setSelectedPaymentId(paymentId);

        setData('payment_id', paymentId);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {isNotificationShown && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
                    <ToastToggle />
                </Toast>
            )}

            <Head title="Payments" />

            <div className="flex min-h-screen">
                <div className="w-4"></div>

                <aside className="floating-sidebar">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Payments</h2>
                    </div>
                    <div className='flex flex-row justify-between my-3'>
                        <CreateCategoryModal setIsNotificationShown={setIsNotificationShown} setNotificationMessage={setNotificationMessage} storeUrl={route('payment_category.store')} />
                        Create payment modal button
                    </div>

                    <Accordion className='bg-white'>
                        {paymentCategories.map(paymentCategory => (
                            <AccordionPanel>
                                <AccordionTitle>
                                    <div className='flex flex-row items-center'>
                                        <Avatar img={paymentCategory.image_path} alt="avatar of Jese" rounded />
                                        <p className='ml-4'>{paymentCategory.name}</p>
                                    </div>
                                </AccordionTitle>
                                <AccordionContent>
                                    <ListGroup className="">
                                        {payments
                                            .filter(payment => payment.payment_category_id == paymentCategory.id)
                                            .map(payment =>
                                                selectedPaymentId == payment.id
                                                    ? <ListGroupItem active>{payment.name}</ListGroupItem>
                                                    : <ListGroupItem onClick={() => setSelectedPaymentId(payment.id)}>{payment.name}</ListGroupItem>
                                            )}
                                    </ListGroup>
                                </AccordionContent>
                            </AccordionPanel>
                        ))}
                    </Accordion>
                </aside>

                <div className="w-4"></div>

                <main className="min-h-screen flex-1 p-6">
                    payment form
                </main>
            </div>
        </AppLayout>
    );
}
