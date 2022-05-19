import React from 'react';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function LocationItem({ location, onPress }) {
  return (
    <View style={styles.body}>
      <TouchableOpacity onPress={() => onPress(location?.lat, location?.lon)} style={styles.textTouchable}>
      <Text style={styles.textStyle}>{location?.display_place}</Text>
      <Text style={styles.textStyle}>{location?.display_address}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  textTouchable: {
    flex: 1,
    marginHorizontal: 8,
    padding: 8,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    backgroundColor: '#ffffff',
  },
  textStyle: {
    fontFamily: 'regular-font',
    fontSize: 12,
    textAlign: 'left',
  }
});