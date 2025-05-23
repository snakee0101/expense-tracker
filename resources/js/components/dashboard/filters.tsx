import { Checkbox, Dropdown, Label, TextInput, Button } from 'flowbite-react';
import { RxMagnifyingGlass } from "react-icons/rx";
import { useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";
import { IoFunnelOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { DateRange } from 'react-date-range';
import { RiFileExcel2Fill } from "react-icons/ri";
import { buildQueryUrl } from '../../lib/helpers';

import axios from 'axios';

export default function Filters({setTransactionPaginator, setSearchFilters})
{
    const [searchText, setSearchText] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const clearSearchInput = () => setSearchText("");

    const statuses = ['Pending', 'Completed', 'Cancelled'];
    const transactionTypes = ['Income/Expense', 'Payment', 'Savings', 'Transfer'];

    const toggleStatus = (status: string) => {
        setSelectedStatuses((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    };

    const toggleType = (transactionType: string) => {
        setSelectedTypes((prev) =>
            prev.includes(transactionType)
                ? prev.filter((t) => t !== transactionType)
                : [...prev, transactionType]
        );
    };

    const [dateFilter, setDateFilter] = useState([{
        startDate: new Date(),
        endDate: null,
        key: 'selection'
    }]);

    const [amountRangeFilter, setAmountRangeFilter] = useState({
        rangeStart: '',
        rangeEnd: '',
    });

    const [includesAttachmentsFilter, setIncludesAttachmentsFilter] = useState(false);

    let filters = {
        name: searchText ?? '',
        status: selectedStatuses,
        date: dateFilter,
        amount: amountRangeFilter,
        hasAttachments: includesAttachmentsFilter,
        transactionTypes: selectedTypes
    };

    useEffect(() => {
        setSearchFilters(filters);
        const url = buildQueryUrl(route('transaction.search'), 1, filters);
        axios.get(url).then(response => setTransactionPaginator(response.data));
    }, [searchText, selectedStatuses, dateFilter, amountRangeFilter, includesAttachmentsFilter, selectedTypes]);

    return (
        <div className='m-2 flex flex-row gap-3'>
            {/*Search input*/}
            <div className="relative w-full max-w-md">
                <TextInput
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    icon={RxMagnifyingGlass}
                    className="pr-10 bg-none"
                />
                {searchText && (
                    <button
                        onClick={clearSearchInput}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <MdClose className="h-5 w-5 cursor-pointer" />
                    </button>
                )}
            </div>

            <Dropdown label="Filter Status" inline dismissOnClick={false} renderTrigger={() => (
                <button className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-400 focus:outline-none">
                    <IoFunnelOutline className="w-5 h-5 mr-2" />
                    Statuses: {selectedStatuses.length > 0 ? selectedStatuses.join(', ') : 'All'}
                    <FiChevronDown size={20} className='ml-1' />
                </button>
            )}>
                <div className="px-3 py-1 w-48">
                    {statuses.map((status) => (
                        <div key={status} className="flex items-center gap-2 py-1">
                            <Checkbox
                                color='warning'
                                id={status}
                                checked={selectedStatuses.includes(status)}
                                onChange={() => toggleStatus(status)}
                            />
                            <Label htmlFor={status} className="text-sm font-medium">
                                {status}
                            </Label>
                        </div>
                    ))}
                </div>
            </Dropdown>

            <Dropdown label="Filter Type" inline dismissOnClick={false} renderTrigger={() => (
                <button className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-400 focus:outline-none">
                    <IoFunnelOutline className="w-5 h-5 mr-2" />
                    Types: {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'All'}
                    <FiChevronDown size={20} className='ml-1' />
                </button>
            )}>
                <div className="px-3 py-1 w-48">
                    {transactionTypes.map((transactionType) => (
                        <div key={transactionType} className="flex items-center gap-2 py-1">
                            <Checkbox
                                color='warning'
                                id={transactionType}
                                checked={selectedTypes.includes(transactionType)}
                                onChange={() => toggleType(transactionType)}
                            />
                            <Label htmlFor={transactionType} className="text-sm font-medium">
                                {transactionType}
                            </Label>
                        </div>
                    ))}
                </div>
            </Dropdown>

            <div className='flex flex-row'>
                <Dropdown label="Filter Status" inline dismissOnClick={false} renderTrigger={() => (
                    <button className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-400 focus:outline-none">
                        <IoFunnelOutline className="w-5 h-5 mr-2" />
                        Date
                        <FiChevronDown size={20} className='ml-1' />
                    </button>
                )}>
                    <div className="px-3 py-1 w-48">
                        <DateRange
                            editableDateInputs={true}
                            onChange={item => setDateFilter([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dateFilter}
                        />


                    </div>
                </Dropdown>

                <button
                    onClick={() => setDateFilter([{ startDate: new Date(), endDate: new Date(), key: 'selection' }])}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                >
                    <MdClose className="h-5 w-5 cursor-pointer" />
                </button>
            </div>

            <div className='flex flex-row'>
                <Dropdown label="Filter Status" inline dismissOnClick={false} renderTrigger={() => (
                    <button className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-400 focus:outline-none">
                        <IoFunnelOutline className="w-5 h-5 mr-2" />
                        Amount
                        <FiChevronDown size={20} className='ml-1' />
                    </button>
                )}>
                    <div className="px-3 py-1 w-48 flex flex-row items-center">
                        <TextInput id="small" type="number" sizing="sm" placeholder='min' min={0} value={amountRangeFilter.rangeStart} onChange={e => setAmountRangeFilter({...amountRangeFilter, rangeStart: e.target.value})} />
                        <span className='mx-2'>-</span>
                        <TextInput id="small" type="number" sizing="sm" placeholder='max' min={0} value={amountRangeFilter.rangeEnd} onChange={e => setAmountRangeFilter({...amountRangeFilter, rangeEnd: e.target.value})} />
                    </div>
                </Dropdown>

                <button
                    onClick={() => setAmountRangeFilter({rangeStart: 0, rangeEnd: 0})}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                >
                    <MdClose className="h-5 w-5 cursor-pointer" />
                </button>
            </div>


            <Dropdown label="Filter Status" inline dismissOnClick={false} renderTrigger={() => (
                <button className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-400 focus:outline-none">
                    <IoFunnelOutline className="w-5 h-5 mr-2" />
                    With Attachments: {includesAttachmentsFilter ? 'Yes' : 'No'}
                    <FiChevronDown size={20} className='ml-1' />
                </button>
            )}>
                <div className="px-3 py-1 w-48">
                        <div className="flex items-center gap-2 py-1">
                            <Checkbox
                                color='warning'
                                id='attachments'
                                checked={includesAttachmentsFilter}
                                onChange={() => setIncludesAttachmentsFilter(!includesAttachmentsFilter)}
                            />
                            <Label htmlFor='attachments' className="text-sm font-medium">Include with attachments only</Label>
                        </div>
                </div>
            </Dropdown>

            <a href={route('transaction.export', filters)} className='ml-auto'>
                <Button className='rounded-none cursor-pointer'>
                    <RiFileExcel2Fill size={24} className='mr-2'/> Export
                </Button>
            </a>
        </div>
    );
}
