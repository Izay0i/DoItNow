import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, markTaskAsDone } from '../redux/actions';
import { unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';
import { generateDescription } from '../functions/helper-functions';
import { mainStyles, lightStyles, darkStyles } from '../themes/TaskListScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';
import TaskListItem, { ITEM_HEIGHT } from '../components/TaskListItem';

import i18n from 'i18n-js';
import TransparentTextButton from '../components/TransparentTextButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const CircleButton = ({ onPress, iconName, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor, ...styles.circleButton}}>
      <Ionicons name={iconName} size={24} color={COLORS_ENUM.WHITE}></Ionicons>
    </TouchableOpacity>
  );
};

export default function TaskListScreen({ navigation }) {
  const [item, setItem] = useState({});

  const { tasks } = useSelector(state => state.tasksReducer);
  const { theme } = useSelector(state => state.themeReducer);
  const { secret } = useSelector(state => state.secretReducer);

  const dispatch = useDispatch();

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const handlePresentModalPress = useCallback((item) => () => {
    bottomSheetModalRef.current?.present();
    setItem(item);
  }, []);

  const keyExtractor = useCallback((item) => item.content?.data?.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const backdropComponent = useCallback((backdropProps) => (
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1}></BottomSheetBackdrop>
  ), []);

  const renderItem = ({ item }) => (
    <TaskListItem item={item} onPress={handlePresentModalPress(item)}></TaskListItem>
  );

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
      <View style={theme === 'light' ? lightStyles.body : darkStyles.body}>
        <View style={mainStyles.listBody}>
          <FlatList 
          data={tasks} 
          renderItem={renderItem} 
          keyExtractor={keyExtractor} 
          extraData={tasks} 
          getItemLayout={getItemLayout}
          ></FlatList>

          {tasks.length === 0 && 
          <View style={{flex: 1,}}>
            <Text style={mainStyles.text}>{i18n.t('homeStartMessage')}</Text>
            
            {secret && 
            <Image source={require('../images/jill.png')} resizeMode='contain' style={mainStyles.backgroundImageBody}></Image>}
          </View>}
        </View>

        <View style={theme === 'light' ? lightStyles.buttonsBody : darkStyles.buttonsBody}>
          <CircleButton 
          iconName='search-outline' 
          backgroundColor={theme === 'light' ? COLORS_ENUM.BLUE : COLORS_ENUM.DARK_BLUE} 
          onPress={() => navigation.navigate('TaskSearch')}
          ></CircleButton>

          <CircleButton 
          iconName='add-outline' 
          backgroundColor={theme === 'light' ? COLORS_ENUM.ORANGE : COLORS_ENUM.DARK_ORANGE} 
          onPress={() => navigation.navigate('TaskEditor')}
          ></CircleButton>
        </View>
      </View>

      <BottomSheetModal 
      ref={bottomSheetModalRef} 
      snapPoints={snapPoints} 
      backdropComponent={backdropComponent}
      >
        <View style={theme === 'light' ? lightStyles.modalBody : darkStyles.modalBody}>
          <View style={theme === 'light' ? lightStyles.descriptionBody : darkStyles.descriptionBody}>
            <Text style={theme === 'light' ? lightStyles.taskDesText : darkStyles.taskDesText}>{generateDescription(item)}</Text>
          </View>

          <View style={{flex: 1,}}>
            <TransparentTextButton 
            text={i18n.t('bottomSheetMarkTask')} 
            textColor={item.content?.data?.taskDone ? COLORS_ENUM.GRAY : COLORS_ENUM.DARK_BLUE} 
            onPress={markTaskAsDoneAsync} 
            disabled={item.content?.data?.taskDone}
            ></TransparentTextButton>

            <TransparentTextButton 
            text={i18n.t('bottomSheetEditTask')} 
            textColor={item.content?.data?.taskDone ? COLORS_ENUM.GRAY : COLORS_ENUM.DARK_BLUE} 
            onPress={editTask} 
            disabled={item.content?.data?.taskDone}
            ></TransparentTextButton>
            
            <TransparentTextButton 
            text={i18n.t('bottomSheetDeleteTask')} 
            textColor={theme === 'light' ? COLORS_ENUM.RED : COLORS_ENUM.DARK_RED} 
            onPress={deleteTaskAsync}
            ></TransparentTextButton>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  circleButton: {
    flex: 1,
    borderRadius: 10,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});