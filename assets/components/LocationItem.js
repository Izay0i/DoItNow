import React from 'react';

import { View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { mainStyles, lightStyles, darkStyles } from '../themes/LocationItem.themes';

export default function LocationItem({ location, onPress }) {
  const { theme } = useSelector(state => state.themeReducer);
  
  return (
    <View style={mainStyles.body}>
      <TouchableOpacity onPress={() => onPress(location?.lat, location?.lon)} style={theme === 'light' ? lightStyles.touchableBody : darkStyles.touchableBody}>
        <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{location?.display_place}</Text>
        <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{location?.display_address}</Text>
      </TouchableOpacity>
    </View>
  );
}