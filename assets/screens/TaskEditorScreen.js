import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, Button, Text, TextInput, Switch, TouchableWithoutFeedback } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

const DismissKeyboard = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default function TaskEditorScreen({ navigation }) {
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

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        <View style={styles.textInputsContainer}>
          <TextInput placeholder='Title' style={styles.textInput}></TextInput>
          <TextInput multiline={true} placeholder='Description' style={styles.textInput}></TextInput>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={{padding: 6,}}>
            <Button onPress={showDatePicker} title='Set date'></Button>
          </View>
          <View style={{padding: 6,}}>
            <Button onPress={showTimePicker} title='Set time'></Button>
          </View>
        </View>
        
        <View style={styles.switchesContainer}>
          <View>
            <Text>Repeat</Text>
            <Switch onValueChange={toggleSwitch} value={isEnabled}></Switch>
          </View>

          <Button title='Add task'></Button>
        </View>

        <View style={{flex: 1,}}>
          <Text>Selected: {date.toLocaleString()}</Text>

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
  },
  textInputsContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
  },
  switchesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
  }
});