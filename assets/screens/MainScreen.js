import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TaskListScreen from './TaskListScreen';
import TaskEditorScreen from './TaskEditorScreen';
import GeolocationScreen from './GeolocationScreen';

const Stack = createNativeStackNavigator();

export default function MainScreen({ navigation }) {
  return (
    <Stack.Navigator initialRouteName='TaskList' screenOptions={{headerShown: false,}}>
      <Stack.Screen name='TaskList' component={TaskListScreen}></Stack.Screen>
      <Stack.Screen name='TaskEditor' component={TaskEditorScreen}></Stack.Screen>
      <Stack.Screen name='Geolocation' component={GeolocationScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}