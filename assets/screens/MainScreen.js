import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { Store } from '../redux/store';

import * as Notifications from 'expo-notifications';

import TaskListScreen from './TaskListScreen';
import TaskEditorScreen from './TaskEditorScreen';

let notificationIdentifier = null;

const Stack = createStackNavigator();

export default function MainScreen({ navigation }) {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Trigger once (5s)',
      function: async () => {
        notificationIdentifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'This notification fires once',
            body: 'My body is reggie',
          },
          trigger: {
            seconds: 5,
          }
        });
      }
    },
  ]);

  return (
    <Provider store={Store}>
      <Stack.Navigator initialRouteName='TaskList' screenOptions={{headerShown: false,}}>
        <Stack.Screen name='TaskList' component={TaskListScreen}></Stack.Screen>
        <Stack.Screen name='TaskEditor' component={TaskEditorScreen}></Stack.Screen>
      </Stack.Navigator>
    </Provider>
  );
}