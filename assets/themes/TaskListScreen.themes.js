import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  listBody: {
    flex: 1,
  },
  backgroundImageBody: {
    flex: 4,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 24,
    textAlign: 'center',
    color: COLORS_ENUM.GRAY,
  },
});

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS_ENUM.BACKGROUND,
  },
  buttonsBody: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS_ENUM.BACKGROUND,
  },
  modalBody: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS_ENUM.WHITE,
  },
  descriptionBody: {
    flex: 2,
    padding: 16,
    backgroundColor: COLORS_ENUM.WHITE,
  },
  taskDesText: {
    fontFamily: 'regular-font',
    fontSize: 20,
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  buttonsBody: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS_ENUM.BLACK,
  },
  modalBody: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS_ENUM.BLACK,
  },
  descriptionBody: {
    flex: 2,
    padding: 16,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  taskDesText: {
    fontFamily: 'regular-font',
    fontSize: 20,
    color: COLORS_ENUM.GRAY,
  },
});