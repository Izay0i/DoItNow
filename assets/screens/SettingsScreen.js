import React, { useState, useEffect } from 'react';

import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID } from '../constants/app-constants';

import * as Google from 'expo-auth-session/providers/google';

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
    let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
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
        </View>
      );
    }
  }
  
  return (
    <View style={styles.body}>
      {showUserInfo()}

      <Button 
      title={accessToken ? 'Get user data' : 'Sync'} 
      onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true, showInRecents: true}); }} 
      color='purple'></Button>

      <Button title='Import data'></Button>
      <Button title='Export data'></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  }
});