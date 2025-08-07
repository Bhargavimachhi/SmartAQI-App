import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";
import "./i18n.js";
import AQIMapScreen from "./screens/AQIMapScreen";
import AQITrendsScreen from "./screens/AQITrendsScreen";
import ForecastScreen from "./screens/ForecastScreen";
import HeatMapScreen from "./screens/HeatMapScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HealthAdvisoryScreen from "./screens/HealthAdvisoryScreen"

const Tab = createBottomTabNavigator();

export default function Index() {
  const { t } = useTranslation();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        initialRouteName="Settings"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case "Home":
                iconName = focused ? "home" : "home-outline";
                break;
              case "Forecast":
                iconName = focused ? "trending-up" : "trending-up-outline";
                break;
              case "AQIMap":
                iconName = focused ? "locate" : "locate-outline";
                break;
              case "HeatMap":
                iconName = focused ? "compass" : "compass-outline";
                break;
              case "Trends":
                iconName = focused ? "map" : "map-outline";
                break;
              case "Settings":
                iconName = focused ? "settings" : "settings-outline";
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#a855f7",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: t("tabs.home") }}
        />
        <Tab.Screen
          name="Forecast"
          component={ForecastScreen}
          options={{ tabBarLabel: t("tabs.forecast") }}
        />
        <Tab.Screen
          name="AQIMap"
          component={AQIMapScreen}
          options={{ tabBarLabel: t("tabs.aqimap") }}
        />
        <Tab.Screen
          name="HeatMap"
          component={HeatMapScreen}
          options={{ tabBarLabel: t("tabs.heatmap") }}
        />
        <Tab.Screen
          name="Trends"
          component={AQITrendsScreen}
          options={{ tabBarLabel: t("tabs.trends") }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: t("tabs.settings") }}
        />
      </Tab.Navigator>
    </>
  );
}
