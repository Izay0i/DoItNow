import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';

const CalendarProp = () => {
    return (
        <View style = { styles.body }>
            <CalendarList
                pastScrollRange = { 50 }
                futureScrollRange = { 50 }
                scrollEnabled = { true }
                showScrollIndicator = { true }
            >
            </CalendarList>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
    }
});

export default CalendarProp;