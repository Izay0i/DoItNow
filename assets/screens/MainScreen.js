import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { Store } from '../redux/store';

import TaskListScreen from './TaskListScreen';
import TaskEditorScreen from './TaskEditorScreen';

const Stack = createStackNavigator();

export default function MainScreen({ navigation }) {
  return (
    <Provider store={Store}>
      <Stack.Navigator initialRouteName='TaskList' screenOptions={{headerShown: false,}}>
        <Stack.Screen name='TaskList' component={TaskListScreen}></Stack.Screen>
        <Stack.Screen name='TaskEditor' component={TaskEditorScreen}></Stack.Screen>
      </Stack.Navigator>
    </Provider>
  );
}