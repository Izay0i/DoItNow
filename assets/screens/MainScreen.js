import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Button, Text } from 'react-native';

import * as Google from 'expo-auth-session/providers/google';
import * as Notifications from 'expo-notifications';

import TaskListScreen from './TaskListScreen';

let notificationIdentifier = null;

export default function MainScreen({ navigation }) {
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '381369859941-4s3bblmr6usua706k36l5mli5qfqdp9h.apps.googleusercontent.com',
    expoClientId: '381369859941-23i5j8skkqvrgbj7339gf2i692i7o9ln.apps.googleusercontent.com',
  });

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
    }
  ]);

  useEffect(() => {
    setMessage(JSON.stringify(response));

    if (response?.type == 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });

    console.log(message);
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View>
          <Text style={styles.title}>Welcome {userInfo.name}!</Text>
        </View>
      );
    }
  }

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
    <View style={styles.body}>
      <TaskListScreen navigation={navigation} taskList={tasks}></TaskListScreen>

      <View style={styles.buttonsContainer}>
        {showUserInfo()}

        <Button 
        title={accessToken ? 'Get user data' : 'Sync'} 
        onPress={accessToken ? getUserData: () => {
          promptAsync({useProxy: true, showInRecents: true});
        }} 
        color='purple'></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  }
});