import React, { useState } from 'react';
import { View, StatusBar, FlatList } from 'react-native';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import styled from 'styled-components';
import AddInput from './assets/components/AddInput';
import Empty from './assets/components/Empty';
import Header from './assets/components/Header';
import TodoList from './assets/components/TodoList';

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-bold': require('./assets/fonts/poppins-bold.ttf'),
    'poppins-regular': require('./assets/fonts/poppins-regular.ttf'),
  });

  const [data, setData] = useState([]);
  
  const submitHandler = (value) => {
    setData((prevTodo) => {
      return [
        {
          value: value,
          key: Math.random().toString(),
        },
        ...prevTodo,
      ];
    });
  };

  const deleteItem = (key) => {
    setData((prevTodo) => {
      return prevTodo.filter((todo) => todo.key != key);
    });
  };

  if (fontsLoaded) {
    return (
      <ComponentContainer>
        <View>
          <StatusBar barStyle='light-content' backgroundColor='midnightblue'></StatusBar>
        </View>
  
        <View>
          <FlatList 
            data={data} 
            ListHeaderComponent={() => <Header></Header>} 
            ListEmptyComponent={() => <Empty></Empty>}
            keyExtractor={(item) => item.key} 
            renderItem={({ item }) => (<TodoList item={item} 
            deleteItem={deleteItem}></TodoList>)}>
          </FlatList>
          <View>
            <AddInput submitHandler={submitHandler}></AddInput>
          </View>
        </View>
      </ComponentContainer>
    );
  }
  else {
    return (
      <AppLoading></AppLoading>
    );
  }
}

const ComponentContainer = styled.View`
  background-color: midnightblue;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;