import React from 'react';
import { View, StyleSheet, Text, Button, TouchableHighlight } from 'react-native';

export default function TaskListItem({ navigation, item }) {
  return (
    <View style={styles.item}>
      <TouchableHighlight style={styles.body} onPress={() => {navigation.navigate('TaskEditor')}}>
        <Text>{item.title}</Text>
      </TouchableHighlight>
      <Button title='🔔' onPress={item?.function}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'red',
  },
  item: {
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