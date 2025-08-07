import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect } from "react";

export default function LocationLoader() {
  async function loadLocation() {
    try {
      let loc = await AsyncStorage.getItem("smartaqi-location");

      if (loc) { 
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      loc = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude :loc.coords.latitude,
        longitude : loc.coords.longitude,
      });

      let finalLocation = {
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
        name: place.city + ", " + place.region + ", " + place.postalCode,
      };
      console.log("Added : ", JSON.stringify(finalLocation));
      await AsyncStorage.setItem(
        "smartaqi-location",
        JSON.stringify(finalLocation)
      );
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    loadLocation();
  }, []);

  return <></>;
}
