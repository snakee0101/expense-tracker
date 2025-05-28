import { Badge } from 'flowbite-react';
import { usePage } from '@inertiajs/react';

export default function TransactionStatus({status})
{
    const { transactionStatusList } = usePage().props;

    let badgeColor = null;

    switch (status) {
        case 1: //Pending
            badgeColor = 'warning';
            break;
        case 2: //Completed
            badgeColor = 'success';
            break;
        case 3: //Cancelled
            badgeColor = 'failure';
            break;
    }

    return <Badge color={badgeColor} className='inline'>{transactionStatusList[status]}</Badge>;
}
