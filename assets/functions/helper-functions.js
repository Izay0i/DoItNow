import { MODES_ENUM, EXPO_WEEKDAYS_ENUM } from "../constants/app-constants";

export const convertNumberToExpoWeekdayStr = (dayNumber) => {
    switch (dayNumber) {
        //にちようび
        case EXPO_WEEKDAYS_ENUM.SUNDAY:
            return 'Sunday ';
        //げつようび
        case EXPO_WEEKDAYS_ENUM.MONDAY:
            return 'Monday ';
        //かようび
        case EXPO_WEEKDAYS_ENUM.TUESDAY:
            return 'Tuesday ';
        //すいようび
        case EXPO_WEEKDAYS_ENUM.WEDNESDAY:
            return 'Wednesday ';
        //もくようび
        case EXPO_WEEKDAYS_ENUM.THURSDAY:
            return 'Thursday ';
        //きんようび
        case EXPO_WEEKDAYS_ENUM.FRIDAY:
            return 'Friday ';
        //どようび
        case EXPO_WEEKDAYS_ENUM.SATURDAY:
            return 'Saturday ';
        default:
            return '';
    }
};

//See MODES_ENUM
export const generateTriggerDescription = (notificationMode, trigger) => {
    let description = '';

    switch (notificationMode) {
        case MODES_ENUM.DATE_TIME:
            description += trigger?.dateStr;
            break;
        case MODES_ENUM.YEARLY:
            description += trigger?.day + '/' + trigger?.month + ' ';
        case MODES_ENUM.WEEKLY:
            description += convertNumberToExpoWeekdayStr(trigger?.weekday);
        case MODES_ENUM.DAILY:
            description += trigger?.hour + ':' + trigger?.minute;
            description = (trigger?.repeats ? 'every ' : '') + description;
            break;
    }

    return description;
};