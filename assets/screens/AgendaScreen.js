import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { getTasksByDate } from '../functions/helper-functions';
import { generateDescription } from '../functions/helper-functions';
import { mainStyles, lightStyles, darkStyles } from '../themes/AgendaScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';

import TaskListItem from '../components/TaskListItem';

export default function AgendaScreen({ navigation }) {  
  useEffect(() => {
    const today = new Date();
    const todayStr = `${today.getUTCFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${today.getDate()}`;
    setToday(todayStr);
  }, []);
  
  const [today, setToday] = useState('');
  const [selected, setSelected] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [item, setItem] = useState([]);

  const { tasks } = useSelector(state => state.tasksReducer);
  const { theme } = useSelector(state => state.themeReducer);

  const markedDate = useMemo(() => {
    return {
      [selected]: {
        selected: true,
      }
    };
  }, [selected]);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['60%'], []);

  const handlePresentModalPress = useCallback((item) => () => {
    bottomSheetModalRef.current?.present();
    setItem(item);
  }, []);

  const backdropComponent = useCallback((backdropProps) => (
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1}></BottomSheetBackdrop>
  ), []);

  const getTasks = useCallback((day) => {
    setSelected(day.dateString);
    setSchedules(getTasksByDate(tasks, day));
  }, [schedules]);

  const keyExtractor = useCallback((item) => item.content.data.id, []);

  const renderItem = ({ item }) => (
    <TaskListItem item={item} iconsVisible={false} onPress={handlePresentModalPress(item)}></TaskListItem>
  );

  return (
    <>
      <View style={theme === 'light' ? lightStyles.body : darkStyles.body}>
        <Calendar 
        key={theme === 'light'} 
        markedDates={{[today]: {marked: true, dotColor: COLORS_ENUM.ORANGE,}, ...markedDate}} 
        enableSwipeMonths={true} 
        onDayPress={getTasks} 
        theme={theme === 'light' ? lightStyles.calendar : darkStyles.calendar}
        ></Calendar>

        <View style={theme === 'light' ? lightStyles.body : darkStyles.body}>
          <FlatList 
          data={schedules} 
          extraData={schedules} 
          renderItem={renderItem} 
          keyExtractor={keyExtractor}
          ></FlatList>

          {schedules.length === 0 &&  
          <View style={theme === 'light' ? lightStyles.body : darkStyles.body}>
            <Text style={darkStyles.text}>{selected === '' ? 'Select a date' : 'No schedules for this date'}</Text>
          </View>}
        </View>
      </View>

      <BottomSheetModal 
      ref={bottomSheetModalRef} 
      snapPoints={snapPoints} 
      backdropComponent={backdropComponent}
      >
       <View style={theme === 'light' ? lightStyles.modalBody : darkStyles.modalBody}>
         <Text style={theme === 'light' ? lightStyles.descriptionText : darkStyles.descriptionText}>{generateDescription(item)}</Text>
       </View> 
      </BottomSheetModal>
    </>
  );
}