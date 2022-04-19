import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';

import 'react-native-gesture-handler';

import Ionicons from '@expo/vector-icons/Ionicons';
import AppLoading from 'expo-app-loading';

import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';

import MainScreen from './assets/screens/MainScreen';
import AgendaScreen from './assets/screens/AgendaScreen';
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

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    }
  }, []);

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName='Main' screenOptions={{ 
          headerStyle: {
            elevation: 16,
            backgroundColor: '#ffffff',
            shadowColor: '#000000',
            //backgroundColor: '#0c4da2',
          },
          headerTitleStyle: {
            //color: 'white', 
            fontFamily: 'poppins-bold',
            fontSize: 32,
          },
          headerTitleAlign: 'center',
          tabBarStyle: {
            height: 60,
            position: 'absolute',
            margin: 20,
            borderRadius: 16,
          },
          tabBarShowLabel: false,
        }}>
          <Tab.Screen name='Home' component={MainScreen} options={{ 
            tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'home' : 'home-outline'} size={42} color='black' />) 
          }}></Tab.Screen>
          <Tab.Screen name='Agenda' component={AgendaScreen} options={{ 
            tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={42} color='black' />) 
          }}></Tab.Screen>
          <Tab.Screen name='Settings' component={SettingsScreen} options={{ 
            tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'settings' : 'settings-outline'} size={42} color='black' />) 
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