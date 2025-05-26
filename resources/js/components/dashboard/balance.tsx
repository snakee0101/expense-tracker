import { Card } from 'flowbite-react';
import { formatCardNumber, formatMoney } from '@/lib/helpers';
import { FaCreditCard } from "react-icons/fa";
import { PiMoneyWavy } from "react-icons/pi";

export default function Balance({accounts})
{
    const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

    return (
        <Card className="max-w-sm">
            <div className="flex justify-between">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mr-3">
                    Balance
                </h5>
            </div>
            <div>
                <p>Total Balance</p>
                <p className='text-3xl font-bold'>${formatMoney(totalBalance)}</p>
            </div>
            <div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {accounts.map(account => (
                        <li className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4">
                                <div className="shrink-0">
                                    {account.type == 'App\\Models\\Card' ? <FaCreditCard size={20} /> : <PiMoneyWavy size={20} /> }
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{account.name}</p>

                                    {account.type == 'App\\Models\\Card' && <p className="truncate text-sm text-gray-500 dark:text-gray-400">{formatCardNumber(account.card_number)}</p>}
                                </div>
                                <div className={`inline-flex items-center text-base font-semibold text-gray-900 dark:text-white ${account.balance < 0 ? 'text-red-600' : 'text-green-500'}`}>${formatMoney(account.balance)}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}
