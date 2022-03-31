import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
    'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
  });

  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '381369859941-4s3bblmr6usua706k36l5mli5qfqdp9h.apps.googleusercontent.com',
    expoClientId: '381369859941-23i5j8skkqvrgbj7339gf2i692i7o9ln.apps.googleusercontent.com',
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

  if (fontsLoaded) {
    return (
      <View style = {styles.container}>
        {showUserInfo()}

        <Text style={styles.title}>Hello world!</Text>

        <Button 
        title={accessToken ? 'Get user data' : 'Login'} 
        onPress={accessToken ? getUserData: () => {
          promptAsync({useProxy: true, showInRecents: true});
        }}></Button>
      </View>
    );
  }
  else {
    return (
      <AppLoading></AppLoading>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
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