import React, { useState, useEffect } from 'react';

import { View, StyleSheet, Text, TouchableOpacity, Switch, Image } from 'react-native';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, USER_INFO_API } from '../constants/app-constants';

import * as Google from 'expo-auth-session/providers/google';

import Ionicons from '@expo/vector-icons/Ionicons';

const IconButton = ({ onPress, iconName, title, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.iconButton}}>
      <Ionicons name={iconName} size={22} color='white'></Ionicons>
      <Text style={styles.iconText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function SettingsScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
    });

    console.log(message);
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
  
  return (
    <View style={styles.body}>
      <View style={styles.buttonsContainer}>
        {showUserInfo()}

        <IconButton 
        iconName='logo-google' 
        title={accessToken ? 'Get user data' : 'Sync with Google'} 
        backgroundColor='#dd4b39' 
        onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true, showInRecents: true}); }}></IconButton>

        <IconButton iconName='arrow-down-outline' title='Import data' backgroundColor='#00b300' onPress={() => {}}></IconButton>

        <IconButton iconName='arrow-up-outline' title='Export data' backgroundColor='#44a6c6' onPress={() => {}}></IconButton>
      </View>

      <View style={styles.accessibilityContainer}>
        <Text style={{fontFamily: 'poppins-regular'}}>Dark theme</Text>

        <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'poppins-regular',
    color: 'white',
  }
});