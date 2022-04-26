import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';

import Ionicons from '@expo/vector-icons/Ionicons';
import TaskListItem from '../components/TaskListItem';

const CircleButton = ({ onPress, iconName, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.circleButton}}>
      <Ionicons name={iconName} size={24} color='#ffffff'></Ionicons>
    </TouchableOpacity>
  );
};

const TransparentTextButton = ({ onPress, text, textColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.transparentButton}>
      <Text style={{color: textColor, ...styles.text}}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function TaskListScreen({ navigation }) {
  const [item, setItem] = useState([]);

  const { tasks } = useSelector(state => state.tasksReducer);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef.current?.present();

    setItem(item);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getWeekday = () => {
    switch (item.trigger?.weekday) {
      case 1:
        return 'Sunday ';
      case 2:
        return 'Monday ';
      case 3:
        return 'Tuesday ';
      case 4:
        return 'Wednesday ';
      case 5:
        return 'Thursday ';
      case 6:
        return 'Friday ';
      case 7:
        return 'Saturday ';
      default:
        return '';
    }
  };

  const createTriggerDescription = () => {
    let descriptionStr = '';

    switch (item.mode) {
      case 'time':
        descriptionStr += item.trigger?.dateStr;
        break;
      case 'yearly':
        descriptionStr += item.trigger?.day + '/' + item.trigger?.month + ' ';
      case 'weekly':
        descriptionStr += getWeekday();
      case 'daily':
        descriptionStr += item.trigger?.hour + ':' + item.trigger?.minute;
        descriptionStr = 'every ' + descriptionStr;
    }

    return descriptionStr;
  };

  const markTaskAsDone = async () => {
    unsubscribeLocalNotificationAsync(item.id);
  };

  const deleteTaskAsync = async () => {
    unsubscribeLocalNotificationAsync(item.id);
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
          <View>
            <Text style={styles.text}>Title: {item.content?.title}</Text>
            <Text style={styles.text}>Description: {item.content?.body}</Text>
            <Text style={styles.text}>Triggers on {createTriggerDescription()}</Text>
          </View>

          <TransparentTextButton text='Mark As Done' textColor='#007aff' onPress={markTaskAsDone}></TransparentTextButton>
          <TransparentTextButton text='Edit Task' textColor='#007aff' onPress={() => { 
            navigation.navigate('TaskEditor', {item}); 
            bottomSheetModalRef.current?.close();   
          }}></TransparentTextButton>
          <TransparentTextButton text='Delete Task' textColor='#ff0000'></TransparentTextButton>
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
  circleButton: {
    borderRadius: 16,
    margin: 18,
    padding: 16,
    alignSelf: 'flex-end',
    elevation: 8,
  },
  transparentButton: {
    flex: 1,
    justifyContent: 'center',
  }
});