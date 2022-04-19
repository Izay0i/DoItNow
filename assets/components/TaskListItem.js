import React from 'react';

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TaskListItem({ item }) {
  const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.body} onPress={() => navigation.navigate('TaskEditor', {item})}>
        <Text style={styles.text}>{item.content.title}</Text>
        <Ionicons name='repeat' size={24} color={item.trigger.repeats ? '#000000' : '#ffffff'}></Ionicons>
      </TouchableOpacity>

      <TouchableOpacity onPress={item?.function}>
        <Ionicons name='notifications' size={24} color='#ffc300'></Ionicons>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'gray',
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