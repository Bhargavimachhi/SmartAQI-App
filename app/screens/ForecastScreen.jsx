import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Loader from "../components/Loader";
import LocationPickerButton from "../components/LocationPickerButton";
import LocationPickerMap from "../components/LocationPickerMap";
import { getAQIColorHex, getHealthTips } from "../helpers/AQIHelpers";
import LocationData from "../components/LocationData";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width - 22;

export default function ForecastScreen() {
  const [chartType, setChartType] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [aqiWeeklyData, setAqiWeeklyData] = useState(null);
  const [aqiMonthlyData, setAqiMonthlyData] = useState(null);
  const [aqiOverallData, setAqiOverallData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [healthTips, setHealthTips] = useState(null);
  const [aqiColor, setAqiColor] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const fetchWeeklydata = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/HistoryAQIData?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setAqiWeeklyData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMonthlydata = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/HistoryAQIDataMonthly?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setAqiMonthlyData(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAQIFromLocation = async () => {
    try {
      if (!location?.lat || !location?.lon) {
        console.warn("Location data is missing:", location);
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/rural_aqi`,
        {
          lat: location?.lat,
          lon: location?.lon,
        }
      );

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
      console.log(JSON.stringify(err));
    }
  };

  const fetchLocation = async () => {
    try {
      const data = await AsyncStorage.getItem("smartaqi-location");
      if (data) {
        setLocation(JSON.parse(data));
      }
      // console.log("Location ", JSON.parse(data));
      // await fetchAQIFromLocation();
      // await fetchAQIData();
    } catch (error) {
      console.error("Error fetching location from AsyncStorage:", error);
    }
  };

  const fetchaqiPollutants = async (lat, lon) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/aqi_forecasting`,
        {
          method: "POST", // ✅ method should be inside this object
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: lat,
            lon: lon,
            PM25: aqiData?.pm25 || 32,
            PM10: aqiData?.pm10 || 86,
            NO2: aqiData?.no2 || 13,
            SO2: aqiData?.so2 || 12,
            O3: aqiData?.ozone || 20,
          }),
        }
      );

      const data = await response.json();
      // console.log("Fetched AQI Pollutants Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching AQI pollutants:", error);
    } finally {
      setLoading(false);
    }
  };
  const isFocused = useIsFocused();

  const convertApiResponseToInputJson = async (data) => {
    const length = data.PM25_pred.length;
    const result = [];

    for (let i = 0; i < length; i++) {
      result.push({
        "PM2.5": data.PM25_pred[i],
        PM10: data.PM10_pred[i],
        NO2: data.NO2_pred[i],
        SO2: data.SO2_pred[i],
        O3: data.O3_pred[i],
      });
    }

    return result;
  };

  const calculateAQI = (pollutants) => {
    const breakpoints = {
      "PM2.5": [
        [0, 30, 0, 50],
        [31, 60, 51, 100],
        [61, 90, 101, 200],
        [91, 120, 201, 300],
        [121, 250, 301, 400],
        [251, 500, 401, 500],
      ],
      PM10: [
        [0, 50, 0, 50],
        [51, 100, 51, 100],
        [101, 250, 101, 200],
        [251, 350, 201, 300],
        [351, 430, 301, 400],
        [431, 1000, 401, 500],
      ],
      SO2: [
        [0, 40, 0, 50],
        [41, 80, 51, 100],
        [81, 380, 101, 200],
        [381, 800, 201, 300],
        [801, 1600, 301, 400],
        [1601, 2000, 401, 500],
      ],
      NO2: [
        [0, 40, 0, 50],
        [41, 80, 51, 100],
        [81, 180, 101, 200],
        [181, 280, 201, 300],
        [281, 400, 301, 400],
        [401, 1000, 401, 500],
      ],
      O3: [
        [0, 50, 0, 50],
        [51, 100, 51, 100],
        [101, 168, 101, 200],
        [169, 208, 201, 300],
        [209, 748, 301, 400],
        [749, 1000, 401, 500],
      ],
    };

    function calculateIndividualAQI(cp, pollutant) {
      const bpList = breakpoints[pollutant];
      for (let [BP_Lo, BP_Hi, I_Lo, I_Hi] of bpList) {
        if (cp >= BP_Lo && cp <= BP_Hi) {
          return Math.round(
            ((I_Hi - I_Lo) / (BP_Hi - BP_Lo)) * (cp - BP_Lo) + I_Lo
          );
        }
      }
      return null;
    }

    const individualAQIs = {};
    for (const pollutant in pollutants) {
      if (breakpoints.hasOwnProperty(pollutant)) {
        const value = pollutants[pollutant];
        const aqi = calculateIndividualAQI(value, pollutant);
        if (aqi !== null) {
          individualAQIs[pollutant] = aqi;
        }
      }
    }

    const aqiValues = Object.values(individualAQIs);
    if (aqiValues.length === 0) {
      throw new Error(
        "No valid pollutant values provided for AQI calculation."
      );
    }

    const overallAQI = Math.max(...aqiValues);
    const dominantPollutant = Object.keys(individualAQIs).reduce((a, b) =>
      individualAQIs[a] > individualAQIs[b] ? a : b
    );

    return {
      individual_aqis: individualAQIs,
      overall_aqi: overallAQI,
      dominant_pollutant: dominantPollutant,
    };
  };
  async function fetchAQIData() {
      try {
        await fetchWeeklydata(location.lat, location.lon);
        await fetchMonthlydata(location.lat, location.lon);

        const pollutants = await fetchaqiPollutants(
          location.lat, location.lon
        );
        const input_json = await convertApiResponseToInputJson(pollutants);

        const aqiData = input_json.map((data) => calculateAQI(data));

        const overallAqis = aqiData.map((item) => item.overall_aqi);
        setAqiOverallData(overallAqis);

        setLoading(false);
      } catch (err) {
        alert(err);
      }
    }

  useEffect(() => {
    fetchLocation();
  }, [isFocused]);

  const aiPrediction = aqiOverallData?.map((aqi, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1); // +1 for tomorrow, +2 for next day, etc.

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

    return { date: formattedDate, aqi };
  });

  const predictionChartData = {
    labels: aiPrediction?.map((item) => item.date),
    datasets: [
      {
        data: aiPrediction?.map((item) => item.aqi),
        strokeWidth: 2,
      },
    ],
  };
  const formattedWeekly = aqiWeeklyData
    ? Object.entries(aqiWeeklyData).map(([date, value]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        aqi: value.AQI,
      }))
    : [];

  const weeklyChartData = {
    labels: formattedWeekly.map((item) => item.date),
    datasets: [
      {
        data: formattedWeekly.map((item) => item.aqi),
        strokeWidth: 2,
      },
    ],
  };

  const formattedMonthly = aqiMonthlyData
    ? Object.entries(aqiMonthlyData).map(([date, value]) => ({
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

  const chartData = chartType === "weekly" ? weeklyChartData : monthlyChartData;

  if (loading || !aqiWeeklyData || !aqiMonthlyData || !aqiOverallData) {
    return <Loader text="Loading Data..." />;
  }

  return (
    <ScrollView className="flex-1 px-4 pt-6 bg-white">
      <Text className="mb-5 text-2xl font-bold">Weekly AQI Overview</Text>
      <View className="justify-center flex-1 bg-white">
        <LocationData location={location.name}/>
      </View>

      <View className="px-4 mt-4">
        {/* Tab Buttons */}
        <View className="flex-row justify-center p-1 mb-4 bg-gray-200 rounded-full">
          <TouchableOpacity
            onPress={() => setChartType("weekly")}
            className={`flex-1 py-2 rounded-full ${
              chartType === "weekly" ? "bg-indigo-500" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                chartType === "weekly" ? "text-white" : "text-gray-700"
              }`}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChartType("monthly")}
            className={`flex-1 py-2 rounded-full ${
              chartType === "monthly" ? "bg-indigo-500" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                chartType === "monthly" ? "text-white" : "text-gray-700"
              }`}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* AQI Chart */}
        <ScrollView horizontal>
          <LineChart
            data={chartData}
            width={
              chartType == "monthly"
                ? formattedMonthly.length * 50
                : formattedWeekly.length * 60
            } // Adjust width based on number of data points
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
        </ScrollView>
      </View>

      <View className="px-4 mt-10">
        <Text className="mb-5 text-2xl font-extrabold tracking-wide text-gray-800">
          AI Forecast (Next 3 Days)
        </Text>

        <View className="flex-row justify-between gap-4 mb-8">
          {aiPrediction.map((item, index) => (
            <View
              key={index}
              className="items-center flex-1 p-4 bg-white border border-gray-200 shadow-md rounded-2xl"
              style={{ elevation: 3 }}
            >
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                {item.date}
              </Text>

              <View
                className="px-5 py-2 rounded-full"
                style={{ backgroundColor: getAQIColorHex(item.aqi) }}
              >
                <Text className="text-xl font-bold text-white">{item.aqi}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mb-16">
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
            style={{ borderRadius: 16 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
