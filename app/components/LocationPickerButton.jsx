// components/LocationPickerButton.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronRight, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Loader from "./Loader"; 

export default function LocationPickerButton({ onPress, location }) {

  return (
    <View className="p-4">
      <TouchableOpacity
        className="flex-row items-center justify-between border p-4 rounded-xl"
        onPress={onPress}
      >
        <View className="flex-row items-center space-x-2">
          <MapPin size={20} color="black" />
          <Text className="text-base text-black">{location}</Text>
        </View>
        <ChevronRight size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
