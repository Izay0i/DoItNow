import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({});

export const lightStyles = StyleSheet.create({
  textInputBody: {
    padding: 16,
    marginBottom: 4,
    fontFamily: 'regular-font',
    color: COLORS_ENUM.BLACK,
    backgroundColor: COLORS_ENUM.WHITE,
  },
});

export const darkStyles = StyleSheet.create({
  textInputBody: {
    padding: 16,
    marginBottom: 4,
    fontFamily: 'regular-font',
    color: COLORS_ENUM.WHITE,
    backgroundColor: COLORS_ENUM.DARK_GRAY,
  },
});