import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Loader from "../components/Loader";
import LocationData from "../components/LocationData";
import { getAQIColorHex } from "../helpers/AQIHelpers";

const screenWidth = Dimensions.get("window").width - 22;

export default function ForecastScreen() {
  const [loading, setLoading] = useState(true);
  const [aqiOverallData, setAqiOverallData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [location, setLocation] = useState(null);
  const isFocused = useIsFocused();

  const fetchAQIFromLocation = async () => {
    try {
      setLoading(true);
      // if (!location?.lat || !location?.lon) {
      //   console.warn("Location data is missing:", location);
      //   setLoading(false);
      // }

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
    } catch (err) {
      console.log(err);
      console.log(JSON.stringify(err));
    }
  };

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("smartaqi-location");
      if (data) {
        setLocation(JSON.parse(data));
      }
      // console.log("Location ", JSON.parse(data));
      await fetchAQIFromLocation(JSON.parse(data));
      await fetchAQIData(JSON.parse(data));
      setLoading(false);
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
      console.log("Fetched AQI Pollutants Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching AQI pollutants:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertApiResponseToInputJson = async (data) => {
    const length = data?.PM25_pred?.length;
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

  async function fetchAQIData(location) {
    try {
      const pollutants = await fetchaqiPollutants(location?.lat, location?.lon);
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

  if (loading || !aqiOverallData) {
    return <Loader text="Loading Data..." />;
  }

  return (
    <ScrollView className="flex-1 px-4 pt-6 bg-white">
      <Text className="mb-5 text-2xl font-bold">Weekly AQI Overview</Text>
      <View className="justify-center flex-1 bg-white">
        <LocationData location={location.name} />
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
