import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Keyboard, Text, TextInput, Modal, Button, Switch, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask } from '../redux/actions';
import { subscribeLocalNotificationAsync, unsubscribeLocalNotificationAsync } from '../functions/async-notification-functions';
import { mainStyles, lightStyles, darkStyles } from '../themes/TaskEditorScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';
import { MODES_ENUM, EXPO_WEEKDAYS_ENUM, MIN_DATE, CHANNEL_ID } from '../constants/app-constants';

import i18n from 'i18n-js';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const DismissKeyboard = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const IconTextButton = ({ onPress, title, iconName, color = COLORS_ENUM.WHITE, disabled = false }) => {
  const { theme } = useSelector(state => state.themeReducer);

  return (
    <TouchableOpacity 
    onPress={onPress} 
    style={{backgroundColor: disabled ? COLORS_ENUM.GRAY : color, ...mainStyles.iconTextButton}} 
    disabled={disabled}>
      <Ionicons name={iconName} size={24} color={theme === 'light' ? COLORS_ENUM.BLACK : COLORS_ENUM.WHITE}></Ionicons>
      <Text style={theme === 'light' ? lightStyles.iconTextButtonText : darkStyles.iconTextButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TaskEditorScreen({ route, navigation }) {
  useEffect(() => {
    if (routeData) {
      const { title, body } = routeData.content;
      const { childId, mode, notificationDate, location } = routeData.content.data;

      setTitle(title);
      setDescription(body);

      setIsUrgent(childId !== '');

      setValue(mode);

      const { weekday } = routeData.trigger;
      setDayValue(weekday ? weekday : days[0].value);

      setDate(new Date(notificationDate));

      setLocationName(location !== '' ? location : locationName);
    }

    if (route.params?.locationName) {
      setLocationName(route.params?.locationName);
    }
  }, [routeData, route.params?.locationName]);

  const [routeData, setRouteData] = useState(route.params?.item);

  const [validatorModalVisible, setValidatorModalVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [minCharacters, setMinCharacters] = useState(10);
  const [maxCharacters, setMaxCharacters] = useState(64);

  const [isUrgent, setIsUrgent] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(MODES_ENUM.DATE_TIME);
  const [items, setItems] = useState([
    { label: i18n.t('editorModeOptionDatetime'), value: MODES_ENUM.DATE_TIME, },
    { label: i18n.t('editorModeOptionDaily'), value: MODES_ENUM.DAILY, },
    { label: i18n.t('editorModeOptionWeekly'), value: MODES_ENUM.WEEKLY, },
    { label: i18n.t('editorModeOptionYearly'), value: MODES_ENUM.YEARLY, },
  ]);

  const [openDays, setOpenDays] = useState(false);
  const [dayValue, setDayValue] = useState(EXPO_WEEKDAYS_ENUM.SUNDAY);
  const [days, setDays] = useState([
    { label: i18n.t('sunday'), value: EXPO_WEEKDAYS_ENUM.SUNDAY, },
    { label: i18n.t('monday'), value: EXPO_WEEKDAYS_ENUM.MONDAY, },
    { label: i18n.t('tuesday'), value: EXPO_WEEKDAYS_ENUM.TUESDAY, },
    { label: i18n.t('wednesday'), value: EXPO_WEEKDAYS_ENUM.WEDNESDAY, },
    { label: i18n.t('thursday'), value: EXPO_WEEKDAYS_ENUM.THURSDAY, },
    { label: i18n.t('friday'), value: EXPO_WEEKDAYS_ENUM.FRIDAY, },
    { label: i18n.t('saturday'), value: EXPO_WEEKDAYS_ENUM.SATURDAY, },
  ]);

  const [mode, setMode] = useState(MODES_ENUM.DATE_TIME);

  const [day, setDay] = useState(EXPO_WEEKDAYS_ENUM.SUNDAY);

  const [minimumDate, setMinimumDate] = useState(() => {
    const NUMBER_OF_DAYS = 3;
    return new Date().setDate(new Date().getDate() + NUMBER_OF_DAYS);
  });
  const [date, setDate] = useState(new Date());
  const [timeMode, setTimeMode] = useState('date');
  const [show, setShow] = useState(false);

  const [locationName, setLocationName] = useState(i18n.t('editorLocationStartMessage'));

  const { theme } = useSelector(state => state.themeReducer);

  const toggleSwitch = () => setIsUrgent(previousState => !previousState);

  const onModeOpen = useCallback(() => {
    setOpenDays(false);
  });

  const onDayOpen = useCallback(() => {
    setOpen(false);
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    selectedDate && setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setTimeMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const showTimePicker = () => {
    showMode('time');
  };

  const dispatch = useDispatch();

  const generateWarningText = () => {
    if (title.length < minCharacters) {
      return `${i18n.t('editorTitleErrorMessage')} (${minCharacters} - ${maxCharacters})`;
    }

    if (description.length < minCharacters) {
      return `${i18n.t('editorDescErrorMessage')} (${minCharacters} - ${maxCharacters})`;
    }

    const timeSet = date.setSeconds(0);
    const timeFiveMinLater = Date.now() + 300 * 1000;

    if (isUrgent && timeSet - timeFiveMinLater <= 0) {
      return i18n.t('editorUrgentErrorMessage');
    }

    return '';
  };

  const createTrigger = () => {
    let trigger = { 
      channelId: CHANNEL_ID,
      repeats: mode !== MODES_ENUM.DATE_TIME, 
    };

    const dateAttrib = date.setSeconds(0);
    const dayAttrib = date.getDate();
    const monthAttrib = date.getMonth();
    const weekdayAttrib = day;
    const hourAttrib = date.getHours();
    const minuteAttrib = date.getMinutes();

    switch (mode) {
      case MODES_ENUM.DATE_TIME:
        trigger = { date: dateAttrib, dateStr: date.toLocaleString(), ...trigger };
        break;
      case MODES_ENUM.WEEKLY:
        trigger = { weekday: weekdayAttrib, ...trigger };
      case MODES_ENUM.DAILY:
        trigger = { hour: hourAttrib, minute: minuteAttrib, ...trigger };
        break;
      case MODES_ENUM.YEARLY:
        trigger = { 
          day: dayAttrib, 
          month: monthAttrib, 
          hour: hourAttrib, 
          minute: minuteAttrib, 
          ...trigger 
        };
        break;
    }

    return trigger;
  };

  const createFrequentReminder = async (trig) => {
    if (!isUrgent || mode !== MODES_ENUM.DATE_TIME) {
      return '';
    }

    const content = {
      title: `${i18n.t('editorAlertNotificationMessage')}: ${title}`,
      body: `${i18n.t('editorAlertNotificationOnMessage')}}: ${trig.dateStr}`,
    };

    //1/3 of the duration of the parent notification
    const scheduledDateInMS = date.getTime();
    const todayInMS = Date.now();
    const difference = scheduledDateInMS - todayInMS;
    const diffInSeconds = Math.floor(difference / 1000);
    const interval = diffInSeconds / 3;

    const trigger = {
      channelId: CHANNEL_ID,
      seconds: interval,
      repeats: true,
    };

    const id = await subscribeLocalNotificationAsync(content, trigger);
    return id;
  };

  const modifyTaskAsync = async () => {
    const warningText = generateWarningText();
    if (warningText !== '') {
      setValidatorModalVisible(!validatorModalVisible);
      return;
    }

    const trigger = createTrigger();

    const notificationBody = {
      title,
      body: description,
    };

    const content = {
      title,
      body: description,
      data: {
        id: await subscribeLocalNotificationAsync(notificationBody, trigger),
        childId: await createFrequentReminder(trigger),
        mode,
        location: locationName !== i18n.t('editorLocationStartMessage') ? locationName: '',
        taskDone: false,
        notificationDate: date.valueOf(),
        createdAt: Date.now(),
      },
    };

    const task = {
      content,
      trigger,
    };

    if (routeData) {
      const { id, childId } = routeData.content.data;

      await unsubscribeLocalNotificationAsync(childId);
      await unsubscribeLocalNotificationAsync(id);
      dispatch(deleteTask(routeData));
    }

    dispatch(addTask(task));

    navigation.popToTop();
  };

  return (
    <DismissKeyboard>
      <ScrollView nestedScrollEnabled={true} contentContainerStyle={theme === 'light' ? lightStyles.body : darkStyles.body}>
        <Modal 
        animationType='fade' 
        transparent={true} 
        visible={validatorModalVisible} 
        onRequestClose={() => setValidatorModalVisible(!validatorModalVisible)}
        >
          <BlurView tint='dark' style={{flex: 1,}}>
            <View style={mainStyles.centeredModalBody}>
              <View style={theme === 'light' ? lightStyles.modalBody : darkStyles.modalBody}>
                <Text style={theme === 'light' ? lightStyles.modalText : darkStyles.modalText}>{generateWarningText()}</Text>
                <Button title={i18n.t('editorDismiss')} onPress={() => setValidatorModalVisible(!validatorModalVisible)}></Button>
              </View>
            </View>
          </BlurView>
        </Modal>

        <View style={{flex: 1,}}>
          <TextInput 
          onChangeText={setTitle} 
          value={title} 
          placeholder={i18n.t('editorTitleInputPlaceholder')} 
          placeholderTextColor={COLORS_ENUM.GRAY} 
          style={theme === 'light' ? lightStyles.textInputBody : darkStyles.textInputBody} 
          maxLength={maxCharacters}
          ></TextInput>

          <TextInput 
          onChangeText={setDescription} 
          value={description} 
          placeholder={i18n.t('editorDescInputPlaceholder')} 
          placeholderTextColor={COLORS_ENUM.GRAY} 
          style={theme === 'light' ? lightStyles.textInputBody : darkStyles.textInputBody} 
          maxLength={maxCharacters}
          ></TextInput>

          <View style={mainStyles.dropDownsBody}>
            <View style={mainStyles.modePickerBody}>
              <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{i18n.t('editorModeTitle')}</Text>

              <DropDownPicker 
              open={open} 
              value={value} 
              items={items} 
              setOpen={setOpen} 
              setValue={setValue} 
              setItems={setItems} 
              closeAfterSelecting={true} 
              onChangeValue={(value) => setMode(value)}
              onOpen={onModeOpen}  
              style={{borderWidth: 0,}} 
              textStyle={{fontFamily: 'regular-font',}} 
              listMode='SCROLLVIEW' 
              theme={theme === 'light' ? 'LIGHT' : 'DARK'}
              ></DropDownPicker>
            </View>

            <View style={mainStyles.dayPickerBody}>
              <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{i18n.t('editorDayTitle')}</Text>

              <DropDownPicker 
              open={openDays} 
              value={dayValue} 
              items={days} 
              setOpen={setOpenDays} 
              setValue={setDayValue} 
              setItems={setDays} 
              closeAfterSelecting={true}
              onChangeValue={(value) => setDay(value)}
              onOpen={onDayOpen}  
              disabled={mode !== MODES_ENUM.WEEKLY} 
              style={{borderWidth: 0, backgroundColor: mode !== MODES_ENUM.WEEKLY ? COLORS_ENUM.GRAY : (theme === 'light' ? COLORS_ENUM.WHITE : COLORS_ENUM.DARK_GRAY)}} 
              textStyle={{fontFamily: 'regular-font',}} 
              listMode='SCROLLVIEW' 
              theme={theme === 'light' ? 'LIGHT' : 'DARK'}
              ></DropDownPicker>
            </View>
          </View>
        </View>

        <View style={mainStyles.timePickerBody}>
          <IconTextButton 
          onPress={showDatePicker} 
          title={date.toLocaleDateString()} 
          iconName='calendar-sharp' 
          color={theme === 'light' ? COLORS_ENUM.WHITE : COLORS_ENUM.DARK_GRAY} 
          disabled={mode === MODES_ENUM.DAILY || mode === MODES_ENUM.WEEKLY}
          ></IconTextButton>

          <IconTextButton 
          onPress={showTimePicker} 
          title={date.toLocaleTimeString()} 
          iconName='time' 
          color={theme === 'light' ? COLORS_ENUM.WHITE : COLORS_ENUM.DARK_GRAY}></IconTextButton>

          <IconTextButton 
          onPress={() => navigation.navigate('Geolocation')} 
          title={locationName} 
          iconName='location-sharp'
          color={theme === 'light' ? COLORS_ENUM.WHITE : COLORS_ENUM.DARK_GRAY}></IconTextButton>

          <View style={mainStyles.switchBody}>
            <View style={mainStyles.toggleBody}>
              <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{i18n.t('editorRepeatMessage')}</Text>
              <Ionicons 
              name={mode === MODES_ENUM.DATE_TIME ? 'close' : 'checkmark'} 
              size={24} 
              color={mode === MODES_ENUM.DATE_TIME ? 
              (theme === 'light' ? COLORS_ENUM.RED : COLORS_ENUM.DARK_RED) : 
              (theme === 'light' ? COLORS_ENUM.VIBRANT_GREEN : COLORS_ENUM.GREEN)}
              ></Ionicons>
            </View>
            
            <View style={mainStyles.switchBody}>
              <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{i18n.t('editorUrgentMessage')}?</Text>
              <Switch 
              onValueChange={toggleSwitch} 
              value={isUrgent} 
              disabled={mode !== MODES_ENUM.DATE_TIME} 
              thumbColor={isUrgent ? COLORS_ENUM.VIBRANT_GREEN : COLORS_ENUM.RED} 
              trackColor={{false: COLORS_ENUM.DARK_RED, true: COLORS_ENUM.GREEN}}></Switch>
            </View>
          </View>

          <IconTextButton 
          onPress={modifyTaskAsync} 
          title={i18n.t(routeData ? 'editorEditTask' : 'editorAddTask')} 
          iconName='cube' 
          color={theme === 'light' ? COLORS_ENUM.ORANGE : COLORS_ENUM.DARK_ORANGE}
          ></IconTextButton>

          {show && 
          <DateTimePicker 
          testID='dateTimePicker' 
          value={date} 
          mode={timeMode} 
          is24Hour={true} 
          minimumDate={isUrgent ? minimumDate : MIN_DATE} 
          onChange={onChange}
          ></DateTimePicker>}
        </View>
      </ScrollView>
    </DismissKeyboard>
  );
}