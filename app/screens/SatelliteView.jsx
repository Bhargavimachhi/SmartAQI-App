import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewCluster from "react-native-map-clustering";

const SatelliteView = () => {
  return (
    <View style={styles.container}>
      <MapViewCluster
        style={styles.map}
        provider={PROVIDER_GOOGLE} // <-- required for satellite
        mapType="satellite"
        region={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
      >
        <Marker coordinate={{ latitude: 28.6139, longitude: 77.2090 }} />
        <Marker coordinate={{ latitude: 19.0760, longitude: 72.8777 }} />
      </MapViewCluster>
    </View>
  );
};

export default SatelliteView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
