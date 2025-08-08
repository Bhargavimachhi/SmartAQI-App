import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Card } from "react-native-paper";
import Loader from "../components/Loader";
import LocationData from "../components/LocationData";
import { PollutantBar } from "../components/PollutantBar";

const screenWidth = Dimensions.get("window").width;
const pollutants = ["aqi", "pm25", "co", "pm10", "no2", "so2", "o3"];

const getAQICategory = (v) =>
  v <= 50
    ? "Good"
    : v <= 100
    ? "Moderate"
    : v <= 200
    ? "Poor"
    : v <= 300
    ? "Unhealthy"
    : v <= 400
    ? "Severe"
    : "Hazardous";
const getPM25Category = (v) =>
  v <= 30
    ? "Good"
    : v <= 60
    ? "Moderate"
    : v <= 90
    ? "Poor"
    : v <= 120
    ? "Unhealthy"
    : v <= 250
    ? "Severe"
    : "Hazardous";
const getPM10Category = (v) =>
  v <= 50
    ? "Good"
    : v <= 100
    ? "Moderate"
    : v <= 250
    ? "Poor"
    : v <= 350
    ? "Unhealthy"
    : v <= 430
    ? "Severe"
    : "Hazardous";
const getCOCategory = (v) =>
  v <= 1
    ? "Good"
    : v <= 2
    ? "Moderate"
    : v <= 10
    ? "Poor"
    : v <= 17
    ? "Unhealthy"
    : v <= 34
    ? "Severe"
    : "Hazardous";
const getNO2Category = (v) =>
  v <= 40
    ? "Good"
    : v <= 80
    ? "Moderate"
    : v <= 180
    ? "Poor"
    : v <= 280
    ? "Unhealthy"
    : v <= 400
    ? "Severe"
    : "Hazardous";
const getSO2Category = (v) =>
  v <= 40
    ? "Good"
    : v <= 80
    ? "Moderate"
    : v <= 380
    ? "Poor"
    : v <= 800
    ? "Unhealthy"
    : v <= 1600
    ? "Severe"
    : "Hazardous";
const getO3Category = (v) =>
  v <= 50
    ? "Good"
    : v <= 100
    ? "Moderate"
    : v <= 168
    ? "Poor"
    : v <= 208
    ? "Unhealthy"
    : v <= 748
    ? "Severe"
    : "Hazardous";

const calculateCategoryDistribution = (data) => {
  const pollutants = {
    aqi: getAQICategory,
    pm25: getPM25Category,
    pm10: getPM10Category,
    co: getCOCategory,
    no2: getNO2Category,
    so2: getSO2Category,
    o3: getO3Category,
  };

  const distribution = {};

  for (const pollutant in pollutants) {
    distribution[pollutant] = {
      Good: 0,
      Moderate: 0,
      Poor: 0,
      Unhealthy: 0,
      Severe: 0,
      Hazardous: 0,
    };
  }

  for (const item of data) {
    for (const pollutant in pollutants) {
      const value = item[pollutant];
      const category = pollutants[pollutant](value);
      distribution[pollutant][category]++;
    }
  }

  return distribution;
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
  return ` ${day.toString().padStart(2, "")}${shortMonth} `;
};

const AQITrendsScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState("aqi");
  const [showMap, setShowMap] = useState(false);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchWeeklyAQIData = async (loc) => {
    try {
      const response = await axios.get(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/HistoryAQIData?lat=${loc.lat}&lon=${loc.lon}`
      );
      const data = response.data;
      const transformed = Object.entries(data).map(([date, values]) => {
        const pollutants = values.pollutants || {};
        return {
          date: date.split("-").reverse().join("-"),
          aqi: values.AQI || 0,
          pm25: pollutants["PM2.5"] || 0,
          co: (pollutants["CO"] || 0) / 100 / 10,
          pm10: pollutants["PM10"] || 0,
          no2: pollutants["NO2"] || 0,
          so2: pollutants["SO2"] || 0,
          o3: pollutants["O3"] || 0,
        };
      });

      setWeeklyData(transformed);
      const categoryWise = calculateCategoryDistribution(transformed);
      setCategoryDistribution(categoryWise);
    } catch (error) {
      console.error("Failed to fetch weekly AQI data", error);
    }
  };

  const fetchMonthlydata = async (loc) => {
    try {
      let { lat, lon } = loc;
      setLoading(true);
      const response = await fetch(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/HistoryAQIDataMonthly?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setMonthlyData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

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
    fetchWeeklyAQIData(JSON.parse(loc));
    fetchMonthlydata(JSON.parse(loc));
  };

  useEffect(() => {
    fetchLocation();
  }, [isFocused]);

  const formattedMonthly = monthlyData
    ? Object.entries(monthlyData).map(([date, value]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        aqi: value.AQI,
      }))
    : [];

  const monthlyChartData = {
    labels: formattedMonthly.map((item) => item.date),
    datasets: [
      {
        data: formattedMonthly.map((item) => item.aqi),
        strokeWidth: 2,
      },
    ],
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView style={{ padding: 12 }} className="bg-white">
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        AQI Trends
      </Text>
      <View className="justify-center flex-1 bg-white">
        <LocationData location={location.name} />
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
          style={{
            padding: 12,
            flex: 1,
            margin: 4,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: getAQIColorHex(getAverageOfSelectedMetrics()),
          }}
        >
          <Text style={{ fontSize: 14 }}>
            Average {selectedMetric.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {getAverageOfSelectedMetrics()}
          </Text>
        </Card>
        <Card
          style={{
            padding: 12,
            flex: 1,
            margin: 4,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: getAQIColorHex(getPeakOfSelectedMetrics()),
          }}
        >
          <Text style={{ fontSize: 14 }}>
            Peak {selectedMetric.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {getPeakOfSelectedMetrics()}
          </Text>
        </Card>
        <Card
          style={{
            padding: 12,
            flex: 1,
            margin: 4,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: getAQIColorHex(getLowestOfSelectedMetrics()),
          }}
        >
          <Text style={{ fontSize: 14 }}>
            Lowest {selectedMetric.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {getLowestOfSelectedMetrics()}
          </Text>
        </Card>
      </View>

      {/* AQI Line Chart */}
      <View className="p-4 mb-10 bg-white shadow-2xl rounded-xl">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
          Weekly {selectedMetric.toUpperCase()} Trends
        </Text>
        <LineChart
          data={{
            labels: datesWeekly,
            datasets: [{ data: valuesWeekly }],
          }}
          width={screenWidth - 50}
          height={300}
          xLabelsOffset={2}
          yAxisSuffix={selectedMetric === "co" ? "mg" : "μg/m³"}
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

      <View className="p-4 mb-10 bg-white shadow-2xl rounded-xl">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Pollution Bar of {selectedMetric.toUpperCase()}
        </Text>
        <PollutantBar pollutant={selectedMetric} value={80} />
      </View>

      {/* <PollutantBar pollutant="pm25" value={36.5} /> */}

      {/* Category Distribution */}
      {categoryDistribution[selectedMetric] && (
        <View className="p-4 mt-5 mb-10 bg-white shadow-2xl rounded-xl">
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
            Category Distribution of {selectedMetric.toUpperCase()}
          </Text>
          <BarChart
            data={{
              labels: Object.keys(categoryDistribution[selectedMetric]),
              datasets: [
                {
                  data: Object.values(categoryDistribution[selectedMetric]),
                },
              ],
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
      )}

      {/* Calendar View */}
      <View className="p-4 mb-10 bg-white shadow-2xl rounded-xl">
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          AQI Calendar
        </Text>
        <Calendar
          markingType="custom"
          markedDates={Object.fromEntries(
            Object.entries(monthlyData).map(([date, obj]) => [
              date,
              {
                customStyles: {
                  container: {
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
            
            const aqi = monthlyData[date.dateString]?.AQI;

            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: aqi ? getAQIColorHex(aqi) : "transparent",
                    width: 32,
                    height: 32,
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
    </ScrollView>
  );
};

export default AQITrendsScreen;
