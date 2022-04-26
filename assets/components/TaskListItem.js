import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TaskListItem({ item, onPress }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.body}>
        <Text style={styles.text}>{item.content.title}</Text>
        <Ionicons name='repeat' size={24} color={item.trigger.repeats ? '#000000' : '#ffffff'}></Ionicons>
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
    elevation: 8,
    backgroundColor: '#ffffff',
  },
  text: {
    fontFamily: 'poppins-regular',
    fontSize: 20,
    marginRight: 8,
  }
});