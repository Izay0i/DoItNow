import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export const lightStyles = StyleSheet.create({
  touchableBody: {
    flex: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS_ENUM.GRAY,
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: COLORS_ENUM.WHITE,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 12,
    textAlign: 'left',
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  touchableBody: {
    flex: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS_ENUM.DARK_GRAY,
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 12,
    textAlign: 'left',
    color: COLORS_ENUM.GRAY,
  },
});