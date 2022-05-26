import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  
});

export const lightStyles = StyleSheet.create({
  header: {
    backgroundColor: COLORS_ENUM.WHITE,
  },
  tabBar: {
    backgroundColor: COLORS_ENUM.WHITE,
  },
  title: {
    fontFamily: 'header-font',
    fontSize: 32,
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  header: {
    backgroundColor: COLORS_ENUM.BLACK,
  },
  tabBar: {
    backgroundColor: COLORS_ENUM.BLACK,
  },
  title: {
    fontFamily: 'header-font',
    fontSize: 32,
    color: COLORS_ENUM.GRAY,
  },
});