import React from "react";

import { TouchableOpacity, Text } from 'react-native';
import { useSelector } from "react-redux";
import { mainStyles, lightStyles, darkStyles } from "../themes/TransparentTextButton.themes";

export default function TransparentTextButton({ onPress, text, textColor, disabled }) {
  const { theme } = useSelector(state => state.themeReducer);
  
  return (
    <TouchableOpacity onPress={onPress} style={theme === 'light' ? lightStyles.body : darkStyles.body} disabled={disabled}>
      <Text style={{color: textColor, ...mainStyles.text}}>{text}</Text>
    </TouchableOpacity>
  );
};