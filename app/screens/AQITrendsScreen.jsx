import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Card } from "react-native-paper";
import LocationPickerButton from "../components/LocationPickerButton";
import LocationPickerMap from "../components/LocationPickerMap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";

const screenWidth = Dimensions.get("window").width;
const pollutants = ["aqi", "pm25", "co", "pm10", "no2", "so2", "o3"];

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
  if (aqi <= 50) return "#4ade80"; // Good
  if (aqi <= 100) return "#15803d"; // Satisfactory
  if (aqi <= 200) return "#facc15"; // Moderate
  if (aqi <= 300) return "#f97316"; // Poor
  if (aqi <= 400) return "#ef4444"; // Very Poor
  return "#b91c1c"; // Severe
};

const formatDateToShortMonth = (dateStr) => {
  const [day, month, year] = dateStr.split("-").map(Number);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const shortMonth = monthNames[month - 1];
  return `${day.toString().padStart(2, "0")} ${shortMonth}`;
};

const AQITrendsScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState("aqi");
  const [showMap, setShowMap] = useState(false);
  const weeklyData = [
    {
      date: "01-08-2025",
      aqi: 120,
      pm25: 60,
      co: 0.9,
      pm10: 90,
      no2: 35,
      so2: 12,
      o3: 25,
    },
    {
      date: "02-08-2025",
      aqi: 160,
      pm25: 80,
      co: 1.1,
      pm10: 100,
      no2: 40,
      so2: 18,
      o3: 28,
    },
    {
      date: "03-08-2025",
      aqi: 100,
      pm25: 45,
      co: 0.7,
      pm10: 85,
      no2: 30,
      so2: 10,
      o3: 22,
    },
    {
      date: "04-08-2025",
      aqi: 200,
      pm25: 95,
      co: 1.3,
      pm10: 120,
      no2: 50,
      so2: 25,
      o3: 33,
    },
    {
      date: "05-08-2025",
      aqi: 80,
      pm25: 40,
      co: 0.6,
      pm10: 75,
      no2: 28,
      so2: 8,
      o3: 18,
    },
    {
      date: "06-08-2025",
      aqi: 150,
      pm25: 70,
      co: 1.0,
      pm10: 95,
      no2: 38,
      so2: 15,
      o3: 27,
    },
    {
      date: "07-08-2025",
      aqi: 130,
      pm25: 65,
      co: 0.8,
      pm10: 92,
      no2: 34,
      so2: 11,
      o3: 24,
    },
  ];

  const datesWeekly = weeklyData.map((item) =>
    formatDateToShortMonth(item.date)
  );
  const valuesWeekly = weeklyData.map((item) => item[selectedMetric]);

  const getAverageOfSelectedMetrics = () => {
    let total = 0;
    weeklyData.map((data) => {
      total += data[selectedMetric];
    });
    return Math.round((total / 7) * 10000) / 10000;
  };

  const getPeakOfSelectedMetrics = () => {
    let max = -Infinity;
    weeklyData.map((data) => {
      if (data[selectedMetric] > max) max = data[selectedMetric];
    });
    return Math.round(max * 100) / 100;
  };

  const getLowestOfSelectedMetrics = () => {
    let min = Infinity;
    weeklyData.map((data) => {
      if (data[selectedMetric] < min) min = data[selectedMetric];
    });
    return Math.round(min * 100) / 100;
  };

  const [location, setLocation] = useState(null);
  const fetchLocation = async () => {
    const loc = await AsyncStorage.getItem("smartaqi-location");
    if (loc) {
      setLocation(JSON.parse(loc));
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [showMap]);

  if(!location) {
    return <Loader />
  }

  return (
    <ScrollView style={{ padding: 16 }} className="bg-white">
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        AQI Trends
      </Text>
      <View className="flex-1 bg-white justify-center">
        <LocationPickerButton
          onPress={() => setShowMap(true)}
          location={location.name}
        />
        <LocationPickerMap
          visible={showMap}
          onClose={() => {
            setShowMap(false);
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Picker
          selectedValue={selectedMetric}
          onValueChange={(itemValue) => setSelectedMetric(itemValue)}
          style={{
            backgroundColor: "#f3f4f6",
            borderRadius: 8,
            color: "#1f2937",
            marginBottom: 12,
          }}
        >
          {pollutants.map((metric) => (
            <Picker.Item
              key={metric}
              label={metric.toUpperCase()}
              value={metric}
            />
          ))}
        </Picker>
      </View>

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
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {getAverageOfSelectedMetrics()}
          </Text>
        </Card>
        <Card
          style={{ padding: 12, flex: 1, margin: 4, backgroundColor: "white" }}
        >
          <Text style={{ fontSize: 14 }}>Peak AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {getPeakOfSelectedMetrics()}
          </Text>
        </Card>
        <Card
          style={{ padding: 12, flex: 1, margin: 4, backgroundColor: "white" }}
        >
          <Text style={{ fontSize: 14 }}>Lowest AQI</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {getLowestOfSelectedMetrics()}
          </Text>
        </Card>
      </View>

      {/* AQI Line Chart */}
      <View className="shadow-2xl bg-white rounded-xl p-4 mb-10">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
          Weekly {selectedMetric.toUpperCase()} Trends
        </Text>
        <LineChart
          data={{
            labels: datesWeekly,
            datasets: [{ data: valuesWeekly }],
          }}
          width={screenWidth - 50}
          height={220}
          yAxisSuffix={selectedMetric === "co" ? " ppm" : ""}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f1f5f9",
            backgroundGradientTo: "#f1f5f9",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: () => "#333",
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#3b82f6" },
          }}
          style={{ borderRadius: 16 }}
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
