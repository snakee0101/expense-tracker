import { Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import dayjs from 'dayjs';
import { formatMoney } from '@/lib/helpers';
import { ImAttachment } from 'react-icons/im';
import { CiRedo } from 'react-icons/ci';
import { MdOutlineCancel } from 'react-icons/md';
import { RiCoinsFill, RiDeleteBin6Line } from 'react-icons/ri';
import TransactionStatus from '@/components/main/transaction-status';
import { GoArrowDownRight, GoArrowUpRight } from 'react-icons/go';
import { TfiTarget } from 'react-icons/tfi';
import { GrPlan } from 'react-icons/gr';
import { GiPayMoney } from "react-icons/gi";
import { MdOutlineSavings } from "react-icons/md";

export default function IncomeExpenseStatistics({statistics}) {
    const stats = [
        {
            title: 'Income',
            value: `$ ${formatMoney(statistics.income)}`,
            change: 0 + ' %',
            increase: 123 > 0,
            icon: <RiCoinsFill size={36} />
        },
        {
            title: 'Expense',
            value: `$ ${formatMoney(statistics.expense)}`,
            change: 0 + ' %',
            increase: 123 < 0,
            icon: <GiPayMoney size={36} />
        },
        {
            title: 'Savings',
            value: `$ ${formatMoney(statistics.savings)}`,
            change: 0 + ' %',
            increase: 123 > 0,
            icon: <MdOutlineSavings size={36} />
        },
    ];

    return (
        <Card>
            <div className='flex items-center'>
                <h5 className="mr-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Income/Expense Statistics</h5>
                <p>for current month (compared to previous)</p>
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 mb-4">
                {stats.map((stat, index) => (
                    <Card key={index}
                          className="bg-green-50 flex rounded-none shadow-sm"
                    >
                        <div className="flex w-full flex-row justify-between items-center">
                            <div className="flex items-center justify-center rounded-full bg-white mr-2">
                                {stat.icon}
                            </div>
                            <div className="flex flex-col w-full">
                                <h5 className="text-md font-medium text-gray-700 flex justify-between items-center">
                                    <span>{stat.title}</span>

                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 text-sm font-medium rounded-full ml-2 mt-2 ${stat.increase ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {stat.increase ? (
                                        <GoArrowUpRight className="w-4 h-4 mr-1" />
                                    ) : (
                                        <GoArrowDownRight className="w-4 h-4 mr-1" />
                                    )}
                                        {stat.change}
                                    </span>
                                </h5>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
}
