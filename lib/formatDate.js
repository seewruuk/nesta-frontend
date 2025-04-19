/**
 * Formatuje datę w stylu względnym ("2 tygodnie temu") lub absolutnym ("23 stycznia 2025").
 *
 * @param {string|Date} dateInput – data w formacie ISO ("2025-01-23T10:00:00Z") lub obiekt Date
 * @param {'relative'|'absolute'} type – wybór formatu: 'relative' lub 'absolute'
 * @returns {string}
 */
export default function formatDate(dateInput, type = 'relative') {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();

    if (type === 'absolute') {
        // "23 stycznia 2025"
        return new Intl.DateTimeFormat('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    }

    // ---- względne ("2 tygodnie temu", "za 3 dni" itd.) ----
    const rtf = new Intl.RelativeTimeFormat('pl', { numeric: 'auto' });
    const deltaSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    const units = [
        { unit: 'year',   seconds: 60 * 60 * 24 * 365 },
        { unit: 'month',  seconds: 60 * 60 * 24 * 30 },
        { unit: 'week',   seconds: 60 * 60 * 24 * 7 },
        { unit: 'day',    seconds: 60 * 60 * 24 },
        { unit: 'hour',   seconds: 60 * 60 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 },
    ];

    for (const { unit, seconds } of units) {
        const value = Math.round(deltaSeconds / seconds);
        if (Math.abs(value) >= 1) {
            return rtf.format(value, unit);
        }
    }

    // "teraz"
    return rtf.format(0, 'second');
}
