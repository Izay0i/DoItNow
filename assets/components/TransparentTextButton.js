import React from "react";

import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function TransparentTextButton({ onPress, text, textColor, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.body} disabled={disabled}>
      <Text style={{color: textColor, ...styles.text}}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#999999',
  },
  text: {
    fontSize: 24,
    fontFamily: 'regular-font',
    textAlign: 'center',
  }
});