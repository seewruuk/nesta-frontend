export default function formatDate(dateInput, type = 'relative') {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();

    if (type === 'absolute') {
        return new Intl.DateTimeFormat('pl-PL', {
            day: 'numeric', month: 'long', year: 'numeric',
        }).format(date);
    }

    const rtf = new Intl.RelativeTimeFormat('pl', {numeric: 'auto'});
    const deltaSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    const units = [{unit: 'year', seconds: 60 * 60 * 24 * 365}, {
        unit: 'month',
        seconds: 60 * 60 * 24 * 30
    }, {unit: 'week', seconds: 60 * 60 * 24 * 7}, {unit: 'day', seconds: 60 * 60 * 24}, {
        unit: 'hour',
        seconds: 60 * 60
    }, {unit: 'minute', seconds: 60}, {unit: 'second', seconds: 1},];

    for (const {unit, seconds} of units) {
        const value = Math.round(deltaSeconds / seconds);
        if (Math.abs(value) >= 1) {
            return rtf.format(value, unit);
        }
    }

    return rtf.format(0, 'second');
}
