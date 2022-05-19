import React, { useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';

export default function ItemPicker({ itemList, onPress }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
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
    style={{elevation: 2, borderWidth: 0,}} 
    textStyle={{fontFamily: 'regular-font',}}
    ></DropDownPicker>
  );
}