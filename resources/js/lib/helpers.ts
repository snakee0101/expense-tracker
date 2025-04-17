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
