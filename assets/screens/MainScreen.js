import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

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
    {
      id: '2',
      title: 'Trigger repeat (10s)',
      function: async () => {
        notificationIdentifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'This notification fires every 10s',
            body: 'Sephiroth',
          },
          trigger: {
            seconds: 10,
            repeats: true,
          }
        });
      }
    },
    {
      id: '3',
      title: 'Cancel',
      function: async () => {
        notificationIdentifier && await Notifications.cancelScheduledNotificationAsync(notificationIdentifier);
      }
    },
    {
      id: '4',
      title: 'Test',
    },
    {
      id: '5',
      title: 'Test',
    },
    {
      id: '6',
      title: 'Test',
    },
    {
      id: '7',
      title: 'Test',
    },
    {
      id: '8',
      title: 'Test',
    },
    {
      id: '9',
      title: 'Test',
    },
    {
      id: '10',
      title: 'Test',
    },
    {
      id: '11',
      title: 'Test',
    },
    {
      id: '12',
      title: 'Test',
    },
  ]);

  function addTask() {
    let id = parseInt(tasks[tasks.length - 1].id, 10) + 1;

    const task = {
      id: id.toString(),
      title: 'Example task',
    };
              
    let newTaskList = [...tasks, task];
    setTasks(newTaskList);
  }

  return (
    <Stack.Navigator initialRouteName='TaskList' screenOptions={{headerShown: false}}>
      <Stack.Screen name='TaskList'>{() => <TaskListScreen taskList={tasks}></TaskListScreen>}</Stack.Screen>
      <Stack.Screen name='TaskEditor' component={TaskEditorScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}