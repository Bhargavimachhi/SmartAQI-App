import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Card } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

const sampleAQIData = [
  { date: "1 JUl", aqi: 120 },
  { date: "2 Jul", aqi: 160 },
  { date: "3 Jul", aqi: 100 },
  { date: "4 Jul", aqi: 200 },
  { date: "5 Jul", aqi: 80 },
];

const aqiData = {
  "2025-07-02": 42,
  "2025-07-04": 186,
  "2025-07-10": 290,
};

const categoryDistribution = {
  Good: 20,
  Moderate: 40,
  Unhealthy: 25,
  VeryUnhealthy: 10,
  Hazardous: 5,
};

const getAQIColorHex = (aqi) => {
  if (aqi <= 50) return "#4ade80";   // Good
  if (aqi <= 100) return "#15803d";  // Satisfactory
  if (aqi <= 200) return "#facc15";  // Moderate
  if (aqi <= 300) return "#f97316";  // Poor
  if (aqi <= 400) return "#ef4444";  // Very Poor
  return "#b91c1c";                  // Severe
};

const AQITrendsScreen = () => {
  const dates = sampleAQIData.map((item) => item.date);
  const values = sampleAQIData.map((item) => item.aqi);

  return (
    <ScrollView style={{ padding: 16 }} className="bg-white">
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 25 }}>
        AQI Trends
      </Text>

      {/* Summary Cards */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 30,
        }}
      >
        <Card
          style={{ padding: 12, flex: 1, margin: 4, backgroundColor: "white" }}
        >
          <Text style={{ fontSize: 14 }}>Average AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>120</Text>
        </Card>
        <Card
          style={{ padding: 12, flex: 1, margin: 4, backgroundColor: "white" }}
        >
          <Text style={{ fontSize: 14 }}>Peak AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>200</Text>
        </Card>
        <Card
          style={{ padding: 12, flex: 1, margin: 4, backgroundColor: "white" }}
        >
          <Text style={{ fontSize: 14 }}>Lowest AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>80</Text>
        </Card>
      </View>

      {/* AQI Line Chart */}
      <View className="shadow-2xl bg-white rounded-xl p-4 mb-10">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
          AQI Over Time
        </Text>
        <LineChart
          data={{
            labels: dates,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 64}
          height={220}
          yAxisSuffix=" AQI"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f1f5f9",
            backgroundGradientTo: "#f1f5f9",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            labelColor: () => "#333",
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#22c55e" },
          }}
          style={{ marginBottom: 24, borderRadius: 16 }}
        />
      </View>

      {/* Calendar View */}
      <View className="shadow-2xl rounded-xl p-4 bg-white mb-10">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          AQI Calendar
        </Text>
        <Calendar
          markingType="custom"
          markedDates={Object.fromEntries(
            Object.entries(aqiData).map(([date, aqi]) => [
              date,
              {
                customStyles: {
                  container: {
                    backgroundColor: getAQIColorHex(aqi),
                    borderRadius: 100, // circular
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  },
                  text: {
                    color: "white",
                    fontWeight: "bold",
                  },
                },
              },
            ])
          )}
          dayComponent={({ date, state }) => {
            const aqi = aqiData[date.dateString];

            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: aqi ? getAQIColorHex(aqi) : "transparent",
                    width: 32,
                    height: 32,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: aqi
                        ? "white"
                        : state === "disabled"
                        ? "gray"
                        : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {date.day}
                  </Text>
                </View>
                {aqi && (
                  <Text
                    style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}
                  >
                    {aqi}
                  </Text>
                )}
              </View>
            );
          }}
          style={{ marginBottom: 24 }}
        />
      </View>

      {/* Category Distribution */}
      <View className="p-4 shadow-2xl bg-white rounded-xl mb-10">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Category Distribution
        </Text>
        <BarChart
          data={{
            labels: Object.keys(categoryDistribution),
            datasets: [{ data: Object.values(categoryDistribution) }],
          }}
          width={screenWidth - 64}
          height={250}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#3b82f6",
            labelColor: () => "#000",
            style: { borderRadius: 16 },
          }}
          style={{ borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
};

export default AQITrendsScreen;
