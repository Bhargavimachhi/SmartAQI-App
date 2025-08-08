export const getAQIColorHex = (aqi) => {
  if (aqi <= 50) return "#009966";
  if (aqi <= 100) return "#FFDE33";
  if (aqi <= 150) return "#FF9933";
  if (aqi <= 200) return "#CC0033";
  if (aqi <= 300) return "#660099";
  return "#7E0023";
};

export const getAQILabel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

export const getHealthTips = (aqi) => {
  if (aqi <= 50)
    return [
      "Perfect air quality! Great time for outdoor activities.",
      "Consider keeping windows open for fresh air circulation.",
      "Ideal conditions for morning jogs and outdoor exercise.",
    ];
  if (aqi <= 100)
    return [
      "Air quality is acceptable for most people.",
      "Sensitive individuals should limit prolonged outdoor exertion.",
      "Good time for outdoor activities with minor precautions.",
    ];
  if (aqi <= 150)
    return [
      "Sensitive groups should reduce outdoor activities.",
      "Consider wearing a mask if you have respiratory conditions.",
      "Keep windows closed and use air purifiers indoors.",
    ];
  if (aqi <= 200)
    return [
      "Everyone should limit outdoor activities.",
      "Wear N95 masks when going outside.",
      "Keep windows closed and use HEPA air purifiers.",
    ];
  return [
    "Avoid all outdoor activities.",
    "Stay indoors with air purifiers running.",
    "Emergency health alert - seek medical advice if experiencing symptoms.",
  ];
};
