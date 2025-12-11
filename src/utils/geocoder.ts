import axios from 'axios';
import { StartLocation } from '../types/itinerary.js';

/**
 * Geocode a location using Nominatim (free, no API key required)
 */
export async function geocodeLocation(location: string): Promise<StartLocation> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'PersonalizedTouristPlanner/1.0',
      },
      timeout: 10000,
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        name: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        osm_id: result.osm_id,
      };
    }

    throw new Error(`Location not found: ${location}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Geocoding error for "${location}": ${message}`);
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get reverse geocoding (coordinates to location name)
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'User-Agent': 'PersonalizedTouristPlanner/1.0',
      },
      timeout: 10000,
    });

    return (
      response.data.address?.city ||
      response.data.address?.town ||
      response.data.display_name ||
      null
    );
  } catch (error) {
    console.error(`Reverse geocoding error: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
