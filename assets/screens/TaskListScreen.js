import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, markTaskAsDone } from '../redux/actions';
import { unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';
import { generateTriggerDescription } from '../functions/helper-functions';

import Ionicons from '@expo/vector-icons/Ionicons';
import TaskListItem from '../components/TaskListItem';

const CircleButton = ({ onPress, iconName, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.circleButton}}>
      <Ionicons name={iconName} size={24} color='#ffffff'></Ionicons>
    </TouchableOpacity>
  );
};

const TransparentTextButton = ({ onPress, text, textColor, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.transparentButton} disabled={disabled}>
      <Text style={{color: textColor, ...styles.text}}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function TaskListScreen({ navigation }) {
  const [item, setItem] = useState([]);

  const { tasks } = useSelector(state => state.tasksReducer);

  const dispatch = useDispatch();

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['70%'], []);

  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef.current?.present();
    setItem(item);

    console.log(item);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    //console.log('handleSheetChanges', index);
  }, []);

  const editTask = () => {
    navigation.navigate('TaskEditor', {item});
    bottomSheetModalRef.current?.dismiss();
  };

  const markTaskAsDoneAsync = async () => {
    await unsubscribeLocalNotificationAsync(item.id);
    dispatch(markTaskAsDone(item));
    bottomSheetModalRef.current?.dismiss();
  };

  const deleteTaskAsync = async () => {
    await unsubscribeLocalNotificationAsync(item.id);
    dispatch(deleteTask(item));
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <>
      <View style={styles.body}>
        <View style={styles.body}>
          <FlatList 
          data={tasks} 
          renderItem={({item}) => <TaskListItem 
            item={item} 
            onPress={() => handlePresentModalPress(item)}></TaskListItem>
          } 
          keyExtractor={item => item.id} 
          extraData={tasks}
          ></FlatList>
        </View>

        <View style={styles.buttonsContainer}>
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
      onChange={handleSheetChanges} 
      style={styles.modalContainer} 
      backdropComponent={
        (backdropProps) => (
          <BottomSheetBackdrop 
          {...backdropProps} 
          appearsOnIndex={0} 
          disappearsOnIndex={-1}
          ></BottomSheetBackdrop>)
        }
      >
        <View style={styles.modalViewContainer}>
          <View style={{flex: 1, padding: 16,}}>
            <Text style={styles.taskDesText}>Title: {item.content?.title}</Text>
            <Text style={styles.taskDesText}>Description: {item.content?.body}</Text>
            <Text style={styles.taskDesText}>Triggers on {generateTriggerDescription(item.mode, item.trigger)}</Text>
          </View>

          <View style={{flex: 1,}}>
            <TransparentTextButton 
            text='Mark As Done' 
            textColor={item.taskDone ? '#999999' : '#007aff'} 
            onPress={markTaskAsDoneAsync} 
            disabled={item.taskDone}
            ></TransparentTextButton>

            <TransparentTextButton 
            text='Edit Task' 
            textColor={item.taskDone ? '#999999' : '#007aff'} 
            onPress={editTask} 
            disabled={item.taskDone}
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
  },
  modalContainer: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    elevation: 16,
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 18,
    fontWeight: 'bold',
    fontFamily: 'poppins-regular',
    color: '#000000',
  },
  text: {
    fontSize: 24,
    fontFamily: 'poppins-regular',
    textAlign: 'center',
  },
  taskDesText: {
    fontSize: 24,
    fontFamily: 'poppins-regular',
  },
  circleButton: {
    flex: 1,
    borderRadius: 10,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparentButton: {
    flex: 1,
    justifyContent: 'center',
  }
});