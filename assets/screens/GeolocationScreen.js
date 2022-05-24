import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { LOCATION_AUTOCOMPLETE_API } from '@env';
import MapView, { Marker } from 'react-native-maps';

import * as Location from 'expo-location';

import LocationItem from '../components/LocationItem';
import Ionicons from '@expo/vector-icons/Ionicons';

const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.001;

const AutocompleteDropdown = ({data, text, placeholderText, renderItem, keyExtractor, onChangeText, onSubmit}) => {
  const SEARCH_MAX_LENGTH = 200;

  return (
    <View style={{position: 'absolute', width: '100%',}}>
      <View style={{flex: 1, flexDirection: 'row',}}>
        <TextInput 
        value={text} 
        placeholder={placeholderText} 
        maxLength={SEARCH_MAX_LENGTH} 
        onChangeText={onChangeText} 
        onSubmitEditing={onSubmit} 
        style={styles.textInputStyle}
        ></TextInput>
        <TouchableOpacity style={styles.searchButtonStyle} onPress={onSubmit}>
          <Ionicons name='search' size={24} color='#000000'></Ionicons>
        </TouchableOpacity>
      </View>

      {data.length !== 0 && 
      <FlatList 
      data={data} 
      extraData={data} 
      renderItem={renderItem} 
      keyExtractor={keyExtractor} 
      style={{position: 'absolute', width: '100%', maxHeight: '50%', top: 55}}
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

  const renderItem = useCallback(({ item }) => (
    <LocationItem location={item} onPress={(latitude, longitude) => setMarkerAndRegion(latitude, longitude)}></LocationItem>
  ), []);

  const keyExtractor = useCallback((item) => `${item.place_id}-${item.osm_id}-${item.class}`, []);

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
    <View style={styles.body}>
      <MapView 
      ref={mapViewRef} 
      style={styles.mapBody} 
      initialRegion={initialRegion} 
      region={region} onPress={onMapPress} 
      onRegionChangeComplete={onRegionChangeComplete}>
        <Marker ref={markerRef} draggable title={locationName} coordinate={location} onDragEnd={onDragEnd}></Marker>
      </MapView>

      <AutocompleteDropdown 
      data={locations} 
      text={locationSearch} 
      placeholderText='Search location...' 
      renderItem={renderItem} 
      keyExtractor={keyExtractor} 
      onChangeText={setLocationSearch} 
      onSubmit={onLocationSubmit}
      ></AutocompleteDropdown>

      <View style={styles.controlsBody}>
        <Text style={styles.textStyle}>Current location: {locationName}</Text>
        <Button title='Set location' onPress={navigateBack}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  mapBody: {
    flex: 4,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  controlsBody: {
    flex: 1,
    margin: 6,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#999999',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  textInputStyle: {
    flex: 1,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 8,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#999999',
  },
  textStyle: {
    fontFamily: 'regular-font',
    fontSize: 16,
    textAlign: 'left',
  }
});