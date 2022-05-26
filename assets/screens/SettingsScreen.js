import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setLanguage } from '../redux/actions';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, USER_INFO_API } from '@env';
import { mainStyles, lightStyles, darkStyles } from '../themes/SettingsScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';

import * as Google from 'expo-auth-session/providers/google';
import * as Updates from 'expo-updates';

import i18n from 'i18n-js';
import Ionicons from '@expo/vector-icons/Ionicons';
import ItemPicker from '../components/ItemPicker';

const IconButton = ({ onPress, iconName, title, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...mainStyles.iconButton}}>
      <Ionicons name={iconName} size={28} color={COLORS_ENUM.WHITE}></Ionicons>
      <Text style={lightStyles.iconText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function SettingsScreen({ navigation }) {
  useEffect(() => {
    setMessage(JSON.stringify(response));

    if (response?.type == 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);
  
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
  });

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

  const dispatch = useDispatch();

  const getUserData = async () => {
    let userInfoResponse = await fetch(USER_INFO_API, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
      console.log(data);
    });
  };

  const onChangeTheme = (item) => {
    dispatch(setTheme(item.value));
  };

  const onChangeLanguage = (item) => {
    dispatch(setLanguage(item.value));
    setTimeout(async () => await Updates.reloadAsync(), 1000);
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
    </View>
  );
}