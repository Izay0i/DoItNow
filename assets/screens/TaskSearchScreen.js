import React, { useState, useCallback, useRef, useMemo } from "react";
import { View, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, markTaskAsDone } from '../redux/actions';
import { unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';
import { generateDescription, getTaskByTitle } from "../functions/helper-functions";
import TaskListItem, { ITEM_HEIGHT } from "../components/TaskListItem";

import TransparentTextButton from "../components/TransparentTextButton";

export default function TaskSearchScreen({ navigation }) {
  const [name, setName] = useState('');
  const [maxCharacters, setMaxCharacters] = useState(64);

  const [displayText, setDisplayText] = useState('Start searching');

  const [tasksSearched, setTasksSearched] = useState([]);

  const [item, setItem] = useState({});

  const { tasks } = useSelector(state => state.tasksReducer);

  const dispatch = useDispatch();

  const renderItem = useCallback(({ item }) => (
    <TaskListItem item={item} onPress={() => handlePresentModalPress(item)}></TaskListItem>
  ), []);

  const keyExtractor = useCallback((item) => item.content.data.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef.current?.present();
    setItem(item);
  }, []);

  const backdropComponent = useCallback((backdropProps) => (
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1}></BottomSheetBackdrop>
  ), []);

  const getByTitle = (e) => {
    const { text } = e.nativeEvent;
    if (text.length === 0) {
      setDisplayText('Start searching');
      setTasksSearched([]);
    }
    else {
      setTasksSearched(getTaskByTitle(tasks, text));
      if (tasksSearched.length === 0) {
        setDisplayText('Results not found');
      }
    }
  };

  const editTask = () => {
    navigation.navigate('TaskEditor', {item});
    bottomSheetModalRef.current?.dismiss();
  };

  const markTaskAsDoneAsync = async () => {
    await unsubscribeLocalNotificationAsync(item.content?.data?.childId);
    await unsubscribeLocalNotificationAsync(item.content?.data?.id);
    dispatch(markTaskAsDone(item));
    setTasksSearched([]);
    bottomSheetModalRef.current?.dismiss();
  };

  const deleteTaskAsync = async () => {
    await unsubscribeLocalNotificationAsync(item.content?.data?.childId);
    await unsubscribeLocalNotificationAsync(item.content?.data?.id);
    dispatch(deleteTask(item));
    setTasksSearched([]);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.body}>
          <TextInput 
          onChangeText={setName} 
          value={name} 
          placeholder='Title' 
          style={styles.textInputStyle} 
          maxLength={maxCharacters} 
          onChange={(e) => getByTitle(e)} 
          onSubmitEditing={(e) => getByTitle(e)}
          ></TextInput>

          <View style={styles.body}>
            <FlatList 
            data={tasksSearched} 
            extraData={tasksSearched} 
            renderItem={renderItem} 
            keyExtractor={keyExtractor} 
            getItemLayout={getItemLayout}
            ></FlatList>

            {tasksSearched.length === 0 && 
            <View style={{flex: 1,}}>
              <Text style={{...styles.textStyle, color: '#999999'}}>{displayText}</Text>
            </View>}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <BottomSheetModal 
      ref={bottomSheetModalRef} 
      snapPoints={snapPoints} 
      backdropComponent={backdropComponent}>
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
    flex: 1,
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  textInputStyle: {
    fontFamily: 'regular-font',
    padding: 16,
    marginBottom: 4,
    backgroundColor: '#ffffff',
  },
  textStyle: {
    fontFamily: 'regular-font',
    fontSize: 24,
    textAlign: 'center',
  },
  taskDesText: {
    fontSize: 20,
    fontFamily: 'regular-font',
  },
});