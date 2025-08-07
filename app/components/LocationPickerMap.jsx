// components/LocationPickerMap.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function LocationPickerMap({ visible, onClose }) {
  const [marker, setMarker] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getSavedLocation = async () => {
      const loc = await AsyncStorage.getItem("smartaqi-location");
      if (loc) {
        const parsed = JSON.parse(loc);
        setLocation(parsed);
        setMarker({
          latitude: parsed.lat,
          longitude: parsed.lon,
        });
      } else {
        setLocation({ lat: 28.6139, lon: 77.209 });
        setMarker({ latitude: 28.6139, longitude: 77.209 });
      }
    };
    getSavedLocation();
  }, []);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      return (
        (place.city || place.name || "") +
        ", " +
        (place.region || "") +
        ", " +
        (place.postalCode || "")
      );
    } catch (err) {
      console.log("Reverse geocode failed:", err);
      return "Unknown location";
    }
  };

  const handleConfirmLocation = async () => {
    if (!marker) return;
    const name = await getAddressFromCoords(marker.latitude, marker.longitude);

    const newLocation = {
      lat: marker.latitude,
      lon: marker.longitude,
      name,
    };
    await AsyncStorage.setItem(
      "smartaqi-location",
      JSON.stringify(newLocation)
    );

    onClose(); 
  };

  if (!location || !location.lat || !location.lon) {
    return <></>;
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: location?.lat,
            longitude: location?.lon,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          {marker && <Marker coordinate={marker} draggable />}
        </MapView>

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 40,
            left: 20,
            right: 20,
            backgroundColor: "#2563eb",
            padding: 16,
            borderRadius: 12,
          }}
          onPress={handleConfirmLocation}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Confirm Location
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
