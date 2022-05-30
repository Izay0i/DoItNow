import { MODES_ENUM, EXPO_WEEKDAYS_ENUM } from "../constants/app-constants";

import i18n from 'i18n-js';

export const convertNumberToExpoWeekdayStr = (dayNumber) => {
  switch (dayNumber) {
    //にちようび
    case EXPO_WEEKDAYS_ENUM.SUNDAY:
      return i18n.t('sunday');
    //げつようび
    case EXPO_WEEKDAYS_ENUM.MONDAY:
      return i18n.t('monday');
    //かようび
    case EXPO_WEEKDAYS_ENUM.TUESDAY:
      return i18n.t('tuesday');
    //すいようび
    case EXPO_WEEKDAYS_ENUM.WEDNESDAY:
      return i18n.t('wednesday');
    //もくようび
    case EXPO_WEEKDAYS_ENUM.THURSDAY:
      return i18n.t('thursday');
    //きんようび
    case EXPO_WEEKDAYS_ENUM.FRIDAY:
      return i18n.t('friday');
    //どようび
    case EXPO_WEEKDAYS_ENUM.SATURDAY:
      return i18n.t('saturday');
    default:
      return '';
    }
};

export const convertExpoWeekdayToDay = (expoWeekday) => {
  return expoWeekday - 1;
};

//See MODES_ENUM
export const generateDescription = (item) => {
  const { trigger } = item;
  const { title, body } = { ...item.content };
  const { childId, mode, location } = { ...item.content?.data };

  let description = '';

  switch (mode) {
    case MODES_ENUM.DATE_TIME:
      description += `${i18n.t('triggersOn')} ` + trigger?.dateStr;
      break;
    case MODES_ENUM.YEARLY:
      description += trigger?.day + '/' + trigger?.month + ' ';
    case MODES_ENUM.WEEKLY:
      description += convertNumberToExpoWeekdayStr(trigger?.weekday) + ' ';
    case MODES_ENUM.DAILY:
      description += trigger?.hour + ':' + trigger?.minute;
      description = `${i18n.t('triggersOnEvery')} ` + description;
      break;
  }

  description = `${i18n.t('title')}: ${title}\n${i18n.t('description')}: ${body}\n\n` + description;

  if (childId !== '') {
    description = `${i18n.t('urgent')}\n` + description;
  }

  if (location !== '') {
    description += `\n${i18n.t('atLocation')}: ${location}`;
  }
  return description;
};

export const getTaskByTitle = (tasks, title) => {
  return tasks.filter(task => task.content.title.indexOf(title) > -1);
}

export const getTasksByDate = (tasks, dayProps) => {
  const { day, month, year, timestamp } = dayProps;
  const weekday = new Date(timestamp).getDay();

  return tasks.filter(task => {
    const { taskDone, mode } = task.content.data;
    
    if (!taskDone) {
      switch (mode) {
        case MODES_ENUM.DATE_TIME:
          const date = new Date(task.trigger.date);
          const d = date.getDate();
          const m = date.getMonth() + 1;
          const y = date.getFullYear();
          return d === day && m === month && y === year;
        case MODES_ENUM.DAILY:
          return true;
        case MODES_ENUM.WEEKLY:
          return convertExpoWeekdayToDay(task.trigger.weekday) === weekday;
        case MODES_ENUM.YEARLY:
          return task.trigger.day === day && (task.trigger.month + 1) === month;
      } 
    }
  });
};