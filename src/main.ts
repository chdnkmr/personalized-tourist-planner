import { Actor } from 'apify';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { geocodeLocation } from './utils/geocoder';
import { getWeatherForecast, assessWeatherRisks } from './utils/weather';
import { getAttractions, getFuelStations, getChargingStations, getAccommodations } from './utils/scraper';
import { generateItinerary } from './utils/llm';
import { generateCostBreakdown, validateBudget } from './utils/costCalculator';
import { ActorInput, ActorOutput, Attraction } from './types/itinerary';

dotenv.config();

/**
 * Generate fallback itinerary when LLM is unavailable
 */
function generateFallbackItinerary(
  output: ActorOutput,
  attractions: Attraction[],
  durationDays: number,
  costBreakdown: { totalCost: number; breakdown: { fuel: number; stay: number; food: number; attractions: number; misc: number } },
): ActorOutput {
  const attractionsPerDay = Math.ceil(attractions.length / durationDays);
  const itinerary = [];

  for (let day = 1; day <= durationDays; day++) {
    const startIdx = (day - 1) * attractionsPerDay;
    const endIdx = Math.min(startIdx + attractionsPerDay, attractions.length);
    const dayAttractions = attractions.slice(startIdx, endIdx);

    itinerary.push({
      day,
      places: dayAttractions.map((a) => a.name),
      distance: Math.round(Math.random() * 100 + 50),
      cost: Math.round(costBreakdown.totalCost / durationDays),
      activities: dayAttractions.map((a) => a.description).join(', '),
      accommodation: 'Hotel TBD',
      meals: ['Breakfast', 'Lunch', 'Dinner'],
    });
  }

  return {
    ...output,
    itinerary,
  };
}

/**
 * Generate Google Maps URLs for attractions
 */
function generateMapUrls(
  attractions: Attraction[],
  startCoords: { name: string; latitude: number; longitude: number },
): Array<{ destination: string; url: string }> {
  const maps: Array<{ destination: string; url: string }> = [];

  attractions.forEach((attr) => {
    if (attr.lat && attr.lon) {
      const googleMapsUrl = `https://www.google.com/maps/dir/${startCoords.latitude},${startCoords.longitude}/${attr.lat},${attr.lon}`;
      maps.push({
        destination: attr.name,
        url: googleMapsUrl,
      });
    }
  });

  return maps;
}

/**
 * Main Actor function
 */
