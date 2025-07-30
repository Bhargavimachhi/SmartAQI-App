import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Loader = ({ text = "Loading ..." }) => {
  return (
    <View className="absolute inset-0 z-50 bg-black/40 justify-center items-center">
      <View className="bg-white px-8 py-6 rounded-2xl items-center shadow-xl">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-blue-600 mt-4 text-base font-semibold">
          {text}
        </Text>
      </View>
    </View>
  );
};

export default Loader;
