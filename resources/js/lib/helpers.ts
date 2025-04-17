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
