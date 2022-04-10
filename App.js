import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';

import MainScreen from './assets/screens/MainScreen';
import TaskEditorScreen from './assets/screens/TaskEditorScreen';

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  })
});

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
    'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
  });

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Main'>
          <Stack.Screen name='Main' component={MainScreen} options={{ title: 'Home' }}></Stack.Screen>
          <Stack.Screen name='TaskEditor' component={TaskEditorScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  else {
    return (
      <AppLoading></AppLoading>
    );
  }
}