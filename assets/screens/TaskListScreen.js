import React from 'react';

import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

const CircleButton = ({ onPress, iconName, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.circleButton}}>
      <Ionicons name={iconName} size={24} color='white'></Ionicons>
    </TouchableOpacity>
  );
};

import TaskListItem from '../components/TaskListItem';

export default function TaskListScreen({ taskList }) {
  const navigation = useNavigation();

  return (
    <View style={styles.body}>
      <View style={styles.body}>
        <FlatList 
        data={taskList} 
        renderItem={({item}) => <TaskListItem item={item}></TaskListItem> } 
        keyExtractor={item => item.id} 
        extraData={taskList}
        ></FlatList>
      </View>

      <View style={styles.buttonsContainer}>
        <CircleButton iconName='add-outline' backgroundColor='#44a6c6' onPress={() => navigation.navigate('TaskEditor')}></CircleButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 3,
  },
  buttonsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 18,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: 'black',
  },
  circleButton: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'flex-end',
  }
});