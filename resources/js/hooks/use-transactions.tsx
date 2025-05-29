import { useEffect, useState } from 'react';
import axios from 'axios';

export function useTransactions(accountType, accountId) {
    const [transactionsPaginator, setTransactionsPaginator] = useState(null);

    const filters = {
        account_type: accountType,
        account_id: accountId
    };

    const refreshTransactionList = () => axios.post(route('account_transactions.index'), filters).then(
        response => setTransactionsPaginator(response.data)
    );

    useEffect(() => {
        refreshTransactionList();
    }, [accountId]);

    return {transactionsPaginator, setTransactionsPaginator, filters, refreshTransactionList}
}
