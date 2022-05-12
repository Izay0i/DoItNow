import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, USER_INFO_API } from '../constants/app-constants';

import * as Google from 'expo-auth-session/providers/google';

import Ionicons from '@expo/vector-icons/Ionicons';
import ItemPicker from '../components/ItemPicker';

const IconButton = ({ onPress, iconName, title, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.iconButton}}>
      <Ionicons name={iconName} size={28} color='#ffffff'></Ionicons>
      <Text style={styles.iconText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function SettingsScreen({ navigation }) {
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
  });

  useEffect(() => {
    setMessage(JSON.stringify(response));

    if (response?.type == 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch(USER_INFO_API, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
      
      console.log(data);
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View>
          <Text style={styles.title}>Welcome {userInfo.name}!</Text>
          <Image source={{uri: userInfo.picture}} style={{width: 100, height: 100}}></Image>
        </View>
      );
    }
  }
  
  const items = [
    { label: 'Light', value: true },
    { label: 'Dark', value: false },
    { label: 'Auto', value: null },
  ];

  return (
    <View style={styles.body}>
      <View style={styles.buttonsContainer}>
        {showUserInfo()}

        <IconButton 
        iconName='logo-google' 
        title={accessToken ? 'SYNC DATA' : 'SIGN IN WITH GOOGLE'} 
        backgroundColor='#db4437' 
        onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true}); }}
        ></IconButton>

        {/* <IconButton iconName='enter-outline' title='IMPORT DATA' backgroundColor='#0f9d58' onPress={() => {}}></IconButton>

        <IconButton iconName='exit-outline' title='EXPORT DATA' backgroundColor='#4285f4' onPress={() => {}}></IconButton> */}
      </View>

      {/* <View style={styles.accessibilityContainer}>
        <Text style={{fontFamily: 'poppins-bold'}}>THEMES</Text>

        <ItemPicker itemList={items} onPress={(item) => console.log(item)}></ItemPicker>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 10,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  accessibilityContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  },
  iconButton: {
    flexDirection: 'row',
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
  },
  iconText: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'poppins-bold',
    color: 'white',
  }
});