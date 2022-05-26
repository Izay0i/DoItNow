import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { mainStyles, lightStyles, darkStyles } from '../themes/GeolocationScreen.themes';
import { COLORS_ENUM } from '../constants/color-constants';
import { LOCATION_AUTOCOMPLETE_API } from '@env';
import MapView, { Marker } from 'react-native-maps';

import * as Location from 'expo-location';

import i18n from 'i18n-js';
import LocationItem from '../components/LocationItem';
import Ionicons from '@expo/vector-icons/Ionicons';

const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.001;

const AutocompleteDropdown = ({data, text, placeholderText, renderItem, keyExtractor, onChangeText, onSubmit}) => {
  const { theme } = useSelector(state => state.themeReducer);
  
  const SEARCH_MAX_LENGTH = 200;

  return (
    <View style={mainStyles.body}>
      <View style={mainStyles.searchBody}>
        <TextInput 
        value={text} 
        placeholder={placeholderText} 
        placeholderTextColor={COLORS_ENUM.GRAY} 
        maxLength={SEARCH_MAX_LENGTH} 
        onChangeText={onChangeText} 
        onSubmitEditing={onSubmit} 
        style={theme === 'light' ? lightStyles.textInputBody : darkStyles.textInputBody}
        ></TextInput>
        <TouchableOpacity onPress={onSubmit} style={mainStyles.searchButton}>
          <Ionicons name='search' size={24} color={COLORS_ENUM.BLACK}></Ionicons>
        </TouchableOpacity>
      </View>

      {data.length !== 0 && 
      <FlatList 
      data={data} 
      extraData={data} 
      renderItem={renderItem} 
      keyExtractor={keyExtractor} 
      style={mainStyles.listBody}
      ></FlatList>}
    </View>
  );
};

export default function GeolocationScreen({ navigation }) {
  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasPermission(false);
        navigation.goBack();
      }
      else {
        setHasPermission(true);
      }

      let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
      await getAddressFromCoordinate(latitude, longitude);
      setLocation({latitude, longitude});

      const region = {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setInitialRegion(region);
      setRegion(region);
    };

    getLocationAsync();
  }, []);

  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  const { theme } = useSelector(state => state.themeReducer);

  const mapViewRef = useRef(null);
  const markerRef = useRef(null);

  const onMapPress = useCallback((e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    (async () => {
      await getAddressFromCoordinate(latitude, longitude);
    })();

    setLocation({latitude, longitude});
    markerRef.current?.animateMarkerToCoordinate(location, 3 * 1000);
  }, [location]);

  const onRegionChangeComplete = useCallback((region) => setRegion(region), [region]);

  const onDragEnd = useCallback((e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    (async () => {
      await getAddressFromCoordinate(latitude, longitude);
    })();

    setRegion({
      latitude, 
      longitude, 
      latitudeDelta: LATITUDE_DELTA, 
      longitudeDelta: LONGITUDE_DELTA
    });
    mapViewRef.current?.animateToRegion(region, 3 * 1000);
  }, [region]);

  const getAddressFromCoordinate = useCallback(async (latitude, longitude) => {
    const location = await mapViewRef.current?.addressForCoordinate({latitude, longitude});
    const locationName = [
      location.subThoroughfare, 
      location.thoroughfare, 
      location.subAdministrativeArea, 
      location.administrativeArea
    ]
    .filter(str => str !== null)
    .join(' ');
    setLocationName(locationName);
  }, [locationName]);

  const keyExtractor = useCallback((item) => `${item.place_id}-${item.osm_id}-${item.class}`, []);

  const renderItem = ({ item }) => (
    <LocationItem location={item} onPress={(latitude, longitude) => setMarkerAndRegion(latitude, longitude)}></LocationItem>
  );

  const onLocationSubmit = async () => {
    if (locationSearch.length === 0) {
      setLocations([]);
      return;
    }

    const MAX_LIMIT = 10;
    let locations = await fetch(`${LOCATION_AUTOCOMPLETE_API}&q=${locationSearch}&limit=${MAX_LIMIT}`, {
      method: 'GET',
    });

    locations.json().then(data => {
      setLocations(data);
    });
  };

  const setMarkerAndRegion = (lat, lon) => {
    const latitude = Number(lat);
    const longitude = Number(lon);

    (async () => {
      await getAddressFromCoordinate(latitude, longitude);
    })();

    setLocation({ latitude, longitude });
    markerRef.current?.animateMarkerToCoordinate(location, 3 * 1000);

    setRegion({
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    mapViewRef.current?.animateToRegion(region, 3 * 1000);

    setLocationSearch('');
    setLocations([]);
  };

  const navigateBack = () => {
    navigation.navigate({
      name: 'TaskEditor',
      params: { locationName },
      merge: true,
    });
  }

  return (
    <View style={theme === 'light' ? lightStyles.secondaryBody : darkStyles.secondaryBody}>
      <MapView 
      ref={mapViewRef} 
      style={mainStyles.mapBody} 
      initialRegion={initialRegion} 
      region={region} onPress={onMapPress} 
      onRegionChangeComplete={onRegionChangeComplete}>
        <Marker ref={markerRef} draggable title={locationName} coordinate={location} onDragEnd={onDragEnd}></Marker>
      </MapView>

      <AutocompleteDropdown 
      data={locations} 
      text={locationSearch} 
      placeholderText={i18n.t('locationInputPlaceholder')} 
      renderItem={renderItem} 
      keyExtractor={keyExtractor} 
      onChangeText={setLocationSearch} 
      onSubmit={onLocationSubmit}
      ></AutocompleteDropdown>

      <View style={theme === 'light' ? lightStyles.buttonsBody : darkStyles.buttonsBody}>
        <Text style={theme === 'light' ? lightStyles.text : darkStyles.text}>{`${i18n.t('locationCurrentLocationTitle')}: ${locationName}`}</Text>
        <Button title={i18n.t('locationSetLocation')} onPress={navigateBack}></Button>
      </View>
    </View>
  );
}