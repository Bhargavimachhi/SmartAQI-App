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
    <ScrollView className="flex-1 p-4 bg-purple-100">
      <View className="flex-row justify-between items-center mb-10">
        <View>
          <Text className="text-2xl font-bold mb-1">Air Quality</Text>
          <View className="flex-row items-center space-x-2">
            <Feather name="map-pin" size={20} className="mr-2" />
            <Text>{aqiData?.location}</Text>
          </View>
        </View>
      </View>

      <View
        className="bg-white p-14 rounded-xl mb-10"
        style={{ borderColor: aqiColor }}
      >
        <Text className="text-5xl font-bold text-center my-1">
          {aqiData.aqi}
        </Text>
        <Text className="text-center font-bold" style={{ color: aqiColor }}>
          {getAQILabel(aqiData.aqi)}
        </Text>
        <Text className="text-xs text-gray-500 text-center">
          Last updated: {new Date(aqiData?.timestamp).toLocaleTimeString()}
        </Text>
      </View>

      <View className="bg-white p-4 rounded-xl mb-10 p-5">
        <Text className="text-xl font-bold text-base mb-5">
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
          <View key={item.name} className="my-1">
            <View className="flex-row justify-between m-1">
              <Text>{item.name}</Text>
              <Text>{item.value}</Text>
            </View>
            <ProgressBar
              progress={item.value / item.max}
              color={aqiColor}
              style={{ height: 6 }}
            />
          </View>
        ))}
      </View>

      <View className="bg-white p-4 rounded-xl mb-10 p-5">
        <Text className="text-xl font-bold text-base mb-10">
          Weather Conditions
        </Text>

        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] flex-row items-center space-x-2 mb-8">
            <Feather
              name="thermometer"
              size={25}
              className="mr-3"
              color="#ef4444"
            />
            <View>
              <Text className="text-sm font-medium">
                {aqiData?.weather?.temp}°C
              </Text>
              <Text className="text-xs text-gray-500">Temperature</Text>
            </View>
          </View>

          <View className="w-[48%] flex-row items-center space-x-2 mb-8">
            <Feather
              name="droplet"
              size={25}
              className="mr-3"
              color="#3b82f6"
            />
            <View>
              <Text className="text-sm font-medium">
                {aqiData?.weather?.humidity}%
              </Text>
              <Text className="text-xs text-gray-500">Humidity</Text>
            </View>
          </View>

          <View className="w-[48%] flex-row items-center space-x-2 mb-8">
            <Feather name="wind" size={25} className="mr-3" color="#22c55e" />
            <View>
              <Text className="text-sm font-medium">
                {aqiData?.weather?.windSpeed} km/h
              </Text>
              <Text className="text-xs text-gray-500">Wind Speed</Text>
            </View>
          </View>

          <View className="w-[48%] flex-row items-center space-x-2 mb-8">
            <Feather name="eye" size={25} className="mr-3" color="#a855f7" />
            <View>
              <Text className="text-sm font-medium">
                {aqiData?.weather?.pressure}
              </Text>
              <Text className="text-xs text-gray-500">Surface Pressure</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl mb-10">
        <Text className="font-bold text-base mb-2">AI Health Tips</Text>
        {healthTips.map((tip, index) => (
          <Text key={index} className="my-1">
            ⚠️ {tip}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
