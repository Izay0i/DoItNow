import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { lightStyles, darkStyles } from '../themes/TabNavigation.themes';
import { COLORS_ENUM } from '../constants/color-constants';

import Ionicons from '@expo/vector-icons/Ionicons';
import MainScreen from '../screens/MainScreen';
import AgendaScreen from '../screens/AgendaScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const { theme } = useSelector(state => state.themeReducer);

  const headerStyle = theme === 'light' ? lightStyles.header : darkStyles.header;
  const tabBarStyle = theme === 'light' ? lightStyles.tabBar : darkStyles.tabBar;
  const headerTitleStyle = theme === 'light' ? lightStyles.title : darkStyles.title;

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home' screenOptions={{
        headerStyle,
        headerTitleStyle,
        tabBarStyle,
        headerTitleAlign: 'center',
        tabBarShowLabel: false,
      }}>
        <Tab.Screen name='Schedules' component={AgendaScreen} options={{ 
          tabBarIcon: ({focused}) => (
            <Ionicons 
            name={focused ? 'calendar' : 'calendar-outline'} 
            size={42} color={theme === 'light' ? COLORS_ENUM.BLACK : COLORS_ENUM.GRAY}/>
          ) 
        }}></Tab.Screen>
        <Tab.Screen name='Home' component={MainScreen} options={{ 
          tabBarIcon: ({focused}) => (
          <Ionicons 
            name={focused ? 'home' : 'home-outline'} 
            size={42} 
            color={theme === 'light' ? COLORS_ENUM.BLACK : COLORS_ENUM.GRAY}/>
          ) 
        }}></Tab.Screen>
        <Tab.Screen name='Settings' component={SettingsScreen} options={{ 
          tabBarIcon: ({focused}) => (
          <Ionicons 
            name={focused ? 'settings' : 'settings-outline'} 
            size={42} 
            color={theme === 'light' ? COLORS_ENUM.BLACK : COLORS_ENUM.GRAY}/>
          ) 
        }}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}