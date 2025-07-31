import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import {
  Settings as SettingsIcon,
  Bell,
  MapPin,
  Palette,
  Shield,
  Database,
  Info,
} from "lucide-react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState("auto");
  const [aqiThreshold, setAqiThreshold] = useState(100);
  const [language, setLanguage] = useState("en");
  const [customLocation, setCustomLocation] = useState("");

  const languages = [
    { id: "en", name: "English" },
    { id: "hi", name: "Hindi" },
    { id: "bn", name: "Bengali" },
    { id: "te", name: "Telugu" },
    { id: "mr", name: "Marathi" },
    { id: "ta", name: "Tamil" },
  ];

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => Alert.alert("Data Cleared", "All data has been cleared."),
        },
      ]
    );
  };

  return (
    <ScrollView className="bg-gray-50 dark:bg-slate-900 px-4 py-6">
      <View className="flex-row items-center mb-6 space-x-2">
        <SettingsIcon size={24} color="#64748b" />
        <Text className="text-2xl font-bold text-slate-700 dark:text-white">
          Settings
        </Text>
      </View>

      {/* Location Settings */}
      <View className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-6 space-y-4 shadow-sm">
        <Text className="text-lg font-semibold text-slate-700 dark:text-white mb-5">
          <MapPin size={18} /> Location Settings
        </Text>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-medium text-slate-600 dark:text-slate-200">
              Location Access
            </Text>
            <Text className="text-sm text-gray-500">
              Allow app to access location for accurate data
            </Text>
          </View>
          <Switch value={locationAccess} onValueChange={setLocationAccess} />
        </View>

        {selectedLocation === "custom" && (
          <TextInput
            className="border border-slate-300 rounded-xl px-4 py-2 text-slate-700"
            placeholder="Enter city or coordinates"
            value={customLocation}
            onChangeText={setCustomLocation}
          />
        )}
      </View>

      {/* Notifications */}
      <View className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-6 space-y-4 shadow-sm">
        <Text className="text-lg font-semibold text-slate-700 dark:text-white mb-5">
          <Bell size={18} /> Notifications
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="mb-5">
            <Text className="font-medium text-slate-600">Enable Notifications</Text>
            <Text className="text-sm text-gray-500">Air quality alerts & updates</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View className="flex-row justify-between items-center">
          <View className="mb-5">
            <Text className="font-medium text-slate-600">Health Alerts</Text>
            <Text className="text-sm text-gray-500">Warn on hazardous conditions</Text>
          </View>
          <Switch value={healthAlerts} onValueChange={setHealthAlerts} />
        </View>

        <View>
          <Text className="font-medium text-slate-600 mb-1">
            AQI Alert Threshold: {aqiThreshold}
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={500}
            step={10}
            value={aqiThreshold}
            onValueChange={setAqiThreshold}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#cbd5e1"
          />
        </View>
      </View>

      {/* Auto Refresh */}
      <View className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-6 space-y-4 shadow-sm">
        <Text className="text-lg font-semibold text-slate-700 dark:text-white mb-5">
          <Database size={18} /> Data Refresh
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="mb-5">
            <Text className="font-medium text-slate-600">Auto Refresh</Text>
            <Text className="text-sm text-gray-500">Update data in background</Text>
          </View>
          <Switch value={autoRefresh} onValueChange={setAutoRefresh} />
        </View>

        <View className="mb-5">
          <Text className="font-medium text-slate-600 mb-1">
            Refresh Interval: {refreshInterval} min
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={60}
            step={1}
            value={refreshInterval}
            onValueChange={setRefreshInterval}
            disabled={!autoRefresh}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#cbd5e1"
          />
        </View>
      </View>

      {/* Display & Language */}
      <View className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-6 space-y-4 shadow-sm">
        <Text className="text-lg font-semibold text-slate-700 dark:text-white mb-5">
          <Palette size={18} /> Display & Language
        </Text>

        <View>
          <Text className="font-medium text-slate-600 mb-1">Language</Text>
          <View className="border rounded-xl border-slate-300 overflow-hidden">
            <Picker selectedValue={language} onValueChange={setLanguage} style={{ color: "#334155" }}>
              {languages.map((lang) => (
                <Picker.Item key={lang.id} label={lang.name} value={lang.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Privacy & About */}
      <View className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-6 space-y-4 shadow-sm">
        <Text className="text-lg font-semibold text-slate-700 dark:text-white mb-5">
          <Shield size={18} /> Privacy & Info
        </Text>

        <TouchableOpacity
          className="bg-red-100 py-2 rounded-lg mt-2"
          onPress={clearAllData}
        >
          <Text className="text-center text-red-600 font-semibold">Clear All Data</Text>
        </TouchableOpacity>

        <View className="mt-4 space-y-2">
          <Text className="text-sm text-gray-500 text-center">© 2025 Air Quality Monitor</Text>
        </View>
      </View>
    </ScrollView>
  );
}
