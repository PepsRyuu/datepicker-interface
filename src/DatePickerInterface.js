function getLocaleString (lang, date, options) {
    lang += '-u-ca-gregory';
    return date.toLocaleDateString(lang, options);
}

function getNumDaysInMonth (year, month) {
    // Month is zero indexed, 0 is effectively -1
    // so we get the last day of the previous month.
    // For example, 2020, 2, 0, where 2 is normally March,
    // it will give the last day of Feb instead.
    return new Date(year, month + 1, 0).getDate();
}

function getLabels (count, incrementer, translator) {
    let start = new Date(2017, 0, 1);
    let output = [];

    for (let i = 0; i < count; i++) {
        incrementer(start, i);
        output.push(translator(start));
    }
    
    return output;
}

function getDayLabels (lang) {
    return getLabels(7, (d, i) => (
        d.setDate(i + 1)
    ), d => ({
        short: getLocaleString(lang, d, { weekday: 'narrow' })
    }));
}

function getMonthLabels (lang) {
    return getLabels(12, (d, i) => (
        d.setMonth(i)
    ), d => ({
        short: getLocaleString(lang, d, { month: 'short' }),
        long: getLocaleString(lang, d, { month: 'long' })
    }));
}

function getDateGrid (numStartWeekday, numDaysInMonth) {
    let calendar_grid = [];
    let date_index = 1;

    for (let week = 0; week < 6; week++) {
        let week_output = ['', '', '', '', '', '', ''];
        
        for (let day = week === 0? numStartWeekday : 0; day < 7; day++) { // cols
            if (date_index <= numDaysInMonth) {
                week_output[day] = '' + (date_index++);
            }
        }

        week_output = week_output.map(v => ({
            text: v,
            value: v !== ''? parseInt(v) : null
        }));

        calendar_grid.push(week_output);
    }

    return calendar_grid;
}

function changePage (level, pivot, delta) {
    if (level === 'day') {
        pivot.setMonth(pivot.getMonth() + delta);
    }

    if (level === 'month') {
        pivot.setFullYear(pivot.getFullYear() + delta);
    }

    if (level === 'year') {
        pivot.setFullYear(pivot.getFullYear() + delta * 10);
    }
}

export function createDatePickerInterface (options = {}) {
    let currentPage = 0;
    let language = options.language || navigator.language;
    let currentLevel = 'day';
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let monthLabels = getMonthLabels(language);
    let dayLabels = getDayLabels(language);
    let pivot = new Date(currentYear, currentMonth, 1);

    return {
        setLevel: function (level) {
            currentLevel = level;
        },

        goUpLevel: function () {
            if (currentLevel === 'day') {
                currentLevel = 'month';
            } else if (currentLevel === 'month') {
                currentLevel = 'year';
            }
        },

        goUpPage: function () {
            changePage(currentLevel, pivot, -1);
        },

        goDownPage: function () {
            changePage(currentLevel, pivot, +1);
        },

        getFormattedDate: function (d) {
            return getLocaleString(language, d, { month: '2-digit', day: '2-digit', year: 'numeric' });
        },

        getPlaceholder: function () {
            if (!window.Intl || options.intl) {
                return 'YYYY-MM-DD';
            }

            return getLocaleString(language, new Date(1933, 10, 22), { month: '2-digit', day: '2-digit', year: 'numeric' })
                .replace('22', 'DD')
                .replace('11', 'MM')
                .replace('1933', 'YYYY')
        },

        getLayout: function () {
            if (currentLevel === 'day') {
                let numDaysInMonth = getNumDaysInMonth(pivot.getFullYear(), pivot.getMonth());
                let numStartWeekday = pivot.getDay(); // 0 for sunday

                return {
                    level: 'day',
                    title: monthLabels[pivot.getMonth()].long + ' ' + pivot.getFullYear(),
                    grid: [
                        dayLabels.map(d => ({
                            text: d.short,
                            header: true
                        })),
                        ...getDateGrid(numStartWeekday, numDaysInMonth)
                    ],
                    onSelect: function (day) {
                        let d = new Date(pivot.getFullYear(), pivot.getMonth(), day);
                        if (options.onDateSelect) {
                            options.onDateSelect(d);
                        }
                    }
                }
            }

            if (currentLevel === 'month') {
                return {
                    level: 'month',
                    title: '' + pivot.getFullYear(),
                    grid: [
                        ...[0,1,2].map(r => (
                            [0, 1, 2, 3].map(c => ({
                                text: monthLabels[r * 4 + c].short,
                                value: r * 4 + c
                            }))
                        ))
                    ],
                    onSelect: function (month) {
                        currentLevel = 'day';
                        pivot.setMonth(month);
                    }
                }
            }

            if (currentLevel === 'year') {
                let year = pivot.getFullYear();
                let startRange = year - (year % 10);
                let endRange = startRange + 12;

                return {
                    level: 'year',
                    title: startRange + ' - ' + (endRange - 1),
                    grid: [
                        ...[0,1,2].map(r => (
                            [0, 1, 2, 3].map(c => ({
                                text: '' + (startRange + (r * 4 + c)),
                                value: startRange + r * 4 + c
                            }))
                        ))
                    ],
                    onSelect: function (year) {
                        currentLevel = 'month';
                        pivot.setFullYear(year);
                    }
                }
            }
        }
    }
}