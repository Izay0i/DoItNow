import React from 'react';

import { View, StyleSheet, Text, Button, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TaskListItem({ item }) {
  const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <TouchableHighlight style={styles.body} onPress={() => navigation.navigate('TaskEditor')}>
        <Text>{item.title}</Text>
      </TouchableHighlight>

      <TouchableHighlight onPress={item?.function}>
        <Text>🔔</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'red',
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});