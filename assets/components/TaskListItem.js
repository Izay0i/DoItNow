import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

export const ITEM_HEIGHT = 24;

const TaskListItem = ({ item, onPress, iconsVisible = true }) => {
  const { childId, taskDone } = item.content.data;
  
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.body}>
        <Text numberOfLines={1} style={styles.text}>{item.content.title}</Text>
        
        {iconsVisible && 
        <View style={styles.iconsBody}>
          <Ionicons 
          name={taskDone ? 'checkmark-done-sharp' : 'checkmark-sharp'} 
          size={24} 
          color={taskDone ? '#32b233' : '#000000'}
          ></Ionicons>
          {childId !== '' && <Ionicons name='alert-circle' size={24} color='#ffa500'></Ionicons>}
          {/* <Ionicons name='warning-sharp' size={24} color='#ff0000'></Ionicons> */}
        </View>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress} style={{justifyContent: 'center',}}>
        <Ionicons name='ellipsis-vertical-outline' size={24} color='#000000'></Ionicons>
      </TouchableOpacity>
    </View>
  );
}

export default memo(TaskListItem);

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  iconsBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'regular-font',
    fontSize: 20,
    marginRight: 8,
  }
});