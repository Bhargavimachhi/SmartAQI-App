import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Loader from "../components/Loader";
import LocationData from "../components/LocationData";

export default function HealthAdvisoryScreen() {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const getNearestHospitals = async (loc) => {
    try {
      const lat = loc.lat;
      const lon = loc.lon;
      setLocation({ lat, lon });
      // console.log("Hopital", lon, lat);

      const res = await axios.get(
        `http://ec2-3-92-135-32.compute-1.amazonaws.com:8000/getnearesthospitals?lat=${lat}&lon=${lon}`
      );
      // console.log(res);
      setHospitals(res.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [isFocused]);

  const fetchLocation = async () => {
    try {
      const data = await AsyncStorage.getItem("smartaqi-location");
      if (data) {
        setCurrentLocation(JSON.parse(data));
      }
      getNearestHospitals(JSON.parse(data));
    } catch (error) {
      console.error("Error fetching location from AsyncStorage:", error);
    }
  };

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
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Nearby Hospitals {location.name}</Text>
      <View className="justify-center flex-1 bg-white">
        <LocationData location={currentLocation.name} />
      </View>

      {hospitals.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: hospitals[0].lat,
            longitude: hospitals[0].lon,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {hospitals?.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.lat,
                longitude: hospital.lon,
              }}
              title={hospital?.tags?.name || `Hospital ${index + 1}`}
            />
          ))}
        </MapView>
      )}

      <View className="p-4 my-4 bg-red-100 border border-red-300 rounded-lg">
        <Text className="text-lg font-bold text-red-700">
          ⚠️ Air Quality Alert
        </Text>
        <Text className="mt-2 text-gray-800">
          The current AQI is above{" "}
          <Text className="font-semibold">{"100"}</Text>, which exceeds the safe
          threshold. Air quality is considered{" "}
          <Text className="font-semibold">poor</Text>.
        </Text>
        <Text className="mt-1 text-gray-800">
          Here are the list of nearest hospitals for your assistance:
        </Text>
      </View>

      {hospitals.map((hospital, index) => {
        const name = hospital.tags?.name || `Hospital ${index + 1}`;
        const address = hospital.tags?.["addr:full"] || "Address not available";
        const district = hospital.tags?.["addr:district"];
        const postcode = hospital.tags?.["addr:postcode"];

        return (
          <View
            key={hospital.id}
            className="p-4 mb-4 bg-white border border-gray-200 shadow-md rounded-xl"
          >
            <Text className="text-lg font-bold text-gray-900">{name}</Text>
            <Text className="mt-1 text-gray-700">{address}</Text>
            {district && (
              <Text className="mt-1 text-gray-600">District: {district}</Text>
            )}
            {postcode && (
              <Text className="text-gray-600">Pincode: {postcode}</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "start",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hospitalCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hospitalDetails: {
    fontSize: 14,
    marginTop: 4,
  },
});
