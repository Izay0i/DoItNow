import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/actions';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, USER_INFO_API } from '@env';
import { mainStyles, lightStyles, darkStyles } from '../themes/SettingsScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';

import * as Google from 'expo-auth-session/providers/google';

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
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ], []);

  const { theme } = useSelector(state => state.themeReducer);
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

  return (
    <View style={theme === 'light' ? lightStyles.body : darkStyles.body}>
      {/* <View style={mainStyles.buttonsBody}>
        <IconButton 
        iconName='logo-google' 
        title={accessToken ? 'SYNC DATA' : 'SIGN IN WITH GOOGLE'} 
        backgroundColor={theme === 'light' ? COLORS_ENUM.GOOGLE_RED : COLORS_ENUM.DARK_RED} 
        onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true}); }}
        ></IconButton>
      </View> */}

      <View style={mainStyles.accessibilityBody}>
        <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>THEMES</Text>
        <ItemPicker itemList={items} defaultValue={theme} onPress={(item) => onChangeTheme(item)} isDarkMode={theme !== 'light'}></ItemPicker>
      </View>
    </View>
  );
}