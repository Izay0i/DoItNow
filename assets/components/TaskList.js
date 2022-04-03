import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function TaskList({taskList}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <FlatList 
      data={taskList} 
      renderItem={({item}) => (
        <Text style={styles.task}>{item.title}</Text>
      )} 
      keyExtractor={item => item.id} 
      extraData={taskList}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 18,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  },
  task: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'black',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    color: 'black',
  }
});