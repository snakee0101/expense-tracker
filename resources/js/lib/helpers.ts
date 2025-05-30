import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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

export function daysRemainingUntil(targetDate) {
    const differenceInMilliseconds = new Date(targetDate) - new Date();
    const millisecondsInADay = 1000 * 60 * 60 * 24;

    return Math.ceil(differenceInMilliseconds / millisecondsInADay)
}

export function savingsPlanCompletionPercentage(savingsPlan) {
    return percent(savingsPlan.balance / savingsPlan.target_balance);
}

export function generateUniqueChartColors(count) {
    const colors = new Set();

    while (colors.size < count) {
        // Generate a color with distinct hue
        const hue = Math.floor((360 / count) * colors.size); // evenly spaced hue
        const saturation = 70 + Math.floor(Math.random() * 20); // 70–90%
        const lightness = 50 + Math.floor(Math.random() * 10); // 50–60%

        const color = hslToHex(hue, saturation, lightness);
        colors.add(color);
    }

    return Array.from(colors);
}

// Helper function to convert HSL to HEX
export function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

export function getFilterFromDates(startStrTz, endStrTz) {
    const startStr = dayjs(startStrTz).utc().format('YYYY-MM-DD HH:mm:ss');
    const endStr = dayjs(endStrTz).utc().format('YYYY-MM-DD HH:mm:ss');

    if(startStr == false || endStr == false) {
        return 'this month';
    }

    // This Year
    if (
        startStr == dayjs().startOf('year').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr == dayjs().endOf('year').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this year';
    }

    // These 6 Months (Half-Year)
    const month = dayjs().month();
    if (month < 6) {
        const firstHalfStart = dayjs().startOf('year').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss');
        const firstHalfEnd = dayjs().month(5).endOf('month').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss');
        if (startStr == firstHalfStart && endStr == firstHalfEnd) {
            return 'these 6 months';
        }
    } else {
        const secondHalfStart = dayjs().month(6).startOf('month').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss');
        const secondHalfEnd = dayjs().endOf('year').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss');
        if (startStr == secondHalfStart && endStr == secondHalfEnd) {
            return 'these 6 months';
        }
    }

    // This Month
    if (
        startStr == dayjs().startOf('month').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr == dayjs().endOf('month').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this month';
    }

    // This Week
    if (
        startStr == dayjs().startOf('week').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr == dayjs().endOf('week').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this week';
    }

    // This Day
    if (
        startStr == dayjs().startOf('day').set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DD HH:mm:ss') &&
        endStr ==  dayjs().endOf('day').set('hours', 23).set('minutes', 59).set('seconds', 59).format('YYYY-MM-DD HH:mm:ss')
    ) {
        return 'this day';
    }

    // If none match, it's a custom range
    return `custom`;
}
