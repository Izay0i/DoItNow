import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

import TaskListItem from '../components/TaskListItem';

export default function TaskListScreen({ navigation, taskList }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <FlatList 
      data={taskList} 
      renderItem={({item}) => <TaskListItem navigation={navigation} item={item}></TaskListItem> } 
      keyExtractor={item => item.id} 
      extraData={taskList}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 18,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  }
});