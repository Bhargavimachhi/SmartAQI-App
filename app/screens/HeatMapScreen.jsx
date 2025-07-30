import React from 'react';
import { View, Text } from 'react-native';

const HeatMapScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Live Heat Map</Text>
      <Text>[Dummy Heat Map Data: Red = AQI 150, Yellow = AQI 100-150, Green 100]</Text>
    </View>
  );
};

export default HeatMapScreen;