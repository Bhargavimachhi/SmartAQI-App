import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import MapViewCluster from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import HeatMapScreen from "./HeatMapScreen";

const StyledView = View;
const StyledText = Text;
const StyledTouchable = TouchableOpacity;
const StyledPressable = Pressable;

// Color function based on AQI
const getColor = (value) => {
  if (value <= 50) return "#4ade80";
  if (value <= 100) return "#15803d";
  if (value <= 200) return "#facc15";
  if (value <= 300) return "#f97316";
  if (value <= 400) return "#ef4444";
  return "#b91c1c";
};


const AQIMapScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState("AQI");
  const [aqiData, setAqiData] = useState([]);
  const [mapType, setMapType] = useState("standard");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [location, setLocation] = useState(null);

  const [region, setRegion] = useState({
    latitude: 22.9734,
    longitude: 78.6569,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  useEffect(() => {
    async function getAllStationAqiData() {
      try {
        const res = await axios.get(
          "http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/getallstations"
        );
        const data = res.data;
        console.log(data);
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
    getAllStationAqiData();
  }, []);

  const renderMapTypeName = (type) => {
    if (type === "standard") return "Normal";
    if (type === "satellite") return "Satellite";
    if (type === "heatmap") return "Heatmap";
    return "View";
  };

  return (
    <StyledView className="flex-1">
      {/* Popover View Button */}
      <StyledTouchable
        className="absolute top-[120px] right-5 w-20 h-20 rounded-full bg-white shadow-lg z-50 justify-center items-center"
        onPress={() => setPopoverVisible(true)}
      >
        <StyledText className="text-4xl">🧭</StyledText>
      </StyledTouchable>

      {/* View Options Popover */}
      <Modal
        visible={popoverVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setPopoverVisible(false)}
      >
        <StyledPressable
          className="flex-1 justify-center items-center bg-black/40"
          onPress={() => setPopoverVisible(false)}
        >
          <StyledView className="bg-white p-4 rounded-lg space-y-4 w-72">
            <StyledText className="text-lg font-semibold mb-2 text-center">
              Select Map View
            </StyledText>

            <StyledTouchable
              className={`rounded-md p-3 ${
                mapType === "standard" ? "bg-blue-100" : "bg-gray-100"
              }`}
              onPress={() => {
                setMapType("standard");
                setPopoverVisible(false);
              }}
            >
              <StyledText className="text-base">🗺️ Normal View</StyledText>
            </StyledTouchable>

            <StyledTouchable
              className={`rounded-md p-3 ${
                mapType === "satellite" ? "bg-blue-100" : "bg-gray-100"
              }`}
              onPress={() => {
                setMapType("satellite");
                setPopoverVisible(false);
              }}
            >
              <StyledText className="text-base">🛰️ Satellite View</StyledText>
            </StyledTouchable>

            <StyledTouchable
              className={`rounded-md p-3 ${
                mapType === "heatmap" ? "bg-blue-100" : "bg-gray-100"
              }`}
              onPress={() => {
                setMapType("heatmap");
                setPopoverVisible(false);
              }}
            >
              <StyledText className="text-base">
                🔥 Heatmap (Coming Soon)
              </StyledText>
            </StyledTouchable>
          </StyledView>
        </StyledPressable>
      </Modal>

      {/* Metric Picker */}
      {mapType !== "heatmap" && (
        <StyledView className="bg-gray-100 p-3 z-10">
          <StyledText className="font-semibold text-base mb-1">
            Select Metric:
          </StyledText>
          <Picker
            selectedValue={selectedMetric}
            style={{ height: 50, backgroundColor: "#e5e7eb" }}
            onValueChange={(itemValue) => setSelectedMetric(itemValue)}
          >
            <Picker.Item label="AQI" value="AQI" />
          </Picker>
        </StyledView>
      )}

      {mapType === "heatmap" && <HeatMapScreen aqiPoints={[]} />}

      {/* Map View */}
      {mapType !== "heatmap" && (
        <MapViewCluster
          provider={PROVIDER_GOOGLE}
          mapType={mapType}
          style={{ flex: 1 }}
          initialRegion={region}
          clusterColor="#1e3a8a"
        >
          {aqiData.map((city, index) => {
            const value = city[selectedMetric];
            return (
              <Marker
                key={index}
                coordinate={{ latitude: city.lat, longitude: city.lon }}
              >
                <StyledView
                  className="rounded-full border-2 border-white items-center justify-center"
                  style={{
                    backgroundColor: getColor(value),
                    padding: 10,
                    minWidth: 40,
                  }}
                >
                  <StyledText className="text-white font-bold">
                    {value}
                  </StyledText>
                </StyledView>
              </Marker>
            );
          })}
        </MapViewCluster>
      )}
    </StyledView>
  );
};

export default AQIMapScreen;
