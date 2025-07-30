import React from 'react';
import { View, Text } from 'react-native';

const HistoryScreen = () => {
  const dummyData = [80, 90, 110, 95, 88];
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Historical AQI Trends</Text>
      {dummyData.map((val, idx) => (
        <Text key={idx}>Day {idx + 1}: AQI {val}</Text>
      ))}
    </View>
  );
};

export default HistoryScreen;