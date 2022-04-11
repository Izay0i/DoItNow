import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';

import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';

import MainScreen from './assets/screens/MainScreen';
import SettingsScreen from './assets/screens/SettingsScreen';

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  })
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
    'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
  });

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName='Main' screenOptions={{ 
          headerStyle: { 
            backgroundColor: 'blueviolet', 
          },
          headerTitleStyle: {
            fontWeight: 'bold', 
            color: 'white', 
          },
          headerTitleAlign: 'center',
        }}>
          <Tab.Screen name='Home' component={MainScreen} options={{ 
            tabBarIcon: () => (<Entypo name='home' size={24} color='black' />) 
          }}></Tab.Screen>
          <Tab.Screen name='Settings' component={SettingsScreen} options={{ 
            tabBarIcon: () => (<Ionicons name='settings' size={24} color='black' />) 
          }}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  else {
    return (
      <AppLoading></AppLoading>
    );
  }
}