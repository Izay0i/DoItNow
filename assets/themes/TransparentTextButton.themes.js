import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  text: {
    fontFamily: 'regular-font',
    fontSize: 24,
    textAlign: 'center',
  },
});

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    borderColor: COLORS_ENUM.GRAY,
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
});

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    borderColor: COLORS_ENUM.DARK_GRAY,
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
});