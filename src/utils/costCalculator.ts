import { Attraction, CostBreakdown } from '../types/itinerary.js';

/**
 * Calculate fuel cost based on vehicle and distance
 */
export function calculateFuelCost(
  vehicleType: string,
  distance: number,
  fuelPrice: number = 105,
): {
  distance: number;
  mileage: number;
  fuelNeeded: number;
  fuelPrice: number;
  totalFuelCost: number;
  costPerKm: number;
} {
  const mileageMap: { [key: string]: number } = {
    sedan: 15,
    suv: 12,
    hatchback: 18,
    suv_compact: 14,
    ev: 5,
    bus: 5,
    bike: 45,
    taxi: 14,
    public_transport: 0,
    xuv700: 14,
    creta: 15,
    safari: 10,
    fortuner: 12,
  };

  const mileage = mileageMap[vehicleType.toLowerCase()] || 15;
  const fuelNeeded = distance / mileage;
  const fuelCost = fuelNeeded * fuelPrice;

  return {
    distance,
    mileage,
    fuelNeeded: Math.ceil(fuelNeeded * 10) / 10,
    fuelPrice,
    totalFuelCost: Math.round(fuelCost),
    costPerKm: Math.round((fuelCost / distance) * 100) / 100,
  };
}

/**
 * Calculate accommodation cost
 */
export function calculateAccommodationCost(
  nights: number,
  pricePerNight: number,
  rooms: number = 1,
): number {
  return nights * pricePerNight * rooms;
}

/**
 * Calculate food cost
 */
export function calculateFoodCost(
  days: number,
  groupSize: number,
  costPerPersonPerDay: number = 500,
): number {
  return days * groupSize * costPerPersonPerDay;
}

/**
 * Calculate attraction/activity cost
 */
export function calculateAttractionCost(
  attractions: Attraction[],
  groupSize: number,
): number {
  const totalFee = attractions.reduce((sum, attr) => sum + (attr.entryFee || 0), 0);
  return totalFee * groupSize;
}

/**
 * Generate comprehensive cost breakdown
 */
export function generateCostBreakdown(params: {
  distance?: number;
  vehicleType?: string;
  nights?: number;
  pricePerNight?: number;
  rooms?: number;
  days?: number;
  groupSize?: number;
  foodCostPerPersonPerDay?: number;
  attractions?: Attraction[];
  miscCost?: number;
  fuelPrice?: number;
}): {
  totalCost: number;
  costPerPerson: number;
  breakdown: CostBreakdown;
  fuelDetails: {
    distance: number;
    mileage: number;
    fuelNeeded: number;
    fuelPrice: number;
  };
} {
  const {
    distance = 0,
    vehicleType = 'sedan',
    nights = 0,
    pricePerNight = 2000,
    rooms = 1,
    days = 1,
    groupSize = 1,
    foodCostPerPersonPerDay = 500,
    attractions = [],
    miscCost = 0,
    fuelPrice = 105,
  } = params;

  const fuel = calculateFuelCost(vehicleType, distance, fuelPrice);
  const stay = calculateAccommodationCost(nights, pricePerNight, rooms);
  const food = calculateFoodCost(days, groupSize, foodCostPerPersonPerDay);
  const attractions_cost = calculateAttractionCost(attractions, groupSize);

  const breakdown: CostBreakdown = {
    fuel: fuel.totalFuelCost,
    stay,
    food,
    attractions: attractions_cost,
    misc: miscCost,
  };

  const totalCost = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const costPerPerson = Math.round(totalCost / groupSize);

  return {
    totalCost,
    costPerPerson,
    breakdown,
    fuelDetails: {
      distance: fuel.distance,
      mileage: fuel.mileage,
      fuelNeeded: fuel.fuelNeeded,
      fuelPrice: fuel.fuelPrice,
    },
  };
}

/**
 * Estimate daily cost
 */
export function estimateDailyCost(
  dayNumber: number,
  totalCost: number,
  days: number,
): number {
  // Distribute cost evenly across days
  return Math.round(totalCost / days);
}

/**
 * Validate budget constraint
 */
export function validateBudget(
  estimatedCost: number,
  budget: number,
): {
  estimatedCost: number;
  budget: number;
  withinBudget: boolean;
  surplus: number;
  deficit: number;
  percentageUsed: number;
  recommendation: string;
} {
  const difference = budget - estimatedCost;
  const percentage = Math.round((difference / budget) * 100);

  return {
    estimatedCost: Math.round(estimatedCost),
    budget,
    withinBudget: estimatedCost <= budget,
    surplus: Math.max(0, difference),
    deficit: Math.max(0, -difference),
    percentageUsed: Math.min(100, Math.round((estimatedCost / budget) * 100)),
    recommendation:
      percentage > 0
        ? `₹${difference} remaining buffer`
        : `₹${Math.abs(difference)} over budget`,
  };
}

/**
 * Calculate optimal route and distance
 */
export function calculateRouteDistance(
  places: Array<{ lat?: number; lon?: number }>,
): number {
  let totalDistance = 0;

  for (let i = 1; i < places.length; i++) {
    const lat1 = places[i - 1].lat || 0;
    const lon1 = places[i - 1].lon || 0;
    const lat2 = places[i].lat || 0;
    const lon2 = places[i].lon || 0;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDistance += R * c;
  }

  return Math.round(totalDistance * 10) / 10;
}
