import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, Button, Text, TextInput, Switch, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/actions';
import { subscribeLocalNotificationAsync } from '../functions/async-notification-functions';

import DateTimePicker from '@react-native-community/datetimepicker';
import ItemPicker from '../components/ItemPicker';

const DismissKeyboard = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default function TaskEditorScreen({ route, navigation }) {
  console.log(route.params?.item);

  const dispatch = useDispatch();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    selectedDate && setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const showTimePicker = () => {
    showMode('time');
  };

  const items = [
    { label: '5', value: 300 },
    { label: '15', value: 900 },
    { label: '30', value: 1800 },
    { label: '60', value: 3600 },
  ];

  async function foo() {
    const content = {
      title: 'Title',
      body: 'Description',
    };

    const trigger = {
      date: date.valueOf(),
      repeats: false,
    };

    const item = {
      id: await subscribeLocalNotificationAsync(content, trigger),
      content,
      trigger,
      createdAt: Date.now(),
    };

    console.log(item);

    dispatch(addTask(item));

    navigation.popToTop();
  }

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        <View style={styles.textInputsContainer}>
          <TextInput placeholder='Title' style={styles.textInput}></TextInput>
          <TextInput placeholder='Description' style={styles.textInput}></TextInput>
        </View>

        <View style={styles.buttonsContainer}>
          <View>
            <Button onPress={showDatePicker} title='Set date'></Button>
          </View>
          <View style={{marginVertical: 8,}}>
            <Button onPress={showTimePicker} title='Set time'></Button>
          </View>

          <Text>Selected: {date.toLocaleString()}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <View>
            <Text style={styles.textStyle}>Alert prior</Text>
            <ItemPicker itemList={items} onPress={(item) => console.log(item)}></ItemPicker>
          </View>

          <View>
            <Text style={styles.textStyle}>Repeat?</Text>
            <Switch onValueChange={toggleSwitch} value={isEnabled}></Switch>
          </View>
        </View>

        <View style={{flex: 1, zIndex: 0}}>
          <View style={{zIndex: 0,}}>
            <Button title={route.params ? 'Edit task' : 'Add task'} onPress={foo}></Button>
          </View>

          {show && (
            <DateTimePicker 
            testID='dateTimePicker' 
            value={date} 
            mode={mode} 
            is24Hour={true} 
            onChange={onChange}
            ></DateTimePicker>
          )}
        </View>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 8,
    backgroundColor: '#ffffff',
  },
  textInputsContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#ffffff',
  },
  textStyle: {
    fontFamily: 'poppins-regular',
  }
});