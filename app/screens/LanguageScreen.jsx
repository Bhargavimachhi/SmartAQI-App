import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Text, View } from 'react-native';

const LanguageScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log(loc);
      setLocation(loc.coords);
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </View>
  );
};

export default LanguageScreen;
