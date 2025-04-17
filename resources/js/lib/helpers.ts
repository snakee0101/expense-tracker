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
