import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, TextInput } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, markTaskAsDone } from '../redux/actions';
import { unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';
import { generateDescription } from '../functions/helper-functions';
import TaskListItem, { ITEM_HEIGHT } from '../components/TaskListItem';

import TransparentTextButton from '../components/TransparentTextButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const CircleButton = ({ onPress, iconName, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.circleButton}}>
      <Ionicons name={iconName} size={24} color='#ffffff'></Ionicons>
    </TouchableOpacity>
  );
};

export default function TaskListScreen({ navigation }) {
  const [item, setItem] = useState({});

  const { tasks } = useSelector(state => state.tasksReducer);

  const dispatch = useDispatch();

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef.current?.present();
    setItem(item);

    //console.log(item);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <TaskListItem item={item} onPress={() => handlePresentModalPress(item)}></TaskListItem>
  ), []);

  const keyExtractor = useCallback((item) => item.content.data.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const backdropComponent = useCallback((backdropProps) => (
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1}></BottomSheetBackdrop>
  ), []);

  const editTask = () => {
    navigation.navigate('TaskEditor', {item});
    bottomSheetModalRef.current?.dismiss();
  };

  const markTaskAsDoneAsync = async () => {
    await unsubscribeLocalNotificationAsync(item.content?.data?.childId);
    await unsubscribeLocalNotificationAsync(item.content?.data?.id);
    dispatch(markTaskAsDone(item));
    bottomSheetModalRef.current?.dismiss();
  };

  const deleteTaskAsync = async () => {
    await unsubscribeLocalNotificationAsync(item.content?.data?.childId);
    await unsubscribeLocalNotificationAsync(item.content?.data?.id);
    dispatch(deleteTask(item));
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <>
      <View style={styles.body}>
        <View style={styles.body}>
          <FlatList 
          data={tasks} 
          renderItem={renderItem} 
          keyExtractor={keyExtractor} 
          extraData={tasks} 
          getItemLayout={getItemLayout}
          ></FlatList>

          {tasks.length === 0 && 
          <View style={{flex: 1,}}>
            <Text style={{...styles.text, color: '#999999',}}>Get started by pressing the button below</Text>
          </View>}
        </View>

        <View style={styles.buttonsContainer}>
          <CircleButton 
          iconName='search-outline' 
          backgroundColor='#4285f4' 
          onPress={() => navigation.navigate('TaskSearch')}
          ></CircleButton>

          <CircleButton 
          iconName='add-outline' 
          backgroundColor='#ffa500' 
          onPress={() => navigation.navigate('TaskEditor')}
          ></CircleButton>
        </View>
      </View>

      <BottomSheetModal 
      ref={bottomSheetModalRef} 
      snapPoints={snapPoints} 
      backdropComponent={backdropComponent}
      >
        <View style={styles.modalViewContainer}>
          <View style={{flex: 2, padding: 16,}}>
            <Text style={styles.taskDesText}>{generateDescription(item)}</Text>
          </View>

          <View style={{flex: 1,}}>
            <TransparentTextButton 
            text='Mark As Done' 
            textColor={item.content?.data?.taskDone ? '#999999' : '#007aff'} 
            onPress={markTaskAsDoneAsync} 
            disabled={item.content?.data?.taskDone}
            ></TransparentTextButton>

            <TransparentTextButton 
            text='Edit Task' 
            textColor={item.content?.data?.taskDone ? '#999999' : '#007aff'} 
            onPress={editTask} 
            disabled={item.content?.data?.taskDone}
            ></TransparentTextButton>
            
            <TransparentTextButton text='Delete Task' textColor='#ff0000' onPress={deleteTaskAsync}></TransparentTextButton>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 4,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 18,
    fontWeight: 'bold',
    fontFamily: 'regular-font',
    color: '#000000',
  },
  text: {
    fontSize: 24,
    fontFamily: 'regular-font',
    textAlign: 'center',
  },
  taskDesText: {
    fontSize: 20,
    fontFamily: 'regular-font',
  },
  circleButton: {
    flex: 1,
    borderRadius: 10,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  }
});