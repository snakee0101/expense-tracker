import { Card, Progress } from 'flowbite-react';
import { formatCardNumber, formatMoney, percent } from '@/lib/helpers';
import { FaCreditCard } from "react-icons/fa";
import { PiMoneyWavy } from "react-icons/pi";

export default function SavingsPlans({savingsPlans})
{
    const totalSavings = savingsPlans.reduce((acc, plan) => acc + Number(plan.balance), 0);

    function savingsPlanCompletionPercentage(savingsPlan) {
        return percent(savingsPlan.balance / savingsPlan.target_balance);
    }

    return (
        <Card className="max-w-sm">
            <div className="flex justify-between">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mr-3">
                    Savings plans
                </h5>
            </div>
            <div>
                <p>Total Balance</p>
                <p className='text-3xl font-bold'>${formatMoney(totalSavings)}</p>
            </div>
            <div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {savingsPlans.map(plan => (
                        <li className="py-3 sm:py-4" style={{width: 300}}>
                            <div className="space-x-4">
                                <p className='mb-3'>{plan.name}</p>

                                <Progress progress={savingsPlanCompletionPercentage(plan)} color="teal" />

                                <div className="text-sm flex items-center mt-3 justify-between">
                                    <p>
                                        <span className="font-medium">${formatMoney(plan.balance)}</span>
                                        <span className=""> / ${formatMoney(plan.target_balance)}</span>
                                    </p>
                                    <p className="text-lg font-semibold">{savingsPlanCompletionPercentage(plan)}%</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}
