import axios from 'axios';
import { WeatherDay } from '../types/itinerary.js';

/**
 * Fetch weather forecast using free Open-Meteo API (no API key needed)
 */
export async function getWeatherForecast(
  lat: number,
  lon: number,
  days: number = 5,
): Promise<WeatherDay[]> {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        daily:
          'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max',
        timezone: 'Asia/Kolkata',
        forecast_days: Math.min(days, 16),
      },
      timeout: 10000,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const daily = response.data.daily as any;
    const forecast: WeatherDay[] = [];

    for (let i = 0; i < Math.min(daily.time.length, days); i++) {
      forecast.push({
        date: daily.time[i],
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        precipitation: daily.precipitation_sum[i],
        weatherCode: daily.weather_code[i],
        windSpeed: daily.wind_speed_10m_max[i],
        condition: getWeatherCondition(daily.weather_code[i]),
      });
    }

    return forecast;
  } catch (error) {
    console.error(
      `Weather forecast error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return [];
  }
}

/**
 * Convert WMO weather code to readable condition
 */
function getWeatherCondition(code: number): string {
  const conditions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return conditions[code] || 'Unknown';
}

/**
 * Check if weather is suitable for travel
 */
export function assessWeatherRisks(
  forecast: WeatherDay[],
): {
  risks: string[];
  averageTemp: number;
  rainyDays: number;
} {
  const risks: string[] = [];
  let averageTemp = 0;
  let rainyDays = 0;

  if (forecast.length === 0) {
    return { risks, averageTemp: 0, rainyDays: 0 };
  }

  forecast.forEach((day) => {
    averageTemp += day.maxTemp;
    if (day.precipitation > 5) {
      rainyDays++;
      if (day.precipitation > 20) {
        risks.push(`Heavy rain expected on ${day.date} (${day.precipitation}mm)`);
      }
    }
  });

  averageTemp /= forecast.length;

  if (averageTemp > 40) {
    risks.push('High temperature expected - stay hydrated');
  } else if (averageTemp < 5) {
    risks.push('Cold weather expected - carry warm clothes');
  }

  if (rainyDays > forecast.length / 2) {
    risks.push('Monsoon/rainy season - plan indoor activities');
  }

  return {
    risks,
    averageTemp: Math.round(averageTemp),
    rainyDays,
  };
}
