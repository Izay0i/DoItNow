import { StyleSheet, Dimensions } from 'react-native';
import { COLORS_ENUM } from '../constants/color-constants';

export const mainStyles = StyleSheet.create({
  body: {
    position: 'absolute',
    width: '100%',
  },
  centeredModalBody: {
    flex: 1,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBody: {
    flex: 4,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  listBody: {
    position: 'absolute',
    width: '100%',
    maxHeight: '50%',
    top: 55,
  },
  searchBody: {
    flex: 1,
    flexDirection: 'row',
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: COLORS_ENUM.GRAY,
  },
});

export const lightStyles = StyleSheet.create({
  secondaryBody: {
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
  buttonsBody: {
    flex: 1,
    margin: 6,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS_ENUM.GRAY,
    justifyContent: 'space-between',
    backgroundColor: COLORS_ENUM.WHITE,
  },
  textInputBody: {
    flex: 1,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: COLORS_ENUM.BLACK,
    padding: 8,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
    color: COLORS_ENUM.BLACK,
    backgroundColor: COLORS_ENUM.WHITE,
  },
  modalText: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'center',
    color: COLORS_ENUM.BLACK,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'left',
    color: COLORS_ENUM.BLACK,
  },
});

export const darkStyles = StyleSheet.create({
  secondaryBody: {
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
  buttonsBody: {
    flex: 1,
    margin: 6,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS_ENUM.GRAY,
    justifyContent: 'space-between',
    backgroundColor: COLORS_ENUM.DARK_GRAY,
  },
  textInputBody: {
    flex: 1,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: COLORS_ENUM.GRAY,
    padding: 8,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
    color: COLORS_ENUM.WHITE,
    backgroundColor: COLORS_ENUM.DARK_GRAY,
  },
  modalText: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'center',
    color: COLORS_ENUM.GRAY,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'left',
    color: COLORS_ENUM.GRAY,
  },
});