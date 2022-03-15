import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default App = () => {
  return (
    <View style={styles.container}>
      <CalendarList 
        onVisibleMonthsChange = { (months) => { console.log('Now these months are visible.', months); } }
        pastScrollRange = { 50 }
        futureScrollRange = { 50 }
        scrollEnabled = { true }
        showScrollIndicator = { true }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea"
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  }
});