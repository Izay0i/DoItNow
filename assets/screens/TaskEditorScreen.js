import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, Text, TextInput, Switch, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/actions';
import { subscribeLocalNotificationAsync } from '../functions/async-notification-functions';

import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const modeEnum = {
  TIME: 'time',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  YEARLY: 'yearly',
};

const dayEnum = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7,
};

const DismissKeyboard = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const IconTextButton = ({ onPress, title, iconName, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor: disabled ? '#999999' : '#ffffff', ...styles.iconTextButton}} disabled={disabled}>
      <Ionicons name={iconName} size={24} color='#000000'></Ionicons>
      <Text style={styles.iconTextButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TaskEditorScreen({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(modeEnum.TIME);
  const [items, setItems] = useState([
    { label: 'Date & time', value: modeEnum.TIME, },
    { label: 'Daily', value: modeEnum.DAILY, },
    { label: 'Weekly', value: modeEnum.WEEKLY, },
    { label: 'Yearly', value: modeEnum.YEARLY, },
  ]);

  const [openDays, setOpenDays] = useState(false);
  const [dayValue, setDayValue] = useState(dayEnum.SUNDAY);
  const [days, setDays] = useState([
    { label: 'Sunday', value: dayEnum.SUNDAY, },
    { label: 'Monday', value: dayEnum.MONDAY, },
    { label: 'Tuesday', value: dayEnum.TUESDAY, },
    { label: 'Wednesday', value: dayEnum.WEDNESDAY, },
    { label: 'Thursday', value: dayEnum.THURSDAY, },
    { label: 'Friday', value: dayEnum.FRIDAY, },
    { label: 'Saturday', value: dayEnum.SATURDAY, },
  ]);

  const [mode, setMode] = useState(modeEnum.TIME);

  const [day, setDay] = useState(dayEnum.SUNDAY);

  const [date, setDate] = useState(new Date());
  const [timeMode, setTimeMode] = useState('date');
  const [show, setShow] = useState(false);

  const [isEnabled, setEnabled] = useState(true);

  const toggleSwitch = () => {
    setEnabled(previousState => !previousState);
  };

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

  const createTrigger = () => {
    let trigger = { repeats: mode !== modeEnum.TIME, };

    const dateAttrib = date.setSeconds(0);
    const dayAttrib = date.getDate();
    const monthAttrib = date.getMonth();
    const weekdayAttrib = day;
    const hourAttrib = date.getHours();
    const minuteAttrib = date.getMinutes();

    console.log('Day', dayAttrib);
    console.log('Month', monthAttrib);
    console.log('Hour', hourAttrib);
    console.log('Minute', minuteAttrib);

    switch (mode) {
      case modeEnum.TIME:
        trigger = { date: dateAttrib, dateStr: date.toLocaleString(), ...trigger };
        break;
      case modeEnum.WEEKLY:
        trigger = { weekday: weekdayAttrib, ...trigger };
      case modeEnum.DAILY:
        trigger = { hour: hourAttrib, minute: minuteAttrib, ...trigger };
        break;
      case modeEnum.YEARLY:
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

  const addTaskAsync = async () => {
    const content = {
      title,
      body: description,
    };

    const trigger = createTrigger();

    const task = {
      id: await subscribeLocalNotificationAsync(content, trigger),
      content,
      trigger,
      mode,
      createdAt: Date.now(),
    };

    dispatch(addTask(task));

    navigation.popToTop();
  };

  const saveAsPresetAsync = async () => {
    console.log('Saved as preset');
  };

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        <View style={styles.inputsBody}>
          <TextInput 
          onChangeText={setTitle} 
          value={title} placeholder='Title' 
          style={styles.textInputStyle} 
          maxLength={64}
          ></TextInput>

          <TextInput 
          onChangeText={setDescription} 
          value={description} 
          placeholder='Description' 
          style={styles.textInputStyle} 
          maxLength={64}
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
              style={{elevation: 8, borderWidth: 0,}}
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
              disabled={mode !== modeEnum.WEEKLY} 
              style={{elevation: 8, borderWidth: 0, backgroundColor: mode !== modeEnum.WEEKLY ? '#999999' : '#ffffff'}} 
              listMode='MODAL'
              ></DropDownPicker>
            </View>
          </View>
        </View>

        <View style={styles.timePickerBody}>
          <IconTextButton 
          onPress={showDatePicker} 
          title={date.toLocaleDateString()} 
          iconName='calendar-sharp' 
          disabled={mode === modeEnum.DAILY || mode === modeEnum.WEEKLY}
          ></IconTextButton>

          <IconTextButton onPress={showTimePicker} title={date.toLocaleTimeString()} iconName='time'></IconTextButton>

          <View pointerEvents='none' style={styles.switchBody}>
            <Text style={styles.text}>Repeatable</Text>
            <Switch onValueChange={toggleSwitch} value={isEnabled} disabled={mode === modeEnum.TIME}></Switch>
          </View>

          {
            show && 
            <DateTimePicker 
            testID='dateTimePicker' 
            value={date} 
            mode={timeMode} 
            is24Hour={true} 
            onChange={onChange}
            ></DateTimePicker>
          }
        </View>

        <View style={styles.modButtonsBody}>
          <IconTextButton onPress={saveAsPresetAsync} title='Save As Preset' iconName='bookmark'></IconTextButton>
          <IconTextButton onPress={addTaskAsync} title='Add Task' iconName='cube'></IconTextButton>
        </View>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
    flex: 1,
    zIndex: 0,
  },
  switchBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modButtonsBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textInputStyle: {
    padding: 16,
    marginBottom: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    elevation: 8,
  },
  iconTextButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 22,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000000',
    elevation: 8,
  },
  text: {
    fontFamily: 'poppins-regular',
    fontSize: 16,
  },
  iconTextButtonText: {
    flex: 1,
    fontFamily: 'poppins-regular',
    fontSize: 14,
    textAlign: 'center',
  }
});