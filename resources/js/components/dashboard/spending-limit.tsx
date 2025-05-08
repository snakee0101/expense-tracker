import { Button, Card, Progress } from 'flowbite-react';
import { GrEdit } from "react-icons/gr";
import { formatMoney } from '@/lib/helpers';

export default function SpendingLimit({spendingLimit, amountSpent})
{
    let spendingLimitPercentage = Math.round(amountSpent * 100 / spendingLimit.limit_amount, 1);

    return (
        <Card href="#" className="max-w-sm">
            <div className="flex justify-between">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Spending Limits
                </h5>
                <Button size="xs" color='dark'>
                    <GrEdit className='mr-2' /> Edit
                </Button>
            </div>

            <Progress progress={spendingLimitPercentage} color="teal" />

            <div className="text-sm mt-1">
                <span className="font-medium">${formatMoney(amountSpent)}</span>
                <span> spent of ${formatMoney(spendingLimit.limit_amount)}</span> for this month
            </div>
        </Card>
    );
}
