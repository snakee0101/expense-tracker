import { Card, Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import dayjs from 'dayjs';
import { formatMoney, getPageUrl } from '@/lib/helpers';
import TransactionStatus from '@/components/main/transaction-status';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function AccountTransactions({transactionsPaginator, transactionStatusList, setTransactionsPaginator, filters}) {
    function isPayingAccount(accountName) {
        return accountName.includes('Wallet') || accountName.includes('Card');
    }

    const onPageChange = (page: number) => axios.post(getPageUrl(transactionsPaginator, page), filters).then(
        response => setTransactionsPaginator(response.data)
    );

    return (
        <Card>
            <h5 className="mr-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h5>

            <Table>
                <TableHead>
                    <TableHeadCell>Transaction Name</TableHeadCell>
                    <TableHeadCell>Account</TableHeadCell>
                    <TableHeadCell>Date & Time</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {transactionsPaginator && transactionsPaginator.data.map((transaction) => (
                        <TableRow key={transaction.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell className='py-1 px-3'>
                                <div className="flex w-full flex-row items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                        <img src={transaction.category.imageUrl} className='rounded-full' />
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-lg font-bold text-gray-700">{transaction.name}</h5>
                                        <h5 className="text-md text-gray-500">{transaction.category.name}</h5>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {isPayingAccount(transaction.destination?.typeName) ? (
                                    <p><b>{transaction.destination?.typeName}</b> {transaction.destination?.name}</p>
                                ) : (
                                    <p><b>{transaction.source?.typeName}</b> {transaction.source?.name}</p>
                                )}
                            </TableCell>
                            <TableCell>
                                <p className="text-black font-bold">{dayjs(transaction.date).format('YYYY-MM-DD')}</p>
                                <p className="text-gray-400">{dayjs(transaction.date).format('hh:mm A')}</p>
                            </TableCell>
                            <TableCell>${formatMoney(transaction.amount)}</TableCell>
                            <TableCell>
                                <TransactionStatus status={transaction.status}
                                                   statusList={transactionStatusList}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {transactionsPaginator && transactionsPaginator.last_page > 1 && (
                <div className="flex overflow-x-auto sm:mr-3 sm:justify-end">
                    <Pagination currentPage={transactionsPaginator.current_page} totalPages={transactionsPaginator.last_page} onPageChange={onPageChange} showIcons />
                </div>
            )}
        </Card>
    );
}
