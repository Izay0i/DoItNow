import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { mainStyles, lightStyles, darkStyles } from '../themes/TaskListItem.themes';
import { COLORS_ENUM } from '../constants/color-constants';

import Ionicons from '@expo/vector-icons/Ionicons';

export const ITEM_HEIGHT = 24;

const TaskListItem = ({ item, onPress, iconsVisible = true }) => {
  const { theme } = useSelector(state => state.themeReducer);

  const { childId, taskDone } = item.content.data;
  
  return (
    <View style={theme === 'light' ? lightStyles.itemBody : darkStyles.itemBody}>
      <TouchableOpacity onLongPress={onPress} style={mainStyles.body}>
        <Text numberOfLines={1} style={theme === 'light' ? lightStyles.text : darkStyles.text}>{item.content.title}</Text>
        
        {iconsVisible && 
        <View style={mainStyles.iconsBody}>
          <Ionicons 
          name={taskDone ? 'checkmark-done-sharp' : 'checkmark-sharp'} 
          size={24} 
          color={taskDone ? 
          (theme === 'light' ? COLORS_ENUM.VIBRANT_GREEN : COLORS_ENUM.GREEN) : 
          (theme === 'light' ? COLORS_ENUM.BLACK : COLORS_ENUM.WHITE)}
          ></Ionicons>
          
          {childId !== '' && 
          <Ionicons name='alert-circle' size={24} color={COLORS_ENUM.ORANGE}></Ionicons>}
        </View>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress} style={{justifyContent: 'center',}}>
        <Ionicons 
        name='ellipsis-vertical-outline' 
        size={24} 
        color={theme === 'light' ? COLORS_ENUM.BLACK : COLORS_ENUM.GRAY}
        ></Ionicons>
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