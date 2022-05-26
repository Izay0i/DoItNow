import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  buttonsBody: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  accessibilityBody: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
  },
});

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS_ENUM.BACKGROUND,
  },
  iconText: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'bold-font',
    fontSize: 20,
    color: COLORS_ENUM.WHITE,
  },
  text: {
    fontFamily: 'bold-font',
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  iconText: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'bold-font',
    fontSize: 20,
    color: COLORS_ENUM.GRAY,
  },
  text: {
    fontFamily: 'bold-font',
    color: COLORS_ENUM.GRAY,
  },
});