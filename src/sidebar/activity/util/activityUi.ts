import localization from "../../../localization";
import {
    DAYS_IN_WEEK, MS_IN_DAY, MS_IN_MONTH, MS_IN_HOUR, MS_IN_MINUTE, getWeekday
} from "../../../common/general/dateTimeUtil";

function getDateSlot(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayInMs = today.getTime();
    const yesterday = new Date(todayInMs - MS_IN_DAY);
    const thisWeek = new Date(todayInMs - getWeekday(now) * MS_IN_DAY);
    const lastWeek = new Date(todayInMs - (getWeekday(now) + DAYS_IN_WEEK) * MS_IN_DAY);
    const thisMonth = new Date(todayInMs - (now.getDate() - 1) * MS_IN_DAY);
    const lastMonth = new Date(todayInMs - (now.getDate() + 1) * MS_IN_DAY);
    lastMonth.setDate(1);

    if (date > today) {
        return localization.sidebar.activity.today;
    } else if (date > yesterday) {
        return localization.sidebar.activity.yesterday;
    } else if (date > thisWeek) {
        return localization.sidebar.activity.thisWeek;
    } else if (date > lastWeek) {
        return localization.sidebar.activity.lastWeek;
    } else if (date > thisMonth) {
        return localization.sidebar.activity.thisMonth;
    } else if (date > lastMonth) {
        return localization.sidebar.activity.lastMonth;
    } else if (date.getFullYear() === now.getFullYear()) {
        return localization.sidebar.activity.monthName(date);
    } else {
        return localization.sidebar.activity.monthNameYear(date);
    }
}

function getDateAgo(date: Date): string {
    const msPassed = new Date().getTime() - date.getTime();
    const monthsPassed = Math.floor(msPassed / MS_IN_MONTH);
    const daysPassed = Math.floor(msPassed / MS_IN_DAY);
    const hoursPassed = Math.floor(msPassed / MS_IN_HOUR);
    const minutesPassed = Math.floor(msPassed / MS_IN_MINUTE);
    if (monthsPassed > 0) {
        return ""; // Do not show if more than one months passed
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
