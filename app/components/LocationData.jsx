import { MapPin } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function LocationData({location}) {
    return (
        <View className="p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between border p-4 rounded-xl"
          >
            <View className="flex-row items-center space-x-2">
              <MapPin size={20} color="black" />
              <Text className="text-base text-black">{location}</Text>
            </View>
          </TouchableOpacity>
        </View>
    )
}