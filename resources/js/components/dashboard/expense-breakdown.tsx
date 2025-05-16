import { Card, Datepicker, Select } from 'flowbite-react';
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState } from 'react';
import { get } from 'flowbite-react/helpers/get';
import { router } from '@inertiajs/react';
import { extractDateFromDateTime } from '@/lib/helpers';

function generateUniqueChartColors(count) {
    const colors = new Set();

    while (colors.size < count) {
        // Generate a color with distinct hue
        const hue = Math.floor((360 / count) * colors.size); // evenly spaced hue
        const saturation = 70 + Math.floor(Math.random() * 20); // 70–90%
        const lightness = 50 + Math.floor(Math.random() * 10); // 50–60%

        const color = hslToHex(hue, saturation, lightness);
        colors.add(color);
    }

    return Array.from(colors);
}

// Helper function to convert HSL to HEX
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

function getFilterFromDates(startStr, endStr) {
    if(startStr == false || endStr == false) {
        return 'this month';
    }

    // This Year
    if (
        startStr == dayjs().startOf('year').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr == dayjs().endOf('year').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this year';
    }

    // These 6 Months (Half-Year)
    const month = dayjs().month();
    if (month < 6) {
        const firstHalfStart = dayjs().startOf('year').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss');
        const firstHalfEnd = dayjs().month(5).endOf('month').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss');
        if (startStr == firstHalfStart && endStr == firstHalfEnd) {
            return 'these 6 months';
        }
    } else {
        const secondHalfStart = dayjs().month(6).startOf('month').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss');
        const secondHalfEnd = dayjs().endOf('year').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss');
        if (startStr == secondHalfStart && endStr == secondHalfEnd) {
            return 'these 6 months';
        }
    }

    // This Month
    if (
        startStr == dayjs().startOf('month').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr == dayjs().endOf('month').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this month';
    }

    // This Week
    if (
        startStr == dayjs().startOf('week').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr == dayjs().endOf('week').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this week';
    }

    // This Day
    if (
        startStr == dayjs().startOf('day').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr ==  dayjs().endOf('day').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this day';
    }

    // If none match, it's a custom range
    return `custom`;
}

export default function ExpenseBreakdown({breakdown, expenseBreakdownStartingDate, expenseBreakdownEndingDate}) {
    let data = [];
    let colors = generateUniqueChartColors(breakdown.length);

    for(let expense of breakdown) {
        data.push({
            name: `${expense.category.name} ($${expense.amount_spent ?? 0})`,
            value: expense.amount_spent * 100 ?? 0,
            fill: colors.pop()
        });
    }

    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    };

    const [openModal, setOpenModal] = useState(false);
    const [dateRangeStart, setDateRangeStart] = useState(null);
    const [dateRangeEnd, setDateRangeEnd] = useState(null);

    let selectedFilter = getFilterFromDates(expenseBreakdownStartingDate, expenseBreakdownEndingDate);

    function handleSelectFilter(event) {
        let expenseBreakdownDateRangeStart = null;
        let expenseBreakdownDateRangeEnd = null;

        if(event.target.value != 'custom') {
            const today = dayjs();

            switch (event.target.value) {
                case 'this year':
                    expenseBreakdownDateRangeStart = today.startOf('year');
                    expenseBreakdownDateRangeEnd = today.endOf('year');
                    break;
                case 'these 6 months': {
                    const month = today.month();
                    if (month < 6) {
                        expenseBreakdownDateRangeStart = today.startOf('year');
                        expenseBreakdownDateRangeEnd = dayjs().month(5).endOf('month'); // June
                    } else {
                        expenseBreakdownDateRangeStart = dayjs().month(6).startOf('month'); // July
                        expenseBreakdownDateRangeEnd = today.endOf('year');
                    }
                    break;
                }
                case 'this month':
                    expenseBreakdownDateRangeStart = today.startOf('month');
                    expenseBreakdownDateRangeEnd = today.endOf('month');
                    break;
                case 'this week':
                    expenseBreakdownDateRangeStart = today.startOf('week');
                    expenseBreakdownDateRangeEnd = today.endOf('week');
                    break;
                case 'this day':
                    expenseBreakdownDateRangeStart = today.startOf('day');
                    expenseBreakdownDateRangeEnd = today.endOf('day');
                    break;
                default:
                    return;
            }

            router.get(route('dashboard', {
                'expenseBreakdownDateRangeStart': expenseBreakdownDateRangeStart.format('YYYY-MM-DD HH:mm:ss'),
                'expenseBreakdownDateRangeEnd': expenseBreakdownDateRangeEnd.format('YYYY-MM-DD HH:mm:ss')
            }));
        } else {
            setOpenModal(true);
        }
    }

    function handleFilterByDateRange() {
        router.get(route('dashboard', {
            'expenseBreakdownDateRangeStart': dateRangeStart.format('YYYY-MM-DD HH:mm:ss'),
            'expenseBreakdownDateRangeEnd': dateRangeEnd.format('YYYY-MM-DD HH:mm:ss')
        }));

        setOpenModal(false);
    }

    return (
        <Card>
            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>Filter expense breakdown by date</ModalHeader>
                <ModalBody>
                    <div className="space-y-6 flex content-center mb-100">
                        <Datepicker onChange={date => setDateRangeStart(dayjs(date).startOf('day'))} />
                        <span className='mt-2 mx-3'>-</span>
                        <Datepicker onChange={date => setDateRangeEnd(dayjs(date).endOf('day'))} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleFilterByDateRange}>Filter</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            <div className="flex justify-between">
                <h5 className="mr-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Expense Breakdown</h5>
                <Select id="expenseBreakdownFilters" onChange={handleSelectFilter} value={selectedFilter}>
                    <option value='this year'>This year</option>
                    <option value='these 6 months'>These 6 months</option>
                    <option value='this month'>This month</option>
                    <option value='this week'>This week</option>
                    <option value='this day'>This day</option>
                    <option value='custom'>Custom <span>{extractDateFromDateTime(expenseBreakdownStartingDate)} - {extractDateFromDateTime(expenseBreakdownEndingDate)}</span></option>
                </Select>
            </div>

            <p>{breakdown.length == 0 && 'No transactions for this period'}</p>

            <ResponsiveContainer height={500} width={600}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                </RadialBarChart>
            </ResponsiveContainer>
        </Card>
    );
}
