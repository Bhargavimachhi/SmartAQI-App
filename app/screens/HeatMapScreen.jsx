import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";

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

  return (
    <View style={styles.container}>
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default HeatMapScreen;
