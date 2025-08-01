import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';

// AQI → Color mapping
const getAQIColorHex = (aqi) => {
  if (aqi <= 50) return '#4ade80';   // Green
  if (aqi <= 100) return '#15803d';  // Dark Green
  if (aqi <= 200) return '#facc15';  // Yellow
  if (aqi <= 300) return '#f97316';  // Orange
  if (aqi <= 400) return '#ef4444';  // Red
  return '#b91c1c';                  // Dark Red
};

const aqiData = [
  { latitude: 28.6139, longitude: 77.2090, aqi: 180 }, // Delhi
  { latitude: 19.0760, longitude: 72.8777, aqi: 90 },  // Mumbai
  { latitude: 13.0827, longitude: 80.2707, aqi: 45 },  // Chennai
  { latitude: 22.5726, longitude: 88.3639, aqi: 320 }, // Kolkata
  { latitude: 23.0225, longitude: 72.5714, aqi: 400 }, // Ahmedabad
  { latitude: 12.9716, longitude: 77.5946, aqi: 80 },  // Bangalore
];

const AQIColoredMap = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 21.7679,
          longitude: 78.8718,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
      >
        {aqiData.map((item, index) => (
          <Circle
            key={index}
            center={{ latitude: item.latitude, longitude: item.longitude }}
            radius={30000} // Adjust size as needed (in meters)
            strokeColor="rgba(0,0,0,0.2)"
            fillColor={getAQIColorHex(item.aqi)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default AQIColoredMap;
