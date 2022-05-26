import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  body: {
    flex: 1,
  },
  iconsBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const lightStyles = StyleSheet.create({
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    justifyContent: 'space-between',
    backgroundColor: COLORS_ENUM.WHITE,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 20,
    marginRight: 8,
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    justifyContent: 'space-between',
    backgroundColor: COLORS_ENUM.DARK_GRAY,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 20,
    marginRight: 8,
    color: COLORS_ENUM.GRAY,
  },
});