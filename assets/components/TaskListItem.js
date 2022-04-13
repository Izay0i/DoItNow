import React from 'react';

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TaskListItem({ item }) {
  const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.body} onPress={() => navigation.navigate('TaskEditor')}>
        <Text style={{fontFamily: 'poppins-regular', fontSize: 20,}}>{item.title}</Text>
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
    //backgroundColor: 'red',
  },
  item: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});