import React from "react";
import { Text, View } from "react-native";

const thresholds = {
  aqi: [50, 100, 200, 300, 400],
  pm25: [12, 35.4, 55.4, 150.4, 250.4],
  pm10: [54, 154, 254, 354, 424],
  co: [4.4, 9.4, 12.4, 15.4, 30.4],
  no2: [53, 100, 360, 649, 1249],
  so2: [35, 75, 185, 304, 604],
  o3: [54, 70, 85, 105, 200],
};

const colors = [
  "#4ade80", // Good
  "#15803d", // Moderate
  "#facc15", // Poor
  "#f97316", // Unhealthy
  "#ef4444", // Severe
  "#b91c1c", // Hazardous
];

const labels = ["Good", "Moderate", "Poor", "Unhealthy", "Severe", "Hazardous"];

const getCategoryIndex = (value, pollutant) => {
  const pollutantThresholds = thresholds[pollutant] || thresholds.aqi;
  for (let i = 0; i < pollutantThresholds.length; i++) {
    if (value <= pollutantThresholds[i]) return i;
  }
  return labels.length - 1;
};

export const PollutantBar = ({ pollutant, value }) => {
  const pollutantThresholds = thresholds[pollutant] || thresholds.aqi;
  const max = pollutantThresholds[pollutantThresholds.length - 1] * 1.2;
  const fullSegments = [...pollutantThresholds, max];

  const categoryIndex = getCategoryIndex(value, pollutant);
  const percentage = Math.min((value / max) * 100, 100);
  const category = labels[categoryIndex];
  const categoryColor = colors[categoryIndex];

  return (
    <View className="w-full space-y-2">
      {/* Bar */}
      <View className="relative h-4 w-full rounded-full overflow-hidden flex-row">
        {fullSegments.map((threshold, i) => {
          const prev = i === 0 ? 0 : fullSegments[i - 1];
          const widthPercent = ((threshold - prev) / max) * 100;
          return (
            <View
              key={i}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: colors[i],
              }}
            />
          );
        })}
      </View>

      <View className="relative h-4 w-full rounded-full overflow-hidden flex-row">
        {fullSegments.map((threshold, i) => {
          const prev = i === 0 ? 0 : fullSegments[i - 1];
          const widthPercent = ((threshold - prev) / max) * 100;
          return (
            <View
              key={i}
              style={{
                width: `${widthPercent}%`,
              }}
            >
              {i>0 && <Text key={i} className="text-[10px] text-gray-500">
                {pollutantThresholds[i-1]}
              </Text>}
            </View>
          );
        })}
      </View>

      {/* Scale */}
      {/* <View className="flex-row justify-between px-1">
        <Text className="text-[10px] text-gray-500">0</Text>
        {pollutantThresholds.map((t, i) => (
          <Text key={i} className="text-[10px] text-gray-500">
            {t}
          </Text>
        ))}
        <Text className="text-[10px] text-gray-500">{Math.round(max)}</Text>
      </View> */}
    </View>
  );
};
