import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
    'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
  });

  if (fontsLoaded) {
    return (
      <View style = { styles.container }>
        <Text style = { styles.title }>Hello world!</Text>
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
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'black',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'white',
  }
});