import { Feather } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
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
  const LOCATIONS = [
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Bengaluru", value: "Bengaluru" },
  ];

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAqiData((prev) => ({
      ...prev,
      aqi: Math.floor(Math.random() * 200) + 50,
      timestamp: new Date().toISOString(),
    }));
    setIsRefreshing(false);
  };

  const healthTips = getHealthTips(20);
  const aqiColor = getAQIColorHex(20);

  useEffect(() => {
    async function fetchAQIData() {
      try {
        const res = await axios.get(
          `https://aqi-api-m25p.vercel.app/air-quality?latitude=22.34&longitude=72.34`
        );
        const dataObj = res.data[0];
        const data = {
          aqi: dataObj["NearestAQI"],
          pm25: dataObj["PM_2_Level"],
          pm10: dataObj["PM_10_Level"],
          o3: dataObj["O3_Level"],
          no2: dataObj["NO2_Level"],
          so2: dataObj["SO2_Level"],
          co: dataObj["CO_Level"],
          nh3: dataObj["NH3_Level"],
          location: dataObj["StationName"],
          timestamp: new Date().toISOString(),
          weather: {
            temp: dataObj["temperature"],
            humidity: dataObj["relative_humidity"],
            windSpeed: dataObj["wind_speed"],
            pressure: dataObj["surface_pressure"],
          },
        };
        setAqiData(data);
      } catch (err) {
        alert(err);
      }
    }
    fetchAQIData();
  }, []);

  if (!aqiData) {
    return <Loader text="Loading AQI Data..." />;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className="flex-row justify-between items-center mb-10">
        <View>
          <Text className="text-2xl font-bold mb-1 text-gray-900">
            Air Quality
          </Text>
          <View className="flex-row items-center space-x-2">
            <Feather name="map-pin" size={20} color="#6b7280" />
            <Text className="text-sm text-gray-600">{aqiData?.location}</Text>
          </View>
        </View>
      </View>

      {/* AQI Box */}
      <View
        className="bg-white p-10 rounded-xl mb-10 border shadow-sm"
        style={{ borderColor: aqiColor, borderWidth: 1 }}
      >
        <Text className="text-5xl font-bold text-center my-1 text-gray-800">
          {aqiData.aqi}
        </Text>
        <Text
          className="text-center font-bold text-base"
          style={{ color: aqiColor }}
        >
          {getAQILabel(aqiData.aqi)}
        </Text>
        <Text className="text-xs text-gray-500 text-center mt-1">
          Last updated: {new Date(aqiData?.timestamp).toLocaleTimeString()}
        </Text>
      </View>

      {/* Pollutant Levels */}
      <View className="bg-white p-5 rounded-xl mb-10 border border-gray-200 shadow-sm">
        <Text className="text-xl font-bold mb-5 text-gray-800">
          Pollutant Levels
        </Text>
        {[
          { name: "PM2.5", value: aqiData.pm25, max: 100 },
          { name: "PM10", value: aqiData.pm10, max: 150 },
          { name: "NH3", value: aqiData.nh3, max: 150 },
          { name: "O₃", value: aqiData.o3, max: 100 },
          { name: "NO₂", value: aqiData.no2, max: 80 },
          { name: "SO₂", value: aqiData.so2, max: 50 },
          { name: "CO", value: aqiData.co, max: 2 },
        ].map((item) => (
          <View key={item.name} className="my-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-700">{item.name}</Text>
              <Text className="text-sm text-gray-700">{item.value}</Text>
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
      <View className="bg-white p-5 rounded-xl mb-10 border border-gray-200 shadow-sm">
        <Text className="text-xl font-bold mb-6 text-gray-800">
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
              icon: "eye",
              label: "Surface Pressure",
              value: aqiData?.weather?.pressure,
              color: "#a855f7",
            },
          ].map((item, index) => (
            <View
              key={index}
              className="w-[48%] flex-row items-center space-x-2 mb-6"
            >
              <Feather name={item.icon} size={24} color={item.color} />
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
      <View className="bg-white p-5 rounded-xl mb-10 border border-gray-200 shadow-sm">
        <Text className="font-bold text-base text-gray-800 mb-2">
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
