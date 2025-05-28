import dayjs from 'dayjs';

export function getPageUrl(paginator, pageNumber) {
    const link = paginator.links.find(item => item.label === String(pageNumber));
    return link ? link.url : null;
}

export function formatMoney(value, decimals = 2) {
    return Number(value)
        .toFixed(decimals)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        .replace(/,/g, '.');
}

export function formatCardDate(date)
{
    return new Date(date).toLocaleDateString(undefined, {
        month: '2-digit',
        year: '2-digit',
    });
}

export function formatCardNumber(cardNumber) {
    return cardNumber
        .toString()
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

export function formatDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function extractDateFromDateTime(date) {
    return dayjs(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
}

export function getDateFromExpiryDate(unformattedDate :string) {
    const [monthStr, yearStr] = unformattedDate.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt("20" + yearStr, 10);

    const lastDayOfMonth = new Date(year, month, 0);
    lastDayOfMonth.setHours(23, 59, 59);

    // Format to "Y-m-d H:i:s"
    const formattedDate = lastDayOfMonth.getFullYear() + "-" +
        String(lastDayOfMonth.getMonth() + 1).padStart(2, '0') + "-" +
        String(lastDayOfMonth.getDate()).padStart(2, '0') + " " +
        String(lastDayOfMonth.getHours()).padStart(2, '0') + ":" +
        String(lastDayOfMonth.getMinutes()).padStart(2, '0') + ":" +
        String(lastDayOfMonth.getSeconds()).padStart(2, '0');

    return formattedDate;
}

export function percent(number) {
    return (number * 100).toFixed(1);
}

export function buildQueryUrl(baseUrl, page, filters) {
    const params = new URLSearchParams();

    params.set('page', page);

    if (filters.name) params.set('name', filters.name);

    if (filters.status?.length) {
        filters.status.forEach(s => params.append('status[]', s));
    }

    if (filters.transactionTypes?.length) {
        filters.transactionTypes.forEach(t => params.append('transactionTypes[]', t));
    }

    if (filters.date?.[0]?.startDate) {
        params.set('date[0][startDate]', filters.date[0].startDate.toISOString());
        if (filters.date[0].endDate) {
            params.set('date[0][endDate]', filters.date[0].endDate.toISOString());
        }
    }

    if (filters.amount?.rangeStart) params.set('amount[rangeStart]', filters.amount.rangeStart);
    if (filters.amount?.rangeEnd) params.set('amount[rangeEnd]', filters.amount.rangeEnd);

    if (filters.hasAttachments) params.set('hasAttachments', '1');

    return `${baseUrl}?${params.toString()}`;
}

export function findKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}
