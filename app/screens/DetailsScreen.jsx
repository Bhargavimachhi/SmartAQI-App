import React from 'react';
import { View, Text } from 'react-native';

const DetailsScreen = () => {
  const forecast = [92, 110, 95]; // Dummy forecast values
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>3-Day AQI Forecast</Text>
      <Text>Day 1: AQI {forecast[0]}</Text>
      <Text>Day 2: AQI {forecast[1]}</Text>
      <Text>Day 3: AQI {forecast[2]}</Text>
      <Text style={{ marginTop: 20, fontSize: 18 }}>Health Tips:</Text>
      <Text>- Sensitive groups should wear a mask</Text>
      <Text>- Reduce outdoor exercise</Text>
    </View>
  );
};

export default DetailsScreen;