import { Card } from 'flowbite-react';
import { formatMoney } from '@/lib/helpers';
import { RiCoinsFill } from 'react-icons/ri';
import { GoArrowDownRight, GoArrowUpRight } from 'react-icons/go';
import { GiPayMoney } from "react-icons/gi";
import { MdOutlineSavings } from "react-icons/md";

export default function IncomeExpenseStatistics({statistics}) {
    if(statistics.length == 0) {
        statistics = [null, {
            income: 0,
            income_diff: 0,
            expense: 0,
            expense_diff: 0,
            savings: 0,
            savings_diff: 0,
        }];
    }

    const stats = [
        {
            title: 'Income',
            value: `$ ${formatMoney(statistics[statistics.length - 1].income)}`, //last item of an array holds statistics for current month
            change: `$ ${formatMoney(statistics[statistics.length - 1].income_diff)}`,
            increase: statistics[statistics.length - 1].income_diff > 0,
            icon: <RiCoinsFill size={36} />
        },
        {
            title: 'Expense',
            value: `$ ${formatMoney(statistics[statistics.length - 1].expense)}`,
            change: `$ ${formatMoney(statistics[statistics.length - 1].expense_diff)}`,
            increase: statistics[statistics.length - 1].expense_diff > 0,
            icon: <GiPayMoney size={36} />
        },
        {
            title: 'Savings',
            value: `$ ${formatMoney(statistics[statistics.length - 1].savings)}`,
            change: `$ ${formatMoney(statistics[statistics.length - 1].savings_diff)}`,
            increase: statistics[statistics.length - 1].savings_diff > 0,
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
