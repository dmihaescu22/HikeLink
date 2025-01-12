import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}
