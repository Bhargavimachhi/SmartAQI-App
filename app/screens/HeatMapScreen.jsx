import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapViewCluster from "react-native-map-clustering";
import { Marker } from "react-native-maps";

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
  const [selectedMetric, setSelectedMetric] = useState("AQI");
  const [aqiData, setAqiData] = useState([]);
  const [region, setRegion] = useState({
    latitude: 22.9734,
    longitude: 78.6569,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  async function getAllStationAqiData() {
    try {
      const res = await axios.get(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/getallstations`
      );
      const data = res.data;
      const filteredAqiData = data.filter((point) => {
        return (
          Math.abs(point.lat - region.latitude) < region.latitudeDelta / 2 &&
          Math.abs(point.lon - region.longitude) < region.longitudeDelta / 2
        );
      });
      setAqiData(filteredAqiData);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllStationAqiData();
  }, []);

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
      <MapViewCluster
        style={styles.map}
        initialRegion={{
          latitude: 22.9734,
          longitude: 78.6569,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
        clusterColor="#1e3a8a"
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
      </MapViewCluster>
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
