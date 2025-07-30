import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 32;

const getAQIColorHex = (aqi) => {
  if (aqi <= 50) return "#4ade80";
  if (aqi <= 100) return "#15803d";
  if (aqi <= 200) return "#facc15";
  if (aqi <= 300) return "#f97316";
  if (aqi <= 400) return "#ef4444";
  return "#b91c1c";
};

const weeklyData = [
  { date: "Jul 24", aqi: 45 },
  { date: "Jul 25", aqi: 67 },
  { date: "Jul 26", aqi: 85 },
  { date: "Jul 27", aqi: 110 },
  { date: "Jul 28", aqi: 160 },
  { date: "Jul 29", aqi: 120 },
  { date: "Jul 30", aqi: 95 },
];

const aiPrediction = [
  { date: "Jul 31", aqi: 105, confidence: 91 },
  { date: "Aug 01", aqi: 125, confidence: 88 },
  { date: "Aug 02", aqi: 98, confidence: 93 },
];

const predictionChartData = {
  labels: aiPrediction.map((item) => item.date),
  datasets: [
    {
      data: aiPrediction.map((item) => item.aqi),
      strokeWidth: 2,
    },
  ],
};

export default function ForecastScreen() {
  const [chartType, setChartType] = useState("weekly");

  const chartData = {
    labels: weeklyData.map((item) => item.date),
    datasets: [
      {
        data: weeklyData.map((item) => item.aqi),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold mb-10">Weekly AQI Overview</Text>

      <View className="flex-row flex-wrap justify-between gap-4 mb-10 px-3">
        {weeklyData.map((item, index) => (
          <View
            key={index}
            className="w-[46%] p-5 rounded-2xl border border-gray-300 bg-white shadow-md"
          >
            <View className="items-center">
              {/* Date */}
              <Text className="text-sm font-semibold text-gray-800 mb-2">
                {item.date}
              </Text>

              {/* AQI Value Badge */}
              <View
                className="px-4 py-1 rounded-full mb-3"
                style={{ backgroundColor: getAQIColorHex(item.aqi) }}
              >
                <Text className="text-white font-bold text-lg">{item.aqi}</Text>
              </View>

              {/* Confidence */}
              <Text className="text-xs text-gray-600 text-center">
                Confidence: <Text className="font-medium">100%</Text>
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-6">
        <View className="flex-row mb-2">
          <TouchableOpacity
            onPress={() => setChartType("weekly")}
            className={`mr-2 px-3 py-1 rounded-full ${
              chartType === "weekly" ? "bg-indigo-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-medium">Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChartType("monthly")}
            className={`px-3 py-1 rounded-full ${
              chartType === "monthly" ? "bg-indigo-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-medium">Monthly</Text>
          </TouchableOpacity>
        </View>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: () => "#111827",
            propsForDots: {
              r: "4",
              strokeWidth: "1",
              stroke: "#3b82f6",
            },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>

      <View className="mt-8">
        <Text className="text-xl font-bold mb-3">
          AI Forecast (Next 3 Days)
        </Text>

        <View className="flex-row gap-4 mb-10">
          {aiPrediction.map((item, index) => (
            <View
              key={index}
              className="w-30 p-5 rounded-2xl border border-gray-300 bg-white shadow-md"
            >
              <View className="items-center">
                {/* Date */}
                <Text className="text-sm font-semibold text-gray-800 mb-2">
                  {item.date}
                </Text>

                {/* AQI Value Badge */}
                <View
                  className="px-4 py-1 rounded-full mb-3"
                  style={{ backgroundColor: getAQIColorHex(item.aqi) }}
                >
                  <Text className="text-white font-bold text-lg">
                    {item.aqi}
                  </Text>
                </View>

                {/* Confidence */}
                <Text className="text-xs text-gray-600">
                  Confidence:{" "}
                  <Text className="font-medium">{item.confidence}%</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mb-20">
          <LineChart
            data={predictionChartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              labelColor: () => "#111827",
              propsForDots: {
                r: "4",
                strokeWidth: "1",
                stroke: "#10b981",
              },
            }}
            style={{ borderRadius: 12 }}
            className="mb-20"
          />
        </View>
      </View>
    </ScrollView>
  );
}
