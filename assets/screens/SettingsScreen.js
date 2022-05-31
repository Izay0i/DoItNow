import React, { useMemo } from 'react';
import { View, Text, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setLanguage, setSecret } from '../redux/actions';
import { mainStyles, lightStyles, darkStyles } from '../themes/SettingsScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';

import * as Updates from 'expo-updates';

import i18n from 'i18n-js';
import ItemPicker from '../components/ItemPicker';

export default function SettingsScreen({ navigation }) {
  const items = useMemo(() => [
    { label: i18n.t('settingsThemesOptionLight'), value: 'light' },
    { label: i18n.t('settingsThemesOptionDark'), value: 'dark' },
  ], []);

  const languages = useMemo(() => [
    { label: 'Tiếng Việt', value: 'vn' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'jp' },
  ], []);

  const { theme } = useSelector(state => state.themeReducer);
  const { language } = useSelector(state => state.languageReducer);
  const { secret } = useSelector(state => state.secretReducer);

  const toggleSwitch = () => dispatch(setSecret(!secret));

  const dispatch = useDispatch();

  const onChangeTheme = (item) => {
    dispatch(setTheme(item.value));
  };

  const onChangeLanguage = (item) => {
    dispatch(setLanguage(item.value));
    setTimeout(async () => await Updates.reloadAsync(), 200);
  };

  return (
    <View style={theme === 'light' ? lightStyles.body : darkStyles.body}>
      <View style={mainStyles.accessibilityBody}>
        <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{i18n.t('settingsThemesTitle')}</Text>
        <ItemPicker itemList={items} defaultValue={theme} onPress={(item) => onChangeTheme(item)} isDarkMode={theme !== 'light'}></ItemPicker>
      </View>

      <View style={mainStyles.languagesBody}>
        <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{i18n.t('settingsLanguagesTitle')}</Text>
        <ItemPicker itemList={languages} defaultValue={language} onPress={(item) => onChangeLanguage(item)} isDarkMode={theme !== 'light'}></ItemPicker>
      </View>

      <Switch 
      trackColor={{false: COLORS_ENUM.DARK_RED, true: COLORS_ENUM.GREEN}} 
      thumbColor={secret ? COLORS_ENUM.VIBRANT_GREEN : COLORS_ENUM.RED} 
      value={secret} 
      onValueChange={toggleSwitch}></Switch>
    </View>
  );
}