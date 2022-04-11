import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function TaskEditorScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
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
    <View>
      <View>
        <Button onPress={showDatePicker} title='Show date picker!'></Button>
      </View>

      <View>
        <Button onPress={showTimePicker} title='Show time picker!'></Button>
      </View>

      <Text>selected: {date.toLocaleString()}</Text>
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
  );
}

const styles = StyleSheet.create({

});