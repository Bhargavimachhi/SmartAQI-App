import * as Location from "expo-location";
import { ChevronRight, MapPin } from "lucide-react-native"; // Or use react-native-vector-icons
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function LocationPickerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: 22.3084577,
    longitude: 73.2265893,
    name: "Vadodara",
  });

  const handleMapPress = (e) => {
    getAddressFromCoords(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude
    );
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setLocation({
        latitude: latitude,
        longitude: longitude,
        name: place.city + ", " + place.region + ", " + place.postalCode,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Row with Location and Arrow */}
      <TouchableOpacity
        className="flex-row items-center justify-between border p-4 rounded-xl"
        onPress={() => setModalVisible(true)}
      >
        <View className="flex-row items-center space-x-2">
          <MapPin size={20} color="black" />
          <Text className="text-base text-black">{location.name}</Text>
        </View>
        <ChevronRight size={20} color="gray" />
      </TouchableOpacity>

      {/* Show selected coordinates */}
      <Text className="mt-4 text-gray-800">
        Selected: {location.latitude.toFixed(4)},{" "}
        {location.longitude.toFixed(4)}
      </Text>

      {/* Modal Map Picker */}
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1">
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={location}
              draggable
              onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
            />
          </MapView>

          <TouchableOpacity
            className="absolute bottom-10 left-5 right-5 bg-blue-600 p-4 rounded-xl"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-center font-semibold">
              Confirm Location
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
