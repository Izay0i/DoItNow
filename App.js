import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';

import Ionicons from '@expo/vector-icons/Ionicons';
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
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
          'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
        });
      }
      catch (e) {
        console.warn(e);
      }
      finally {
        setAppIsReady(true);
      }
    }

    prepare();

    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    }
  }, []);

  const [appIsReady, setAppIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1,}}>
      <BottomSheetModalProvider>
        <View onLayout={onLayoutRootView}></View>
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Main' screenOptions={{ 
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTitleStyle: {
              color: '#000000', 
              fontFamily: 'poppins-bold',
              fontSize: 32,
            },
            headerTitleAlign: 'center',
            tabBarShowLabel: false,
          }}>
            <Tab.Screen name='Home' component={MainScreen} options={{ 
              tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'home' : 'home-outline'} size={42} color='black' />) 
            }}></Tab.Screen>
            <Tab.Screen name='Schedules' component={AgendaScreen} options={{ 
              tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'documents' : 'documents-outline'} size={42} color='black' />) 
            }}></Tab.Screen>
            <Tab.Screen name='Settings' component={SettingsScreen} options={{ 
              tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'settings' : 'settings-outline'} size={42} color='black' />) 
            }}></Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}