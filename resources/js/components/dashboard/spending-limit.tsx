import { Button, Card, Progress } from 'flowbite-react';
import { GrEdit } from "react-icons/gr";
import { formatMoney } from '@/lib/helpers';
import SpendingLimitModal from './spending-limit-modal';
import { useState } from 'react';

export default function SpendingLimit({spendingLimit, amountSpent})
{
    let spendingLimitPercentage = Math.round(amountSpent * 100 / spendingLimit.limit_amount, 1);

    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    return (
        <Card href="#" className="max-w-sm">
            <div className="flex justify-between">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mr-3">
                    Spending Limits
                </h5>
                <SpendingLimitModal setIsNotificationShown={setIsNotificationShown}
                                    setNotificationMessage={setNotificationMessage}
                                    spendingLimit={spendingLimit}
                                    key={`${spendingLimit.limit_amount}_${spendingLimit.day_of_month_period_start}`}
                />
            </div>

            <Progress progress={spendingLimitPercentage} color="teal" />

            <div className="text-sm mt-1">
                {spendingLimit.limit_amount ? (<>
                    <span className="font-medium">${formatMoney(amountSpent)}</span>
                    <span> spent of ${formatMoney(spendingLimit.limit_amount)}</span> for this month
                </>) : <span>Spending limit is not set</span>}
            </div>
        </Card>
    );
}
