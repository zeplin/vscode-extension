const DAYS_IN_WEEK = 7;
const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MS_IN_MINUTE = MS_IN_SECOND * SECONDS_IN_MINUTE;
const MINUTES_IN_HOUR = 60;
const MS_IN_HOUR = MINUTES_IN_HOUR * MS_IN_MINUTE;
const HOURS_IN_DAY = 24;
const MS_IN_DAY = HOURS_IN_DAY * MS_IN_HOUR;
const DAYS_IN_MONTH = 30;
const MS_IN_MONTH = DAYS_IN_MONTH * MS_IN_DAY;

/**
 * Returns index of monday-based day
 */
function getWeekday(date: Date) {
    return (date.getDay() - 1) % DAYS_IN_WEEK;
}

export {
    DAYS_IN_WEEK,
    MS_IN_MINUTE,
    MS_IN_HOUR,
    MS_IN_DAY,
    MS_IN_MONTH,
    getWeekday
};
