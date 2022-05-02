import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/es/integration/react';

import TaskListScreen from './TaskListScreen';
import TaskEditorScreen from './TaskEditorScreen';

const Stack = createStackNavigator();

export default function MainScreen({ navigation }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack.Navigator initialRouteName='TaskList' screenOptions={{headerShown: false,}}>
          <Stack.Screen name='TaskList' component={TaskListScreen}></Stack.Screen>
          <Stack.Screen name='TaskEditor' component={TaskEditorScreen}></Stack.Screen>
        </Stack.Navigator>
      </PersistGate>
    </Provider>
  );
}