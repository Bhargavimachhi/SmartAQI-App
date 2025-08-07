import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Loader from "../components/Loader";

export default function HealthAdvisoryScreen() {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const getNearestHospitals = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      setLocation({ lat, lon });

      const res = await axios.get(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/getnearesthospitals?lat=${lat}&lon=${lon}`
      );
      console.log(res);
      setHospitals(res.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNearestHospitals();
  }, []);

  if (loading) return <Loader />;

  if (!location) {
    return (
      <View style={styles.center}>
        <Text className="text-black">
          Location not available or permission denied.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text className="text-lg font-semibold mb-2 text-center">
        Nearby Hospitals
      </Text>
      {hospitals.length>0 && (<MapView
        style={styles.map}
        initialRegion={{
          latitude: hospitals[0].lat,
          longitude: hospitals[0].lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        height="50%"
      >
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: hospital.lat,
              longitude: hospital.lon,
            }}
          />
        ))}
      </MapView>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  map: {
    width: "100%",
    height: "90%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
