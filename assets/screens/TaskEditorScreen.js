import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Keyboard, Text, TextInput, Modal, Button, Switch, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useDispatch } from 'react-redux';
import { addTask, deleteTask } from '../redux/actions';
import { subscribeLocalNotificationAsync, unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';
import { MODES_ENUM, EXPO_WEEKDAYS_ENUM, MIN_DATE, CHANNEL_ID } from '../constants/app-constants';

import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const DismissKeyboard = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const IconTextButton = ({ onPress, title, iconName, color = '#ffffff', disabled = false }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor: disabled ? '#999999' : color, ...styles.iconTextButton}} disabled={disabled}>
      <Ionicons name={iconName} size={24} color='#000000'></Ionicons>
      <Text style={styles.iconTextButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TaskEditorScreen({ route, navigation }) {
  useEffect(() => {
    if (routeData) {
      const { title, body } = routeData.content;
      const { childId, mode, notificationDate, location } = routeData.content.data;

      setTitle(title);
      setDescription(body);

      setIsUrgent(childId !== '');

      setValue(mode);

      const { weekday } = routeData.trigger;
      setDayValue(weekday ? weekday : days[0].value);

      setDate(new Date(notificationDate));

      setLocationName(location !== '' ? location : locationName);
    }

    if (route.params?.locationName) {
      setLocationName(route.params?.locationName);
    }
  }, [routeData, route.params?.locationName]);

  const [routeData, setRouteData] = useState(route.params?.item);

  const [validatorModalVisible, setValidatorModalVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [minCharacters, setMinCharacters] = useState(10);
  const [maxCharacters, setMaxCharacters] = useState(64);

  const [isUrgent, setIsUrgent] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(MODES_ENUM.DATE_TIME);
  const [items, setItems] = useState([
    { label: 'Date & time', value: MODES_ENUM.DATE_TIME, },
    { label: 'Daily', value: MODES_ENUM.DAILY, },
    { label: 'Weekly', value: MODES_ENUM.WEEKLY, },
    { label: 'Yearly', value: MODES_ENUM.YEARLY, },
  ]);

  const [openDays, setOpenDays] = useState(false);
  const [dayValue, setDayValue] = useState(EXPO_WEEKDAYS_ENUM.SUNDAY);
  const [days, setDays] = useState([
    { label: 'Sunday', value: EXPO_WEEKDAYS_ENUM.SUNDAY, },
    { label: 'Monday', value: EXPO_WEEKDAYS_ENUM.MONDAY, },
    { label: 'Tuesday', value: EXPO_WEEKDAYS_ENUM.TUESDAY, },
    { label: 'Wednesday', value: EXPO_WEEKDAYS_ENUM.WEDNESDAY, },
    { label: 'Thursday', value: EXPO_WEEKDAYS_ENUM.THURSDAY, },
    { label: 'Friday', value: EXPO_WEEKDAYS_ENUM.FRIDAY, },
    { label: 'Saturday', value: EXPO_WEEKDAYS_ENUM.SATURDAY, },
  ]);

  const [mode, setMode] = useState(MODES_ENUM.DATE_TIME);

  const [day, setDay] = useState(EXPO_WEEKDAYS_ENUM.SUNDAY);

  const [minimumDate, setMinimumDate] = useState(() => {
    const NUMBER_OF_DAYS = 3;
    return new Date().setDate(new Date().getDate() + NUMBER_OF_DAYS);
  });
  const [date, setDate] = useState(new Date());
  const [timeMode, setTimeMode] = useState('date');
  const [show, setShow] = useState(false);

  const [locationName, setLocationName] = useState('Pick a location');

  const toggleSwitch = () => setIsUrgent(previousState => !previousState);

  const onModeOpen = useCallback(() => {
    setOpenDays(false);
  });

  const onDayOpen = useCallback(() => {
    setOpen(false);
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    selectedDate && setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setTimeMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const showTimePicker = () => {
    showMode('time');
  };

  const dispatch = useDispatch();

  const generateWarningText = () => {
    if (title.length < minCharacters) {
      return `Title length must be in the range of (${minCharacters} - ${maxCharacters})`;
    }

    if (description.length < minCharacters) {
      return `Description length must be in the range of (${minCharacters} - ${maxCharacters})`;
    }

    const timeSet = date.setSeconds(0);
    const timeFiveMinLater = Date.now() + 300 * 1000;

    if (isUrgent && timeSet - timeFiveMinLater <= 0) {
      return 'Notification should be set at least 3 days in advance';
    }

    return '';
  };

  const createTrigger = () => {
    let trigger = { 
      channelId: CHANNEL_ID,
      repeats: mode !== MODES_ENUM.DATE_TIME, 
    };

    const dateAttrib = date.setSeconds(0);
    const dayAttrib = date.getDate();
    const monthAttrib = date.getMonth();
    const weekdayAttrib = day;
    const hourAttrib = date.getHours();
    const minuteAttrib = date.getMinutes();

    switch (mode) {
      case MODES_ENUM.DATE_TIME:
        trigger = { date: dateAttrib, dateStr: date.toLocaleString(), ...trigger };
        break;
      case MODES_ENUM.WEEKLY:
        trigger = { weekday: weekdayAttrib, ...trigger };
      case MODES_ENUM.DAILY:
        trigger = { hour: hourAttrib, minute: minuteAttrib, ...trigger };
        break;
      case MODES_ENUM.YEARLY:
        trigger = { 
          day: dayAttrib, 
          month: monthAttrib, 
          hour: hourAttrib, 
          minute: minuteAttrib, 
          ...trigger 
        };
        break;
    }

    return trigger;
  };

  const createFrequentReminder = async (trig) => {
    if (!isUrgent || mode !== MODES_ENUM.DATE_TIME) {
      return '';
    }

    const content = {
      title: `[ALERT] Upcoming task: ${title}`,
      body: `On ${trig.dateStr}`,
    };

    //1/3 of the duration of the parent notification
    const scheduledDateInMS = date.getTime();
    const todayInMS = Date.now();
    const difference = scheduledDateInMS - todayInMS;
    const diffInSeconds = Math.floor(difference / 1000);
    const interval = diffInSeconds / 3; 

    // console.log('[SCHEDULED TIMESTAMP]', scheduledDateInMS);
    // console.log('[TODAY TIMESTAMP]', todayInMS);
    // console.log('[DIFF]', difference);
    // console.log('[DIFF IN SEC]', diffInSeconds);
    // console.log('[IN 1/3 SEC]', interval);

    const trigger = {
      channelId: CHANNEL_ID,
      seconds: interval,
      repeats: true,
    };

    const id = await subscribeLocalNotificationAsync(content, trigger);
    return id;
  };

  const modifyTaskAsync = async () => {
    const warningText = generateWarningText();
    if (warningText !== '') {
      setValidatorModalVisible(!validatorModalVisible);
      return;
    }

    const trigger = createTrigger();

    const notificationBody = {
      title,
      body: description,
    };

    const content = {
      title,
      body: description,
      data: {
        id: await subscribeLocalNotificationAsync(notificationBody, trigger),
        childId: await createFrequentReminder(trigger),
        mode,
        location: locationName !== 'Pick a location' ? locationName: '',
        taskDone: false,
        notificationDate: date.valueOf(),
        createdAt: Date.now(),
      },
    };

    const task = {
      content,
      trigger,
    };

    if (routeData) {
      const { id, childId } = routeData.content.data;

      await unsubscribeLocalNotificationAsync(childId);
      await unsubscribeLocalNotificationAsync(id);
      dispatch(deleteTask(routeData));
    }

    dispatch(addTask(task));

    navigation.popToTop();
  };

  return (
    <DismissKeyboard>
      <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.body}>
        <Modal 
        animationType='fade' 
        transparent={true} 
        visible={validatorModalVisible} 
        onRequestClose={() => setValidatorModalVisible(!validatorModalVisible)}
        >
          <BlurView tint='dark' style={{flex: 1,}}>
            <View style={styles.centeredModalBody}>
              <View style={styles.modalBody}>
                <Text style={{textAlign: 'center', ...styles.text}}>{generateWarningText()}</Text>
                <Button title='Dismiss' onPress={() => setValidatorModalVisible(!validatorModalVisible)}></Button>
              </View>
            </View>
          </BlurView>
        </Modal>

        <View style={styles.inputsBody}>
          <TextInput 
          onChangeText={setTitle} 
          value={title} 
          placeholder='Title' 
          style={styles.textInputStyle} 
          maxLength={maxCharacters}
          ></TextInput>

          <TextInput 
          onChangeText={setDescription} 
          value={description} 
          placeholder='Description' 
          style={styles.textInputStyle} 
          maxLength={maxCharacters}
          ></TextInput>

          <View style={{flex: 1, flexDirection: 'row',}}>
            <View style={styles.modePickerBody}>
              <Text style={styles.text}>Mode</Text>

              <DropDownPicker 
              open={open} 
              value={value} 
              items={items} 
              setOpen={setOpen} 
              setValue={setValue} 
              setItems={setItems} 
              closeAfterSelecting={true} 
              onChangeValue={(value) => setMode(value)}
              onOpen={onModeOpen}  
              style={{borderWidth: 0,}} 
              textStyle={{fontFamily: 'regular-font',}} 
              listMode='SCROLLVIEW'
              ></DropDownPicker>
            </View>

            <View style={styles.dayPickerBody}>
              <Text style={styles.text}>Day</Text>

              <DropDownPicker 
              open={openDays} 
              value={dayValue} 
              items={days} 
              setOpen={setOpenDays} 
              setValue={setDayValue} 
              setItems={setDays} 
              closeAfterSelecting={true}
              onChangeValue={(value) => setDay(value)}
              onOpen={onDayOpen}  
              disabled={mode !== MODES_ENUM.WEEKLY} 
              style={{borderWidth: 0, backgroundColor: mode !== MODES_ENUM.WEEKLY ? '#999999' : '#ffffff'}} 
              textStyle={{fontFamily: 'regular-font',}} 
              listMode='SCROLLVIEW'
              ></DropDownPicker>
            </View>
          </View>
        </View>

        <View style={styles.timePickerBody}>
          <IconTextButton 
          onPress={showDatePicker} 
          title={date.toLocaleDateString()} 
          iconName='calendar-sharp' 
          disabled={mode === MODES_ENUM.DAILY || mode === MODES_ENUM.WEEKLY}
          ></IconTextButton>

          <IconTextButton onPress={showTimePicker} title={date.toLocaleTimeString()} iconName='time'></IconTextButton>

          <IconTextButton onPress={() => navigation.navigate('Geolocation')} title={locationName} iconName='location-sharp'></IconTextButton>

          <View style={styles.switchBody}>
            <View style={{flex: 1, flexDirection: 'row',}}>
              <Text style={styles.text}>Will repeat</Text>
              <Ionicons 
              name={mode === MODES_ENUM.DATE_TIME ? 'close' : 'checkmark'} 
              size={24} 
              color={mode === MODES_ENUM.DATE_TIME ? '#ff0000' : '#32b233'}
              ></Ionicons>
            </View>
            
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
              <Text style={styles.text}>Toggle urgent mode</Text>
              <Switch onValueChange={toggleSwitch} value={isUrgent} disabled={mode !== MODES_ENUM.DATE_TIME}></Switch>
            </View>
          </View>

          <IconTextButton onPress={modifyTaskAsync} title={routeData ? 'Edit Task' : 'Add Task'} iconName='cube' color='#ffa500'></IconTextButton>

          {show && 
          <DateTimePicker 
          testID='dateTimePicker' 
          value={date} 
          mode={timeMode} 
          is24Hour={true} 
          minimumDate={isUrgent ? minimumDate : MIN_DATE} 
          onChange={onChange}
          ></DateTimePicker>}
        </View>
      </ScrollView>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  centeredModalBody: {
    flex: 1,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    margin: 32,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    elevation: 4,
  },
  inputsBody: {
    flex: 1,
  },
  modePickerBody: {
    flex: 1,
    padding: 8,
  },
  dayPickerBody: {
    flex: 1,
    padding: 8,
  },
  timePickerBody: {
    flex: 2,
    zIndex: 0,
  },
  switchBody: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputStyle: {
    fontFamily: 'regular-font',
    padding: 16,
    marginBottom: 4,
    backgroundColor: '#ffffff',
  },
  iconTextButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 22,
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontFamily: 'regular-font',
    fontSize: 16,
  },
  iconTextButtonText: {
    flex: 1,
    fontFamily: 'regular-font',
    fontSize: 14,
    textAlign: 'center',
  }
});