import { calculateDistance } from './geocoder';
import { Attraction, Accommodation } from '../types/itinerary';

/**
 * Pre-defined attractions database for Indian destinations
 */
const ATTRACTIONS_DB: { [key: string]: Attraction[] } = {
  karnataka: [
    {
      name: 'Mysore Palace',
      type: 'historical',
      location: 'Mysore, Karnataka',
      lat: 12.2958,
      lon: 76.6394,
      description: 'Iconic 14th-century royal palace with intricate architecture',
      entryFee: 100,
      openingHours: '10:00 AM - 5:30 PM',
    },
    {
      name: 'Bandipur Old Town',
      type: 'historical',
      location: 'Bandipur, Karnataka',
      lat: 11.6328,
      lon: 75.4102,
      description: 'Charming heritage village with coffee plantations and colonial architecture',
      entryFee: 0,
      openingHours: '10:00 AM - 5:00 PM',
    },
    {
      name: 'Jog Falls',
      type: 'nature',
      location: 'Jog, Karnataka',
      lat: 13.8266,
      lon: 74.8117,
      description: 'One of India\'s highest waterfalls with scenic valley views',
      entryFee: 30,
      openingHours: '6:00 AM - 6:00 PM',
    },
    {
      name: 'Nandi Hills',
      type: 'hills',
      location: 'Nandi Hills, Karnataka',
      lat: 13.3627,
      lon: 75.4116,
      description: 'Scenic hill station near Bengaluru with trekking trails and panoramic views',
      entryFee: 50,
      openingHours: '6:00 AM - 6:00 PM',
    },
    {
      name: 'Coorg Coffee Plantations',
      type: 'shopping',
      location: 'Coorg, Karnataka',
      lat: 12.338,
      lon: 75.567,
      description: 'Scenic coffee estates with plantation tours and local crafts',
      entryFee: 0,
      openingHours: '8:00 AM - 5:00 PM',
    },
  ],
  kerala: [
    {
      name: 'Alleppey Backwaters',
      type: 'beaches',
      location: 'Alleppey, Kerala',
      lat: 9.478,
      lon: 76.3389,
      description: 'Scenic backwater canals with houseboat cruises',
      entryFee: 300,
      openingHours: '6:00 AM - 6:00 PM',
    },
    {
      name: 'Munnar Hill Station',
      type: 'hills',
      location: 'Munnar, Kerala',
      lat: 10.5869,
      lon: 77.055,
      description: 'Tea plantation hill station with misty mountains',
      entryFee: 0,
      openingHours: '24 hours',
    },
    {
      name: 'Kochi Fort',
      type: 'historical',
      location: 'Kochi, Kerala',
      lat: 9.9658,
      lon: 76.2811,
      description: 'Historic Portuguese fort with museums',
      entryFee: 50,
      openingHours: '10:00 AM - 6:00 PM',
    },
  ],
  maharashtra: [
    {
      name: 'Lonavala Caves',
      type: 'historical',
      location: 'Lonavala, Maharashtra',
      lat: 18.7546,
      lon: 73.4066,
      description: 'Ancient Buddhist caves and scenic viewpoints',
      entryFee: 150,
      openingHours: '9:00 AM - 6:00 PM',
    },
    {
      name: 'Matheran Hill Station',
      type: 'hills',
      location: 'Matheran, Maharashtra',
      lat: 18.9833,
      lon: 73.2667,
      description: 'Car-free hill station with trekking trails',
      entryFee: 0,
      openingHours: '24 hours',
    },
  ],
};

/**
 * Get attractions for a location within specified distance
 */
export async function getAttractions(
  lat: number,
  lon: number,
  state: string,
  placeTypes: string[],
  maxDistance: number = 500,
): Promise<Attraction[]> {
  const attractions: Attraction[] = [];

  try {
    const stateAttractions = ATTRACTIONS_DB[state.toLowerCase()] || [];

    for (const attraction of stateAttractions) {
      const distance = calculateDistance(lat, lon, attraction.lat, attraction.lon);

      if (distance <= maxDistance && placeTypes.includes(attraction.type)) {
        attractions.push({
          ...attraction,
          distanceFromStart: Math.round(distance * 10) / 10,
        });
      }
    }

    attractions.sort((a, b) => (a.distanceFromStart || 0) - (b.distanceFromStart || 0));

    return attractions;
  } catch (error) {
    console.error(
      `Error fetching attractions: ${error instanceof Error ? error.message : String(error)}`,
    );
    return [];
  }
}

/**
 * Fetch accommodation data
 */
export async function getAccommodations(location: string): Promise<Accommodation[]> {
  const accommodations: Accommodation[] = [
    {
      location: 'Bengaluru',
      name: 'Bengaluru Business Hotel',
      type: 'Hotel',
      category: 'mid-range',
      pricePerNight: 3000,
      rating: '4.3/5',
      amenities: ['WiFi', 'Restaurant', 'Gym', 'Business Center'],
    },
    {
      location: 'Mysore',
      name: 'Mysore Heritage Inn',
      type: 'Hotel',
      category: 'mid-range',
      pricePerNight: 2200,
      rating: '4.1/5',
      amenities: ['WiFi', 'Restaurant', 'Palace View'],
    },
    {
      location: 'Coorg',
      name: 'Coffee Estate Homestay',
      type: 'Guesthouse',
      category: 'budget',
      pricePerNight: 1500,
      rating: '4.4/5',
      amenities: ['WiFi', 'Farm Fresh Meals', 'Nature Walks'],
    },
  ];

  return accommodations.filter((acc) =>
    acc.location.toLowerCase().includes(location.toLowerCase()),
  );
}

/**
 * Get fuel stations
 */
export function getFuelStations(lat: number, lon: number, maxDistance: number = 500) {
  const fuelStations = [
    {
      name: 'IndianOil Station - Bengaluru',
      brand: 'IndianOil',
      location: 'Bengaluru, Karnataka',
      lat: 12.9716,
      lon: 77.5946,
      services: ['Petrol', 'Diesel', 'CNG'],
    },
    {
      name: 'IndianOil Station - Mysore',
      brand: 'IndianOil',
      location: 'Mysore, Karnataka',
      lat: 12.2958,
      lon: 76.6394,
      services: ['Petrol', 'Diesel', 'CNG'],
    },
    {
      name: 'HPCL Station - Coorg',
      brand: 'HPCL',
      location: 'Coorg, Karnataka',
      lat: 12.338,
      lon: 75.567,
      services: ['Petrol', 'Diesel'],
    },
  ];

  return fuelStations.filter((station) => {
    const distance = calculateDistance(lat, lon, station.lat, station.lon);
    return distance <= maxDistance;
  });
}

/**
 * Get EV charging stations
 */
export function getChargingStations(lat: number, lon: number, maxDistance: number = 500) {
  const chargingStations = [
    {
      name: 'Bengaluru EV Hub',
      location: 'Bengaluru, Karnataka',
      lat: 12.9716,
      lon: 77.5946,
      type: 'DC Fast Charger',
      capacity: 8,
    },
    {
      name: 'Mysore Charging Station',
      location: 'Mysore, Karnataka',
      lat: 12.2958,
      lon: 76.6394,
      type: 'AC Charger',
      capacity: 4,
    },
  ];

  return chargingStations.filter((station) => {
    const distance = calculateDistance(lat, lon, station.lat, station.lon);
    return distance <= maxDistance;
  });
}
