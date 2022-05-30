import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider } from 'react-redux';
import { store, persistor } from './assets/redux/store';
import { PersistGate } from 'redux-persist/es/integration/react';
import { CHANNEL_ID, CHANNEL_NAME } from './assets/constants/app-constants';
import { COLORS_ENUM } from './assets/constants/color-constants';

import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';

import TabNavigation from './assets//navigations/TabNavigation';

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  })
});

export default function App() {
  useEffect(() => {
    const setNotificationChannel = async () => {
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: CHANNEL_NAME,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: COLORS_ENUM.ORANGE,
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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BottomSheetModalProvider>
            <View onLayout={onLayoutRootView}></View>
            <TabNavigation></TabNavigation>
          </BottomSheetModalProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}