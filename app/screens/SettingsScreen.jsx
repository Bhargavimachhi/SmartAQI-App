import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import {
  Bell,
  MapPin,
  Palette,
  Settings as SettingsIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, Text, TextInput, View } from "react-native";
import Loader from "../components/Loader";
import LocationPickerButton from "../components/LocationPickerButton";
import LocationPickerMap from "../components/LocationPickerMap";
import "../i18n"; // Make sure i18n is initialized

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("auto");
  const [language, setLanguage] = useState(i18n.language || "en");
  const [customLocation, setCustomLocation] = useState("");
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    const loc = await AsyncStorage.getItem("smartaqi-location");
    if (loc) {
      setLocation(JSON.parse(loc));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocation();
  }, [showMap]);

  if (loading) {
    return <Loader />;
  }

  const languages = [
    { id: "en", name: "English" },
    { id: "hi", name: "हिन्दी" },
    { id: "gu", name: "ગુજરાતી" },
  ];

  const changeAppLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <ScrollView className="px-4 py-6 bg-gray-50">
      <View className="flex-row items-center mb-6 space-x-2">
        <SettingsIcon size={24} color="#64748b" />
        <Text className="text-2xl font-bold text-slate-700">
          {t("settingspage.title")}
        </Text>
      </View>

      {/* Location Settings */}
      <View className="p-6 mb-6 space-y-4 bg-white shadow-sm rounded-xl">
        <Text className="mb-5 text-lg font-semibold text-slate-700">
          <MapPin size={18} /> {t("settingspage.location_settings")}
        </Text>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-medium text-slate-600 ">
              {t("settingspage.location_access")}
            </Text>
            <Text className="text-sm text-gray-500">
              {t("settingspage.location_access_desc")}
            </Text>
          </View>
          <Switch value={locationAccess} onValueChange={setLocationAccess} />
        </View>

        {selectedLocation === "custom" && (
          <TextInput
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700"
            placeholder={t("settingspage.enter_custom_location")}
            value={customLocation}
            onChangeText={setCustomLocation}
          />
        )}
        <View className="justify-center flex-1 bg-white">
          <LocationPickerButton
            onPress={() => setShowMap(true)}
            location={location?.name}
          />
          <LocationPickerMap
            visible={showMap}
            onClose={() => {
              setShowMap(false);
            }}
          />
        </View>
      </View>

      {/* Notifications */}
      <View className="p-6 mb-6 space-y-4 bg-white shadow-sm rounded-xl">
        <Text className="mb-5 text-lg font-semibold text-slate-700">
          <Bell size={18} /> {t("settingspage.notifications_title")}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="mb-5">
            <Text className="font-medium text-slate-600">
              {t("settingspage.enable_notifications")}
            </Text>
            <Text className="text-sm text-gray-500">
              {t("settingspage.enable_notifications_desc")}
            </Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="mb-5">
            <Text className="font-medium text-slate-600">
              {t("settingspage.health_alerts")}
            </Text>
            <Text className="text-sm text-gray-500">
              {t("settingspage.health_alerts_desc")}
            </Text>
          </View>
          <Switch value={healthAlerts} onValueChange={setHealthAlerts} />
        </View>
      </View>

      {/* Display & Language */}
      <View className="p-6 mb-6 space-y-4 bg-white shadow-sm rounded-xl">
        <Text className="mb-5 text-lg font-semibold text-slate-700">
          <Palette size={18} /> {t("settingspage.display_language")}
        </Text>

        <View>
          <Text className="mb-1 font-medium text-slate-600">
            {t("settingspage.language")}
          </Text>
          <View className="overflow-hidden border rounded-xl border-slate-300">
            <Picker
              selectedValue={language}
              onValueChange={changeAppLanguage}
              style={{ color: "#334155" }}
            >
              {languages.map((lang) => (
                <Picker.Item key={lang.id} label={lang.name} value={lang.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
