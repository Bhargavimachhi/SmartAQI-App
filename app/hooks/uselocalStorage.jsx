// useAsyncStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Store AQI and location
export const setAQIToStorage = async (aqi) => {
  try {
    await AsyncStorage.setItem("aqiData", JSON.stringify(aqi));
  } catch (error) {
    console.error("Error saving AQI data", error);
  }
};

// Retrieve AQI
export const getAQIFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("aqiData");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error reading AQI data", error);
    return null;
  }
};

// Store location
export const setLocationInStorage = async (location) => {
  try {
    await AsyncStorage.setItem("aqiLoc", JSON.stringify(location));
  } catch (e) {
    console.error("Failed to store location:", e);
  }
};

export const getLocationFromStorage = async () => {
  try {
    const loc = await AsyncStorage.getItem("aqiLoc");
    return loc ? JSON.parse(loc) : null;
  } catch (e) {
    console.error("Failed to retrieve location:", e);
    return null;
  }
};
