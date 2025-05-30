import { Card } from 'flowbite-react';
import { GoArrowDownRight, GoArrowUpRight } from 'react-icons/go';
import { formatMoney } from '@/lib/helpers';
import { RiCoinsFill } from 'react-icons/ri';
import { TfiTarget } from 'react-icons/tfi';
import { GrPlan } from 'react-icons/gr';

export default function SavingsPlansStatistics({savingsPlans, totalSavingsGain})
{
    const totalTarget = savingsPlans.reduce(function(total, plan) {
        return total + Number(plan.target_balance);
    }, 0);

    const totalSavings = savingsPlans.reduce(function(total, plan) {
        return total + Number(plan.balance);
    }, 0);

    const stats = [
        {
            title: 'Total Savings',
            value: `$ ${formatMoney(totalSavings)}`,
            change: totalSavingsGain + ' %',
            increase: totalSavingsGain > 0,
            icon: <RiCoinsFill size={36} />
        },
        {
            title: 'Total Target',
            value: `$ ${formatMoney(totalTarget)}`,
            change: null,
            increase: false,
            icon: <TfiTarget size={36} />
        },
        {
            title: 'Total Plans',
            value: savingsPlans.length,
            change: null,
            increase: true,
            icon: <GrPlan size={36} />
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-4">
            {stats.map((stat, index) => (
                <Card key={index}
                      className="bg-green-50 flex rounded-none shadow-sm"
                >
                    <div className="flex w-full flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">{stat.title}</h5>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {stat.value}

                                {stat.change != null && <span
                                    className={`inline-flex items-center px-2 py-0.5 text-sm font-medium rounded-full ml-2 mt-2 ${stat.increase ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {stat.increase ? (
                                                <GoArrowUpRight className="w-4 h-4 mr-1" />
                                            ) : (
                                                <GoArrowDownRight className="w-4 h-4 mr-1" />
                                            )}
                                    {stat.change}
                                        </span>}

                                {stat.change != null && <span className='text-sm ml-2 font-thin'>Compared to previous month</span>}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:text-green-500">
                            {stat.icon}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
