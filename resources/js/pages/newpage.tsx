import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Label, TextInput, Textarea, Button, Datepicker, FileInput } from 'flowbite-react';
import { ImIe } from "react-icons/im";
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];


export default function NewPage() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        date: '',
        amount: '',
        note: '',
        image: null
    });
    
    function formatDate(date) {
        const pad = (n) => n.toString().padStart(2, '0');
      
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Months are zero-based
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        post('/save_transaction');
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New page" />

            <form onSubmit={handleSubmit} className="p-3">
                <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>

                <div className="mb-4">
                    <Label htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Transaction name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="image" value="Upload Image" />
                    <FileInput id="file-upload" onChange={e => setData('image', e.target.files[0])}/>
                </div>

                <div className="mb-4">
                    <Label htmlFor="date" value="Date" />
                    <Datepicker onChange={date => setData('date', formatDate(date))} />
                </div>

                <div className="mb-4">
                    <Label htmlFor="amount" value="Amount" />
                    <TextInput
                    id="amount"
                    name="amount"
                    type="number"
                    value={data.amount}
                    onChange={e => setData('amount', e.target.value)}
                    placeholder="0.00"
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="note" value="Note" />
                    <Textarea
                    id="note"
                    name="note"
                    value={data.note}
                    onChange={e => setData('note', e.target.value)}
                    placeholder="Additional details..."
                    rows={3}
                    />
                </div>

                <Button type="submit" className="w-full">
                    Create Transaction
                </Button>
            </form>
        </AppLayout>
    );
}
