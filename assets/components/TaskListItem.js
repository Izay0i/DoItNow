import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TaskListItem({ item, onPress }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.body}>
          <Ionicons 
          name={item.taskDone ? 'checkmark-done-sharp' : 'checkmark-sharp'} 
          size={24} 
          color={item.taskDone ? '#32b233' : '#000000'}
          ></Ionicons>
        <Text style={styles.text}>{item.content.title}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress}>
        <Ionicons name='ellipsis-vertical-outline' size={24} color='#000000'></Ionicons>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonsContainer: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxContainer: {
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  text: {
    fontFamily: 'poppins-regular',
    fontSize: 20,
    marginRight: 8,
  }
});