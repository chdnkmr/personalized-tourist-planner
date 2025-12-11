export interface StartLocation {
  name: string;
  latitude: number;
  longitude: number;
  osm_id?: string;
}

export interface Attraction {
  name: string;
  type: string;
  location: string;
  lat: number;
  lon: number;
  description: string;
  entryFee: number;
  openingHours: string;
  distanceFromStart?: number;
}

export interface Accommodation {
  location: string;
  name: string;
  type: string;
  category: string;
  pricePerNight: number;
  rating: string;
  amenities: string[];
}

export interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  condition: string;
}

export interface CostBreakdown {
  fuel: number;
  stay: number;
  food: number;
  attractions: number;
  misc: number;
}

export interface ItineraryDay {
  day: number;
  places: string[];
  distance: number;
  cost: number;
  activities: string;
  accommodation: string;
  meals: string[];
  weatherForecast?: string;
}

export interface ActorInput {
  startLocation: string;
  placeTypes: string[];
  budget: number;
  durationDays: number;
  groupSize: number;
  vehicleType: string;
  preferences?: string[];
  maxDistanceKm: number;
  llmProvider?: 'anthropic' | 'openai';
  verbose?: boolean;
}

export interface ActorOutput {
  success: boolean;
  startLocation?: StartLocation;
  totalCost: number;
  costBreakdown: CostBreakdown;
  costEstimateAccuracy: string;
  itinerary: ItineraryDay[];
  attractions: Attraction[];
  accommodations: Accommodation[];
  transportation: {
    vehicleType: string;
    totalDistanceKm: number;
    fuelNeeded: number;
    fuelCostEstimate: number;
    mileage: number;
    chargingStops: string[];
  };
  risks: string[];
  recommendations: string[];
  maps: Array<{
    destination: string;
    url: string;
  }>;
  generatedAt: string;
  llmModel?: string;
  error?: string;
}
