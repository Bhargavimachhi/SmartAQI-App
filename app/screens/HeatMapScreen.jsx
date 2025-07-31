import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";

// Sample AQI Data
const aqiData = [
  {
    city: "Delhi",
    lat: 28.6139,
    lon: 77.209,
    aqi: 180,
    pm25: 90,
    pm10: 110,
  },
  {
    city: "Mumbai",
    lat: 19.076,
    lon: 72.8777,
    aqi: 120,
    pm25: 60,
    pm10: 85,
  },
  {
    city: "Bangalore",
    lat: 12.9716,
    lon: 77.5946,
    aqi: 80,
    pm25: 30,
    pm10: 40,
  },
  {
    city: "Ahmedabad",
    lat: 23.0225,
    lon: 72.5714,
    aqi: 90,
    pm25: 55,
    pm10: 70,
  },
];

// Color function based on value
const getColor = (value) => {
  if (value <= 50) return "#4ade80";
  if (value <= 100) return "#15803d";
  if (value <= 200) return "#facc15";
  if (value <= 300) return "#f97316";
  if (value <= 400) return "#ef4444";
  return "#b91c1c";
};

const HeatMapScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState("aqi");

  return (
    <View style={styles.container}>
      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Metric:</Text>
        <Picker
          selectedValue={selectedMetric}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMetric(itemValue)}
        >
          <Picker.Item label="AQI" value="aqi" />
          <Picker.Item label="PM2.5" value="pm25" />
          <Picker.Item label="PM10" value="pm10" />
        </Picker>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 22.9734,
          longitude: 78.6569,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
      >
        {aqiData.map((city, index) => {
          const value = city[selectedMetric];
          return (
            <Marker
              key={index}
              coordinate={{ latitude: city.lat, longitude: city.lon }}
            >
              <View
                style={{
                  backgroundColor: getColor(value),
                  padding: 10,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#fff",
                  minWidth: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {value}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

export default HeatMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0,
    height: 100,
    zIndex: 10,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#e5e7eb",
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
});
