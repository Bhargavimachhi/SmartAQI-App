import { Feather } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import { ChevronRight, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ProgressBar } from "react-native-paper";
import Loader from "../components/Loader";

const getAQIColorHex = (aqi) => {
  if (aqi <= 50) return "#4ade80";
  if (aqi <= 100) return "#15803d";
  if (aqi <= 200) return "#facc15";
  if (aqi <= 300) return "#f97316";
  if (aqi <= 400) return "#ef4444";
  return "#b91c1c";
};

const getAQILabel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const getHealthTips = (aqi) => {
  if (aqi <= 50)
    return [
      "Perfect air quality! Great time for outdoor activities.",
      "Consider keeping windows open for fresh air circulation.",
      "Ideal conditions for morning jogs and outdoor exercise.",
    ];
  if (aqi <= 100)
    return [
      "Air quality is acceptable for most people.",
      "Sensitive individuals should limit prolonged outdoor exertion.",
      "Good time for outdoor activities with minor precautions.",
    ];
  if (aqi <= 150)
    return [
      "Sensitive groups should reduce outdoor activities.",
      "Consider wearing a mask if you have respiratory conditions.",
      "Keep windows closed and use air purifiers indoors.",
    ];
  if (aqi <= 200)
    return [
      "Everyone should limit outdoor activities.",
      "Wear N95 masks when going outside.",
      "Keep windows closed and use HEPA air purifiers.",
    ];
  return [
    "Avoid all outdoor activities.",
    "Stay indoors with air purifiers running.",
    "Emergency health alert - seek medical advice if experiencing symptoms.",
  ];
};

