import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";
import Loader from "../components/Loader";
import LocationPickerButton from "../components/LocationPickerButton";
import LocationPickerMap from "../components/LocationPickerMap";

const HeatMapScreen = () => {
  const [aqiPoints, setAqiPoints] = useState([
    { latitude: 23.2156, longitude: 72.6369, weight: 0.8 }, // Central Gandhinagar
    { latitude: 23.22, longitude: 72.642, weight: 0.6 },
    { latitude: 23.225, longitude: 72.65, weight: 0.7 },
    { latitude: 23.21, longitude: 72.63, weight: 0.4 },
    { latitude: 23.2, longitude: 72.62, weight: 0.9 },
    { latitude: 23.23, longitude: 72.635, weight: 0.5 },
    { latitude: 23.218, longitude: 72.628, weight: 0.3 },
    { latitude: 23.222, longitude: 72.644, weight: 0.6 },
    { latitude: 23.214, longitude: 72.648, weight: 0.7 },
    { latitude: 23.205, longitude: 72.638, weight: 0.4 },
  ]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const fetchLocation = async () => {
    const loc = await AsyncStorage.getItem("smartaqi-location");
    if (loc) {
      setLocation(JSON.parse(loc));
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [showMap]);

  if (!location) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View className="flex-1 bg-white justify-center">
        <LocationPickerButton
          onPress={() => setShowMap(true)}
          location={location.name}
        />
        <LocationPickerMap
          visible={showMap}
          onClose={() => {
            setShowMap(false);
          }}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 23.2231,
            longitude: 72.6509,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          <Heatmap
            points={aqiPoints}
            radius={50}
            opacity={0.8}
            gradient={{
              colors: ["#00FF00", "#FFFF00", "#FFA500", "#FF0000", "#800000"],
              startPoints: [0.2, 0.4, 0.6, 0.8, 1],
              colorMapSize: 256,
            }}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "90%",
  },
});

export default HeatMapScreen;
