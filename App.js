import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, StatusBar } from 'react-native';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import TaskList from './assets/components/TaskList';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
    'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
  });

  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'First task',
    },
    {
      id: '2',
      title: 'Second task',
    },
    {
      id: '3',
      title: 'Third task',
    }
  ]);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '381369859941-4s3bblmr6usua706k36l5mli5qfqdp9h.apps.googleusercontent.com',
    expoClientId: '381369859941-23i5j8skkqvrgbj7339gf2i692i7o9ln.apps.googleusercontent.com',
  });

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

  if (fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>HOME</Text>

        <TaskList taskList={tasks}></TaskList>

        <View style={styles.buttonsContainer}>
          <Button title='Add task' onPress={addTask} color='purple'></Button>

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
  else {
    return (
      <AppLoading></AppLoading>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: 'row-reverse',
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