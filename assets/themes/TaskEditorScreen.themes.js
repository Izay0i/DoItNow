import { StyleSheet } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  centeredModalBody: {
    flex: 1,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownsBody: {
    flex: 1, 
    flexDirection: 'row',
  },
  modePickerBody: {
    flex: 1,
    padding: 8,
  },
  dayPickerBody: {
    flex: 1,
    padding: 8,
  },
  timePickerBody: {
    flex: 2,
    zIndex: 0,
  },
  toggleBody: {
    flex: 1,
    flexDirection: 'row',
  },
  iconTextButton: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 22,
    alignItems: 'center',
  },
});

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS_ENUM.BACKGROUND,
  },
  modalBody: {
    margin: 32,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: COLORS_ENUM.WHITE,
    shadowColor: COLORS_ENUM.BLACK,
    elevation: 4,
  },
  textInputBody: {
    fontFamily: 'regular-font',
    padding: 16,
    marginBottom: 4,
    color: COLORS_ENUM.BLACK,
    backgroundColor: COLORS_ENUM.WHITE,
  },
  modalText: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'center',
    color: COLORS_ENUM.WHITE,
  },
  iconTextButtonText: {
    flex: 1,
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'center',
    color: COLORS_ENUM.BLACK,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 16,
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS_ENUM.BLACK,
  },
  modalBody: {
    margin: 32,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: COLORS_ENUM.BLACK,
    shadowColor: COLORS_ENUM.DARK_BLUE,
    elevation: 4,
  },
  textInputBody: {
    fontFamily: 'regular-font',
    padding: 16,
    marginBottom: 4,
    color: COLORS_ENUM.WHITE,
    backgroundColor: COLORS_ENUM.DARK_GRAY,
  },
  modalText: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'center',
    color: COLORS_ENUM.GRAY,
  },
  iconTextButtonText: {
    flex: 1,
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'center',
    color: COLORS_ENUM.WHITE,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 16,
    color: COLORS_ENUM.GRAY,
  },
});