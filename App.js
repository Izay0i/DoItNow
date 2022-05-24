import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider } from 'react-redux';
import { store, persistor } from './assets/redux/store';
import { PersistGate } from 'redux-persist/es/integration/react';
import { CHANNEL_ID, CHANNEL_NAME } from './assets/constants/app-constants';

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
    const setNotificationChannel = async () => {
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: CHANNEL_NAME,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#ff231f7c',
        });
      }
    };
    setNotificationChannel();

    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'bold-font': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
          'regular-font': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
          'header-font': require('./assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf'),
        });
      }
      catch (e) {
        console.warn(e);
      }
      finally {
        setAppIsReady(true);
      }
    };
    prepare();

    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    }
  }, []);

  const [appIsReady, setAppIsReady] = useState(false);

  const notificationListener = useRef();

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1,}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BottomSheetModalProvider>
            <View onLayout={onLayoutRootView}></View>
            <NavigationContainer>
              <Tab.Navigator initialRouteName='Home' screenOptions={{ 
                headerStyle: {
                  backgroundColor: '#ffffff',
                },
                headerTitleStyle: {
                  color: '#000000', 
                  fontFamily: 'header-font',
                  fontSize: 32,
                },
                headerTitleAlign: 'center',
                tabBarShowLabel: false,
              }}>
                <Tab.Screen name='Schedules' component={AgendaScreen} options={{ 
                  tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={42} color='#000000' />) 
                }}></Tab.Screen>
                <Tab.Screen name='Home' component={MainScreen} options={{ 
                  tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'home' : 'home-outline'} size={42} color='#000000' />) 
                }}></Tab.Screen>
                <Tab.Screen name='Settings' component={SettingsScreen} options={{ 
                  tabBarIcon: ({focused}) => (<Ionicons name={focused ? 'settings' : 'settings-outline'} size={42} color='#000000' />) 
                }}></Tab.Screen>
              </Tab.Navigator>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}