async function main(): Promise<void> {
  try {
    await Actor.init();

    // Get input from Apify platform or load from sample file in dev mode
    let input = (await Actor.getInput()) as ActorInput | null;

    // In dev/local mode, if no input from Apify, try to load from sample-input.json
    if (!input) {
      try {
        const sampleInputPath = path.join(process.cwd(), 'sample-input.json');
        if (fs.existsSync(sampleInputPath)) {
          const sampleData = fs.readFileSync(sampleInputPath, 'utf-8');
          input = JSON.parse(sampleData);
          console.log('Loaded input from sample-input.json (dev mode)');
        }
      } catch (fileError) {
        // Sample file not found or parsing error, will handle below
        console.log('sample-input.json not found or invalid');
      }
    }
    
    // Validate that required inputs are provided
    if (!input) {
      throw new Error('No input provided. Please provide input parameters according to input_schema.json');
    }

    console.log('Actor started with input:', JSON.stringify(input, null, 2));

    // Use input values directly (no defaults - all must come from user input)
    const {
      startLocation,
      placeTypes,
      budget,
      durationDays,
      groupSize,
      vehicleType,
      preferences,
      maxDistanceKm,
      llmProvider,
      verbose,
    } = input;

    // Validate required fields
    if (!startLocation || !budget || !durationDays) {
      throw new Error('Missing required inputs: startLocation, budget, and durationDays are mandatory');
    }

    // Validate input types and ranges
    if (typeof budget !== 'number' || budget < 10000 || budget > 500000) {
      throw new Error('Budget must be a number between ₹10,000 and ₹500,000');
    }

    if (typeof durationDays !== 'number' || durationDays < 1 || durationDays > 30) {
      throw new Error('Duration must be between 1 and 30 days');
    }

    if (typeof groupSize !== 'number' || groupSize < 1 || groupSize > 20) {
      throw new Error('Group size must be between 1 and 20 people');
    }

    if (typeof maxDistanceKm !== 'number' || maxDistanceKm < 50 || maxDistanceKm > 1000) {
      throw new Error('Max distance must be between 50 and 1000 km');
    }

    if (!Array.isArray(placeTypes) || placeTypes.length === 0) {
      throw new Error('Please select at least one place type to visit');
    }

    console.log('✓ Input validation passed');
    console.log(`  Start Location: ${startLocation}`);
    console.log(`  Place Types: ${placeTypes.join(', ')}`);
    console.log(`  Budget: ₹${budget}`);
    console.log(`  Duration: ${durationDays} days`);
    console.log(`  Group Size: ${groupSize} people`);
    console.log(`  Vehicle: ${vehicleType}`);
    console.log(`  Preferences: ${preferences && preferences.length > 0 ? preferences.join(', ') : 'None'}`);
    console.log(`  Max Distance: ${maxDistanceKm} km`);
    console.log(`  LLM Provider: ${llmProvider || 'anthropic'}`);
    if (verbose) {
      console.log('  Verbose logging: ENABLED');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let output: ActorOutput = {
      success: false,
      startLocation: { name: startLocation, latitude: 0, longitude: 0 },
      totalCost: 0,
      costBreakdown: { fuel: 0, stay: 0, food: 0, attractions: 0, misc: 0 },
      costEstimateAccuracy: 'pending',
      itinerary: [],
      attractions: [],
      transportation: { vehicleType, totalDistanceKm: 0, fuelNeeded: 0, fuelCostEstimate: 0, mileage: 0, chargingStops: [] },
      accommodations: [],
      risks: [],
      recommendations: [],
      maps: [],
      generatedAt: new Date().toISOString(),
      error: undefined,
    };

    try {
      // Step 1: Geocode start location
      console.log(`[Step 1] Geocoding start location: ${startLocation}`);
      const startCoords = await geocodeLocation(startLocation);
      output.startLocation = {
        name: startCoords.name,
        latitude: startCoords.latitude,
        longitude: startCoords.longitude,
      };
      console.log(`✓ Geocoded: ${startCoords.name} (${startCoords.latitude}, ${startCoords.longitude})`);

      // Step 2: Extract state from location for better scraping
      const stateMatch = startLocation.match(/,\s*([^,]+)$/);
      const state = stateMatch ? stateMatch[1].trim() : 'karnataka';
      console.log(`[Step 2] Extracted state: ${state}`);

      // Step 3: Get attractions
      console.log(`[Step 3] Fetching attractions (${placeTypes.join(', ')}) within ${maxDistanceKm}km`);
      const attractions = await getAttractions(
        startCoords.latitude,
        startCoords.longitude,
        state,
        placeTypes,
        maxDistanceKm,
      );
      console.log(`✓ Found ${attractions.length} relevant attractions`);
      output.attractions = attractions.slice(0, 15);

      // Step 4: Get weather forecast
      console.log(`[Step 4] Fetching weather forecast for ${durationDays} days`);
      const weatherForecast = await getWeatherForecast(startCoords.latitude, startCoords.longitude, durationDays);
      const weatherRisks = assessWeatherRisks(weatherForecast);
      output.risks.push(...weatherRisks.risks);
      console.log(`✓ Weather forecast retrieved (Avg temp: ${weatherRisks.averageTemp}°C)`);

      // Step 5: Get transportation options
      console.log('[Step 5] Fetching transportation and fuel options');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fuelStations: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chargingStations: any[] = [];

      if ((vehicleType && vehicleType.toLowerCase() === 'ev') || (preferences && preferences.includes('EV charging'))) {
        chargingStations = await getChargingStations(startCoords.latitude, startCoords.longitude, maxDistanceKm);
        console.log(`✓ Found ${chargingStations.length} EV charging stations`);
      } else {
        fuelStations = await getFuelStations(startCoords.latitude, startCoords.longitude, maxDistanceKm);
        console.log(`✓ Found ${fuelStations.length} fuel stations`);
      }

      // Step 6: Get accommodations
      console.log('[Step 6] Fetching accommodation options');
      const accommodations = await getAccommodations(startLocation);
      output.accommodations = accommodations;
      console.log(`✓ Found ${accommodations.length} accommodation options`);

      // Step 7: Calculate costs
      console.log('[Step 7] Calculating trip costs');
      const estimatedDistance = attractions.length > 0 ? attractions[attractions.length - 1].distanceFromStart! * 2 : 200; // Round trip

      const costBreakdown = generateCostBreakdown({
        distance: estimatedDistance,
        vehicleType,
        nights: durationDays - 1,
        pricePerNight: accommodations.length > 0 ? accommodations[0].pricePerNight : 2000,
        rooms: Math.ceil(groupSize / 2),
        days: durationDays,
        groupSize,
        foodCostPerPersonPerDay: 500,
        attractions,
        miscCost: Math.round(budget * 0.05), // 5% misc
      });

      output.totalCost = costBreakdown.totalCost;
      output.costBreakdown = costBreakdown.breakdown;

      const budgetAnalysis = validateBudget(costBreakdown.totalCost, budget);
      console.log(
        `✓ Estimated cost: ₹${costBreakdown.totalCost} (Budget: ₹${budget}, ${budgetAnalysis.recommendation})`,
      );

      output.transportation = {
        vehicleType,
        totalDistanceKm: Math.round(estimatedDistance),
        fuelNeeded: costBreakdown.fuelDetails.fuelNeeded,
        fuelCostEstimate: costBreakdown.breakdown.fuel,
        mileage: costBreakdown.fuelDetails.mileage,
        chargingStops: chargingStations.map((s) => s.name),
      };

      // Step 8: Generate itinerary using LLM
      console.log(`[Step 8] Generating optimized itinerary using ${llmProvider}`);

      const llmParams = {
        startLocation,
        placeTypes,
        budget,
        durationDays,
        groupSize,
        vehicleType: vehicleType || 'sedan',
        preferences: preferences || [],
        attractions,
        maxDistance: maxDistanceKm,
      };

      try {
        const llmOutput = await generateItinerary(llmProvider || 'anthropic', llmParams);
        output.itinerary = llmOutput.itinerary || [];
        output.totalCost = llmOutput.totalCost || output.totalCost;
        output.costBreakdown = llmOutput.costBreakdown || output.costBreakdown;
        output.risks.push(...(llmOutput.risks || []));
        output.recommendations = llmOutput.recommendations || [];
        output.llmModel = llmProvider === 'anthropic' ? 'Claude 3.5 Sonnet' : 'GPT-4o';
        console.log('✓ Itinerary generated successfully');
      } catch (llmError) {
        const errorMsg = llmError instanceof Error ? llmError.message : String(llmError);
        console.warn(`⚠ LLM generation failed: ${errorMsg}`);
        // Generate fallback itinerary from attractions
        output = generateFallbackItinerary(output, attractions, durationDays, costBreakdown);
      }

      // Step 9: Generate Google Maps URLs
      console.log('[Step 9] Generating navigation links');
      const mapUrls = generateMapUrls(output.attractions.slice(0, 5), output.startLocation!);
      output.maps = mapUrls;
      console.log(`✓ Generated ${mapUrls.length} map links`);

      // Step 10: Add additional recommendations
      console.log('[Step 10] Adding final recommendations');
      output.recommendations = [
        ...(output.recommendations || []),
        ...(preferences && preferences.includes('gym stops')
          ? ['Plan gym sessions in major cities (Bengaluru, Mysore hotels usually have facilities)']
          : []),
        ...(preferences && preferences.includes('EV charging') ? ['Charge vehicle overnight at hotel', 'Allow extra time at charging stations'] : []),
        'Download offline maps before the trip',
        'Book accommodations in advance during peak season',
        'Carry sufficient cash for remote areas',
        'Keep emergency contact numbers handy',
      ];

      output.generatedAt = new Date().toISOString();
      output.success = true;

      // Clean up duplicate risks
      output.risks = [...new Set(output.risks)];

      console.log('[✓] Actor execution completed successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      output.error = errorMsg;
      output.success = false;
      console.error(`[✗] Error during execution: ${errorMsg}`);
    }

    // Push results to Apify
    await Actor.pushData(output);
    console.log('Output pushed to Apify');

    await Actor.exit();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Fatal error: ${errorMsg}`);
    process.exit(1);
  }
}

// Run the actor
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
