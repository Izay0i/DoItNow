import React, { useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';

export default function ItemPicker({ itemList, defaultValue, onPress, isDarkMode = false }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState(itemList);

  return (
    <DropDownPicker 
    open={open} 
    value={value} 
    items={items} 
    setOpen={setOpen} 
    setValue={setValue} 
    setItems={setItems} 
    onSelectItem={(item) => onPress(item)} 
    style={{borderWidth: 0,}} 
    textStyle={{fontFamily: 'regular-font',}} 
    theme={isDarkMode ? 'DARK' : 'LIGHT'}
    ></DropDownPicker>
  );
}