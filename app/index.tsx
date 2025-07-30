import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StatusBar } from "react-native";
import DetailsScreen from "./screens/DetailsScreen";
import HeatMapScreen from "./screens/HeatMapScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import LanguageScreen from "./screens/LanguageScreen";

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        initialRouteName="Home"
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
            else if (route.name === "Language")
              iconName = focused ? "language" : "language-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Forecast" component={DetailsScreen} />
        <Tab.Screen name="HeatMap" component={HeatMapScreen} />
        <Tab.Screen name="Trends" component={HistoryScreen} />
        <Tab.Screen name="Language" component={LanguageScreen} />
      </Tab.Navigator>
    </>
  );
}
