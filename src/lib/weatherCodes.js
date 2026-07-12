export const weatherCodeMap = {
  0: { text: "Clear sky", icon: "Sun", color: "text-yellow-400" },
  1: { text: "Mainly clear", icon: "CloudSun", color: "text-yellow-300" },
  2: { text: "Partly cloudy", icon: "CloudSun", color: "text-gray-300" },
  3: { text: "Overcast", icon: "Cloud", color: "text-gray-400" },
  45: { text: "Foggy", icon: "CloudFog", color: "text-gray-400" },
  48: { text: "Rime fog", icon: "CloudFog", color: "text-gray-400" },
  51: { text: "Light drizzle", icon: "CloudDrizzle", color: "text-blue-300" },
  53: { text: "Drizzle", icon: "CloudDrizzle", color: "text-blue-300" },
  55: { text: "Heavy drizzle", icon: "CloudDrizzle", color: "text-blue-400" },
  56: { text: "Freezing drizzle", icon: "CloudDrizzle", color: "text-blue-200" },
  57: { text: "Freezing drizzle", icon: "CloudDrizzle", color: "text-blue-300" },
  61: { text: "Light rain", icon: "CloudRain", color: "text-blue-300" },
  63: { text: "Rain", icon: "CloudRain", color: "text-blue-400" },
  65: { text: "Heavy rain", icon: "CloudRain", color: "text-blue-500" },
  66: { text: "Freezing rain", icon: "CloudRain", color: "text-blue-200" },
  67: { text: "Freezing rain", icon: "CloudRain", color: "text-blue-300" },
  71: { text: "Light snow", icon: "CloudSnow", color: "text-blue-100" },
  73: { text: "Snow", icon: "CloudSnow", color: "text-blue-200" },
  75: { text: "Heavy snow", icon: "CloudSnow", color: "text-blue-300" },
  77: { text: "Snow grains", icon: "CloudSnow", color: "text-blue-100" },
  80: { text: "Light showers", icon: "CloudRain", color: "text-blue-300" },
  81: { text: "Showers", icon: "CloudRain", color: "text-blue-400" },
  82: { text: "Violent showers", icon: "CloudRain", color: "text-blue-500" },
  85: { text: "Snow showers", icon: "CloudSnow", color: "text-blue-100" },
  86: { text: "Heavy snow showers", icon: "CloudSnow", color: "text-blue-300" },
  95: { text: "Thunderstorm", icon: "CloudLightning", color: "text-yellow-400" },
  96: { text: "Thunderstorm w/ hail", icon: "CloudLightning", color: "text-yellow-400" },
  99: { text: "Severe thunderstorm", icon: "CloudLightning", color: "text-yellow-500" },
};

export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { text: "Unknown", icon: "Cloud", color: "text-gray-400" };
}