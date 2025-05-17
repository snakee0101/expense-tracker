import { Badge } from 'flowbite-react';

export default function TransactionStatus({status, statusList})
{
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

    return <Badge color={badgeColor} className='inline'>{statusList[status]}</Badge>;
}