export default function HomeScreen() {
  const [aqiData, setAqiData] = useState(null);
  const [healthTips, setHealthTips] = useState(null);
  const [aqiColor, setAqiColor] = useState(null);
  const [location, setLocation] = useState({
    latitude: 22.3084577,
    longitude: 73.2265893,
    name: "Vadodara",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleMapPress = async (e) => {
    await getAddressFromCoords(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude
    );
  };

  const handleConfirmLocation = async (e) => {
    setModalVisible(false);
    await fetchAQIFromLocation(location.latitude, location.longitude);
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setLocation({
        latitude: latitude,
        longitude: longitude,
        name: place.city + ", " + place.region + ", " + place.postalCode,
      });
    } catch (err) {
      console.log(err);
    }
  };

  async function fetchAQIFromLocation(lat, lon) {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/rural_aqi`,
        {
          lat: lat,
          lon: lon,
        }
      );
      await getAddressFromCoords(lat, lon);
      // const dataObj = res.data[0];
      const dataObj = {};

      res.data["data"].forEach((item) => {
        dataObj[item.key] = item.value;
      });

      // Optionally include other fields like dominant pollutant and rural AQI
      dataObj.dominant_pollutant = res.data.dominant_pollutant;
      dataObj.rural_aqi = res.data.rural_aqi;
      setAqiColor(getAQIColorHex(dataObj["rural_aqi"]));
      setHealthTips(getHealthTips(dataObj["rural_aqi"]));
      const data = {
        aqi: dataObj["rural_aqi"],
        pm25: dataObj["PM2.5"],
        pm10: dataObj["PM10"],
        no2: dataObj["NO2"],
        so2: dataObj["SO2"],
        ozone: dataObj["OZONE"],
        co: dataObj["CO"],
        nh3: dataObj["NH3"],
        dominantPollutant: dataObj["dominant_pollutant"],
        timestamp: new Date().toISOString(),
        weather: {
          temp: dataObj["temperature"],
          humidity: dataObj["relative_humidity"],
          windSpeed: dataObj["wind_speed"],
          windDirection: dataObj["wind_direction"],
          cloudCover: dataObj["cloud_cover"],
          pressure: dataObj["surface_pressure"],
        },
      };
      setAqiData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchAQIData() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        await fetchAQIFromLocation(loc.coords.latitude, loc.coords.longitude);
      } catch (err) {
        alert(err);
      }
    }
    fetchAQIData();
  }, []);

  if (loading) {
    return <Loader text="Loading Data..." />;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className="flex-row items-center justify-between mb-10">
        <View>
          <Text className="mb-1 text-2xl font-bold text-gray-900">
            Air Quality
          </Text>
          <View className="flex-1 p-4 bg-white">
            {/* Row with Location and Arrow */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border rounded-xl"
              onPress={() => setModalVisible(true)}
            >
              <View className="flex-row items-center space-x-2">
                <MapPin size={20} color="black" />
                <Text className="text-base text-black">{location.name}</Text>
              </View>
              <ChevronRight size={20} color="gray" />
            </TouchableOpacity>

            {/* Modal Map Picker */}
            <Modal visible={modalVisible} animationType="slide">
              <View className="flex-1">
                <MapView
                  style={StyleSheet.absoluteFillObject}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onPress={handleMapPress}
                >
                  <Marker
                    coordinate={location}
                    draggable
                    onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
                  />
                </MapView>

                <TouchableOpacity
                  className="absolute p-4 bg-blue-600 bottom-10 left-5 right-5 rounded-xl"
                  onPress={handleConfirmLocation}
                >
                  <Text className="font-semibold text-center text-white">
                    Confirm Location
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>
      </View>

      {/* AQI Box */}
      <View
        className="p-10 mb-10 bg-white border shadow-sm rounded-xl"
        style={{ borderColor: aqiColor, borderWidth: 1 }}
      >
        <Text className="my-1 text-5xl font-bold text-center text-gray-800">
          {aqiData.aqi}
        </Text>
        <Text
          className="text-base font-bold text-center"
          style={{ color: aqiColor }}
        >
          {getAQILabel(aqiData.aqi)}
        </Text>
        <Text className="mt-1 text-xs text-center text-gray-500">
          Last updated: {new Date(aqiData?.timestamp).toLocaleTimeString()}
        </Text>
      </View>

      {/* Pollutant Levels */}
      <View className="p-5 mb-10 bg-white border border-gray-200 shadow-sm rounded-xl">
        <Text className="mb-5 text-xl font-bold text-gray-800">
          Pollutant Levels
        </Text>
        {[
          { name: "PM2.5", value: aqiData.pm25, max: 100, unit: "μg/m³" },
          { name: "PM10", value: aqiData.pm10, max: 150, unit: "μg/m³" },
          { name: "NH3", value: aqiData.nh3, max: 150, unit: "μg/m³" },
          { name: "Ozone", value: aqiData.ozone, max: 100, unit: "μg/m³" },
          { name: "NO₂", value: aqiData.no2, max: 80, unit: "μg/m³" },
          { name: "SO₂", value: aqiData.so2, max: 50, unit: "μg/m³" },
          { name: "CO", value: aqiData.co, max: 1, unit: "mg" },
        ].map((item) => (
          <View key={item.name} className="my-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-700">{item.name}</Text>
              <Text className="text-sm text-gray-700">
                {item.value} {item.unit}
              </Text>
            </View>
            <ProgressBar
              progress={item.value / item.max}
              color={aqiColor}
              style={{ height: 6, borderRadius: 4 }}
            />
          </View>
        ))}
      </View>

      {/* Weather Info */}
      <View className="p-5 mb-10 bg-white border border-gray-200 shadow-sm rounded-xl">
        <Text className="mb-6 text-xl font-bold text-gray-800">
          Weather Conditions
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {[
            {
              icon: "thermometer",
              label: "Temperature",
              value: `${aqiData?.weather?.temp}°C`,
              color: "#ef4444",
            },
            {
              icon: "droplet",
              label: "Humidity",
              value: `${aqiData?.weather?.humidity}%`,
              color: "#3b82f6",
            },
            {
              icon: "wind",
              label: "Wind Speed",
              value: `${aqiData?.weather?.windSpeed} km/h`,
              color: "#22c55e",
            },
            {
              icon: "wind",
              label: "Wind Direction",
              value: `${aqiData?.weather?.windDirection} `,
              color: "#15803d",
            },
            {
              icon: "eye",
              label: "Surface Pressure",
              value: aqiData?.weather?.pressure,
              color: "#a855f7",
            },
            {
              icon: "cloud",
              label: "Cloud Cover",
              value: aqiData?.weather?.cloudCover,
              color: "#4f4f4fff",
            },
          ].map((item, index) => (
            <View
              key={index}
              className="w-[48%] flex-row items-center space-x-2 mb-6"
            >
              <Feather
                name={item.icon}
                size={24}
                color={item.color}
                className="mr-3"
              />
              <View>
                <Text className="text-sm font-medium text-gray-800">
                  {item.value}
                </Text>
                <Text className="text-xs text-gray-500">{item.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Health Tips */}
      <View className="p-5 mb-10 bg-white border border-gray-200 shadow-sm rounded-xl">
        <Text className="mb-2 text-base font-bold text-gray-800">
          AI Health Tips
        </Text>
        {healthTips.map((tip, index) => (
          <Text key={index} className="my-1 text-sm text-gray-700">
            ⚠️ {tip}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
