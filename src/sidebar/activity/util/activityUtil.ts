import DateSlot from "../model/DateSlot";
import localization from "../../../localization";

/* eslint-disable @typescript-eslint/no-magic-numbers */
const MS_IN_MINUTE = 1000 * 60;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;
const MS_IN_WEEK = 7 * MS_IN_DAY;
const MS_IN_MONTH = 30 * MS_IN_DAY;
const MS_IN_YEAR = 365 * MS_IN_DAY;
/* eslint-enable @typescript-eslint/no-magic-numbers */
const AGO_YEAR_LIMIT = 2;

function getDateSlot(date: Date): DateSlot {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const now = new Date();
    const dayOfNow = now.getDate();
    const monthOfNow = now.getMonth();
    const yearOfNow = now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const dayOfYesterday = yesterday.getDate();
    const monthOfYesterday = yesterday.getMonth();
    const yearOfYesterday = yesterday.getFullYear();

    const msPassed = now.getTime() - date.getTime();

    if (day === dayOfNow && month === monthOfNow && year === yearOfNow) {
        return DateSlot.Today;
    } else if (day === dayOfYesterday && month === monthOfYesterday && year === yearOfYesterday) {
        return DateSlot.Yesterday;
    } else if (msPassed < MS_IN_WEEK) {
        return DateSlot.LessThanAWeekAgo;
    } else if (msPassed < MS_IN_MONTH) {
        return DateSlot.OverAWeekAgo;
    } else if (msPassed < MS_IN_YEAR) {
        return DateSlot.OverAMonthAgo;
    } else {
        return DateSlot.OverAYearAgo;
    }
}

function getDateAgo(date: Date): string {
    const msPassed = new Date().getTime() - date.getTime();
    const yearsPassed = Math.floor(msPassed / MS_IN_YEAR);
    const monthsPassed = Math.floor(msPassed / MS_IN_MONTH);
    const daysPassed = Math.floor(msPassed / MS_IN_DAY);
    const hoursPassed = Math.floor(msPassed / MS_IN_HOUR);
    const minutesPassed = Math.floor(msPassed / MS_IN_MINUTE);

    if (yearsPassed > AGO_YEAR_LIMIT) {
        return localization.sidebar.activity.yearsAgo(yearsPassed);
    } else if (monthsPassed > 0) {
        return localization.sidebar.activity.monthsAgo(monthsPassed);
    } else if (daysPassed > 0) {
        return localization.sidebar.activity.daysAgo(daysPassed);
    } else if (hoursPassed > 0) {
        return localization.sidebar.activity.hoursAgo(hoursPassed);
    } else {
        return localization.sidebar.activity.minutesAgo(minutesPassed);
    }
}

export {
    getDateSlot,
    getDateAgo
};
