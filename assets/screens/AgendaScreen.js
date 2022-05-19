import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { getTasksByDate } from '../functions/helper-functions';
import { generateDescription } from '../functions/helper-functions';

import TaskListItem from '../components/TaskListItem';

export default function AgendaScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [item, setItem] = useState([]);

  const { tasks } = useSelector(state => state.tasksReducer);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef.current?.present();
    setItem(item);
  }, []);

  const backdropComponent = useCallback((backdropProps) => (
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1}></BottomSheetBackdrop>
  ), []);

  const getTasks = useCallback((day) => {
    setSchedules(getTasksByDate(tasks, day));
  }, [schedules]);

  const renderItem = useCallback(({ item }) => (
    <TaskListItem item={item} iconsVisible={false} onPress={() => handlePresentModalPress(item)}></TaskListItem>
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <>
      <View style={styles.body}>
        <Calendar 
        enableSwipeMonths={true} 
        onDayPress={getTasks}
        ></Calendar>

        <View style={styles.body}>
          <FlatList 
          data={schedules} 
          extraData={schedules} 
          renderItem={renderItem} 
          keyExtractor={keyExtractor}
          ></FlatList>

          {schedules.length === 0 && 
          <View style={styles.body}>
            <Text style={{...styles.text, color: '#999999'}}>No schedules for today</Text>
          </View>}
        </View>
      </View>

      <BottomSheetModal 
      ref={bottomSheetModalRef} 
      snapPoints={snapPoints} 
      backdropComponent={backdropComponent}
      >
       <View style={{flex: 1, padding: 16,}}>
         <Text style={{...styles.text, fontSize: 20, textAlign: 'left',}}>{generateDescription(item)}</Text>
       </View> 
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  text: {
    fontFamily: 'poppins-regular',
    fontSize: 24,
    textAlign: 'center',
  },
});