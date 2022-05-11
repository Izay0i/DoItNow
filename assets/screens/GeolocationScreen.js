import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, LogBox, Text, Button } from 'react-native';

import * as Location from 'expo-location';

import MapView, { Marker } from 'react-native-maps';

LogBox.ignoreAllLogs();

const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;

export default function GeolocationScreen({ navigation }) {
  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission to access location was denied');
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
  const [locationName, setLocationName] = useState('');
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
    const locationName = location.subThoroughfare + ' ' + location.thoroughfare + ' ' + location.subAdministrativeArea + ' ' + location.administrativeArea;
    setLocationName(locationName);
  }, [locationName]);

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
      
      <View style={styles.controlsBody}>
        <Text style={styles.textStyle}>Selected location: {locationName}</Text>
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
    justifyContent: 'space-between',
  },
  textStyle: {
    fontFamily: 'poppins-regular',
    fontSize: 16,
    textAlign: 'left',
  }
});