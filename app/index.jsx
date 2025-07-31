import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StatusBar } from "react-native";
import AQITrendsScreen from "./screens/AQITrendsScreen";
import ForecastScreen from "./screens/ForecastScreen";
import HeatMapScreen from "./screens/HeatMapScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen"

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        initialRouteName="HeatMap"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home")
              iconName = focused ? "home" : "home-outline";
            else if (route.name === "Forecast")
              iconName = focused ? "trending-up" : "trending-up-outline";
            else if (route.name === "HeatMap")
              iconName = focused ? "locate" : "locate-outline";
            else if (route.name === "Trends")
              iconName = focused ? "map" : "map-outline";
            else if (route.name === "Settings")
              iconName = focused ? "settings" : "settings-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#a855f7",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Forecast" component={ForecastScreen} />
        <Tab.Screen name="HeatMap" component={HeatMapScreen} />
        <Tab.Screen name="Trends" component={AQITrendsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}
