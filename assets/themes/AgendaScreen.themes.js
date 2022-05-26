import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({});

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS_ENUM.BACKGROUND,
  },
  modalBody: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS_ENUM.WHITE,
  },
  calendar: {
    backgroundColor: COLORS_ENUM.WHITE,
    calendarBackground: COLORS_ENUM.WHITE,
    textSectionTitleColor: COLORS_ENUM.BLUE,
    selectedDayTextColor: COLORS_ENUM.WHITE,
    todayTextColor: COLORS_ENUM.BLUE,
    dayTextColor: COLORS_ENUM.BLACK,
    arrowColor: COLORS_ENUM.BLUE,
    monthTextColor: COLORS_ENUM.BLACK,
    textDayFontFamily: 'regular-font',
    textMonthFontFamily: 'regular-font',
    textDayHeaderFontFamily: 'regular-font',
  },
  descriptionText: {
    fontFamily: 'regular-font',
    fontSize: 20,
    textAlign: 'left',
    color: COLORS_ENUM.BLACK,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 24,
    textAlign: 'center',
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  modalBody: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  calendar: {
    backgroundColor: COLORS_ENUM.DARK_GRAY,
    calendarBackground: COLORS_ENUM.DARK_GRAY,
    textSectionTitleColor: COLORS_ENUM.BLUE,
    selectedDayTextColor: COLORS_ENUM.WHITE,
    todayTextColor: COLORS_ENUM.DARK_RED,
    dayTextColor: COLORS_ENUM.GRAY,
    arrowColor: COLORS_ENUM.BLUE,
    monthTextColor: COLORS_ENUM.GRAY,
    textDayFontFamily: 'regular-font',
    textMonthFontFamily: 'regular-font',
    textDayHeaderFontFamily: 'regular-font',
  },
  descriptionText: {
    fontFamily: 'regular-font',
    fontSize: 20,
    textAlign: 'left',
    color: COLORS_ENUM.GRAY,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 24,
    textAlign: 'center',
    color: COLORS_ENUM.GRAY,
  },
});