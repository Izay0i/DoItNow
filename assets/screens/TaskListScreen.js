import React from 'react';

import { View, StyleSheet, FlatList } from 'react-native';

import TaskListItem from '../components/TaskListItem';

export default function TaskListScreen({ taskList }) {
  return (
    <View style={styles.container}>
      <FlatList 
      data={taskList} 
      renderItem={({item}) => <TaskListItem item={item}></TaskListItem> } 
      keyExtractor={item => item.id} 
      extraData={taskList}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 18,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  }
});