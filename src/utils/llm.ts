import { ActorInput } from '../types/itinerary.js';

interface ItineraryLLMResponse {
  itinerary: Array<{
    day: number;
    places: string[];
    distance: number;
    cost: number;
    activities: string;
    accommodation: string;
    meals: string[];
  }>;
  totalCost: number;
  costBreakdown: {
    fuel: number;
    stay: number;
    food: number;
    attractions: number;
    misc: number;
  };
  risks: string[];
  recommendations: string[];
}

/**
 * Generate optimized itinerary with Anthropic Claude
 */
export async function generateItineraryWithClaude(params: {
  startLocation: string;
  placeTypes: string[];
  budget: number;
  durationDays: number;
  groupSize: number;
  vehicleType: string;
  preferences: string[];
  attractions: Array<{ name: string; type: string; distanceFromStart?: number; entryFee: number }>;
  maxDistance: number;
}): Promise<ItineraryLLMResponse> {
  // Dynamically import to avoid module resolution issues at compile time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Anthropic = require('@anthropic-ai/sdk').default;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic({ apiKey });

  const attractionsList = params.attractions
    .slice(0, 20)
    .map(
      (a) =>
        `- ${a.name} (${a.type}, ${a.distanceFromStart || 0}km away, Entry: ₹${a.entryFee})`,
    )
    .join('\n');

  const prompt = `You are an expert travel planner for India. Create a detailed ${params.durationDays}-day itinerary for a group of ${params.groupSize} people starting from ${params.startLocation}.

Requirements:
- Visiting types: ${params.placeTypes.join(', ')}
- Total budget: ₹${params.budget}
- Vehicle: ${params.vehicleType}
- Additional preferences: ${params.preferences.join(', ') || 'none'}
- Maximum distance: ${params.maxDistance}km

Available attractions:
${attractionsList}

Generate a realistic, day-by-day itinerary that:
1. Includes specific place names and distances
2. Provides cost breakdown (fuel, accommodation, food, attractions)
3. Estimates total cost within ±10% accuracy
4. Includes accommodation suggestions
5. Provides activity recommendations
6. Lists potential risks/challenges

IMPORTANT: Return ONLY valid JSON (no markdown, no extra text). Use this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "places": ["Place1", "Place2"],
      "distance": 150,
      "cost": 5000,
      "activities": "description",
      "accommodation": "Hotel Name",
      "meals": ["breakfast", "lunch", "dinner"]
    }
  ],
  "totalCost": 48000,
  "costBreakdown": {
    "fuel": 8000,
    "stay": 20000,
    "food": 10000,
    "attractions": 5000,
    "misc": 5000
  },
  "risks": ["Risk1", "Risk2"],
  "recommendations": ["Tip1", "Tip2"]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseText = (message.content[0] as any).type === 'text' ? (message.content[0] as any).text : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`LLM generation failed: ${message}`);
  }
}

/**
 * Generate optimized itinerary with OpenAI GPT-4o
 */
export async function generateItineraryWithOpenAI(params: {
  startLocation: string;
  placeTypes: string[];
  budget: number;
  durationDays: number;
  groupSize: number;
  vehicleType: string;
  preferences: string[];
  attractions: Array<{ name: string; type: string; distanceFromStart?: number; entryFee: number }>;
  maxDistance: number;
}): Promise<ItineraryLLMResponse> {
  // Dynamically import to avoid module resolution issues at compile time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const OpenAI = require('openai').default;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const client = new OpenAI({ apiKey });

  const attractionsList = params.attractions
    .slice(0, 20)
    .map(
      (a) =>
        `- ${a.name} (${a.type}, ${a.distanceFromStart || 0}km away, Entry: ₹${a.entryFee})`,
    )
    .join('\n');

  const prompt = `You are an expert travel planner for India. Create a detailed ${params.durationDays}-day itinerary for a group of ${params.groupSize} people starting from ${params.startLocation}.

Requirements:
- Visiting types: ${params.placeTypes.join(', ')}
- Total budget: ₹${params.budget}
- Vehicle: ${params.vehicleType}
- Additional preferences: ${params.preferences.join(', ') || 'none'}
- Maximum distance: ${params.maxDistance}km

Available attractions:
${attractionsList}

Generate a realistic, day-by-day itinerary that:
1. Includes specific place names and distances
2. Provides cost breakdown (fuel, accommodation, food, attractions)
3. Estimates total cost within ±10% accuracy
4. Includes accommodation suggestions
5. Provides activity recommendations
6. Lists potential risks/challenges

IMPORTANT: Return ONLY valid JSON (no markdown, no extra text). Use this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "places": ["Place1", "Place2"],
      "distance": 150,
      "cost": 5000,
      "activities": "description",
      "accommodation": "Hotel Name",
      "meals": ["breakfast", "lunch", "dinner"]
    }
  ],
  "totalCost": 48000,
  "costBreakdown": {
    "fuel": 8000,
    "stay": 20000,
    "food": 10000,
    "attractions": 5000,
    "misc": 5000
  },
  "risks": ["Risk1", "Risk2"],
  "recommendations": ["Tip1", "Tip2"]
}`;

  try {
    const message = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.choices[0].message.content || '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`LLM generation failed: ${message}`);
  }
}

/**
 * Generate itinerary with specified provider
 */
export async function generateItinerary(
  provider: string,
  params: {
    startLocation: string;
    placeTypes: string[];
    budget: number;
    durationDays: number;
    groupSize: number;
    vehicleType: string;
    preferences: string[];
    attractions: Array<{ name: string; type: string; distanceFromStart?: number; entryFee: number }>;
    maxDistance: number;
  },
): Promise<ItineraryLLMResponse> {
  if (provider === 'anthropic') {
    return generateItineraryWithClaude(params);
  } else if (provider === 'openai') {
    return generateItineraryWithOpenAI(params);
  } else {
    throw new Error(`Unknown LLM provider: ${provider}`);
  }
}
