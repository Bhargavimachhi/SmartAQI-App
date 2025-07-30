// AQITrendsScreen.tsx - React Native version of AQI Trends Dashboard
import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { Card } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const sampleAQIData = [
  { date: '2025-07-01', aqi: 120 },
  { date: '2025-07-02', aqi: 160 },
  { date: '2025-07-03', aqi: 100 },
  { date: '2025-07-04', aqi: 200 },
  { date: '2025-07-05', aqi: 80 },
];

const categoryDistribution = {
  Good: 20,
  Moderate: 40,
  Unhealthy: 25,
  VeryUnhealthy: 10,
  Hazardous: 5,
};

const AQITrendsScreen = () => {
  const dates = sampleAQIData.map(item => item.date);
  const values = sampleAQIData.map(item => item.aqi);

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>AQI Trends</Text>

      {/* Summary Cards */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <Card style={{ padding: 12, flex: 1, margin: 4 }}>
          <Text style={{ fontSize: 14 }}>Average AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>120</Text>
        </Card>
        <Card style={{ padding: 12, flex: 1, margin: 4 }}>
          <Text style={{ fontSize: 14 }}>Peak AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>200</Text>
        </Card>
        <Card style={{ padding: 12, flex: 1, margin: 4 }}>
          <Text style={{ fontSize: 14 }}>Lowest AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>80</Text>
        </Card>
      </View>

      {/* AQI Line Chart */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>AQI Over Time</Text>
      <LineChart
        data={{
          labels: dates,
          datasets: [{ data: values }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=" AQI"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f1f5f9',
          backgroundGradientTo: '#f1f5f9',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          labelColor: () => '#333',
          style: { borderRadius: 16 },
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#22c55e' },
        }}
        style={{ marginBottom: 24, borderRadius: 16 }}
      />

      {/* Calendar View */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Calendar Heatmap</Text>
      <Calendar
        markedDates={{
          '2025-07-02': { selected: true, selectedColor: '#f59e0b' },
          '2025-07-04': { selected: true, selectedColor: '#ef4444' },
        }}
        style={{ marginBottom: 24 }}
      />

      {/* Category Distribution */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Category Distribution</Text>
      <BarChart
        data={{
          labels: Object.keys(categoryDistribution),
          datasets: [{ data: Object.values(categoryDistribution) }],
        }}
        width={screenWidth - 32}
        height={250}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: () => '#3b82f6',
          labelColor: () => '#000',
          style: { borderRadius: 16 },
        }}
        style={{ borderRadius: 16 }}
      />
    </ScrollView>
  );
};

export default AQITrendsScreen;
