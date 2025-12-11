# Usage Examples - Personalized Tourist Planner

This document provides practical examples for using the Personalized Tourist Planner Apify Actor across different scenarios.

## 🏖️ Example 1: Beach Holiday in Odisha

Perfect for a family wanting to relax on beaches with cultural visits.

### Input
```json
{
  "startLocation": "Bhubaneswar, Odisha",
  "placeTypes": ["beaches", "temples", "historical"],
  "budget": 50000,
  "durationDays": 5,
  "groupSize": 4,
  "vehicleType": "creta",
  "preferences": ["family-friendly", "photography spots"],
  "maxDistanceKm": 200
}
```

### Expected Output Highlights
- **Total Cost**: ₹45,000-52,000
- **Daily Budget**: ₹9,000-10,400
- **Main Attractions**: Puri Beach, Konark Sun Temple, Jagannath Temple, Chilika Lake
- **Accommodation**: 4 nights in 2 rooms (mid-range hotels)
- **Food**: Odissi cuisine with vegetarian options
- **Weather**: Sunny conditions expected

### Sample Itinerary
```
Day 1: Bhubaneswar → Puri (65km)
- Puri Beach relaxation
- Jagannath Temple visit
- Cost: ₹8,500

Day 2: Puri local exploration
- Raghurajpur Art Village
- Beach photography session
- Cost: ₹7,500

Day 3: Puri → Konark (42km)
- Konark Sun Temple
- Beach sunrise
- Cost: ₹8,000

Day 4: Chilika Lake excursion
- Bird watching
- Backwater cruise
- Cost: ₹9,000

Day 5: Return to Bhubaneswar
- Odisha State Museum
- Last-minute shopping
- Cost: ₹8,000
```

---

## 🏔️ Example 2: Adventure Trip to Western Ghats

For adventure enthusiasts exploring hills and waterfalls.

### Input
```json
{
  "startLocation": "Bangalore, Karnataka",
  "placeTypes": ["hills", "waterfalls", "adventure"],
  "budget": 75000,
  "durationDays": 6,
  "groupSize": 3,
  "vehicleType": "safari",
  "preferences": ["offbeat", "photography spots"],
  "maxDistanceKm": 400
}
```

### Expected Output
- **Total Cost**: ₹72,000-78,000
- **Destinations**: Coorg, Madikeri, Nagarhole National Park
- **Activities**: Trekking, coffee plantation tours, wildlife spotting
- **Accommodation**: Hill resorts with adventure packages
- **Risk Warnings**: Monsoon roads, wildlife precautions

### Sample Itinerary
```
Day 1: Bangalore → Coorg (280km)
- Drive through scenic routes
- Coffee plantation tour
- Cost: ₹12,000

Days 2-3: Coorg trekking
- Brahmagiri trek (6.5km)
- Abbey Falls visit
- Cost: ₹16,000/day

Day 4: Wildlife safari
- Nagarhole National Park
- Jeep safari (4 hours)
- Cost: ₹15,000

Day 5: Local exploration
- Madikeri Fort
- Photography sessions
- Cost: ₹10,000

Day 6: Return journey
- Stops at scenic viewpoints
- Cost: ₹8,000
```

---

## 🚗 Example 3: Budget Road Trip with EV

Eco-conscious travelers on a tight budget with electric vehicle.

### Input
```json
{
  "startLocation": "Mumbai, Maharashtra",
  "placeTypes": ["beaches", "adventure"],
  "budget": 30000,
  "durationDays": 4,
  "groupSize": 2,
  "vehicleType": "ev",
  "preferences": ["budget", "EV charging"],
  "maxDistanceKm": 300
}
```

### Expected Output
- **Total Cost**: ₹28,000-32,000
- **Charging Stops**: 3-4 strategic locations
- **Per-Person**: ₹14,000-16,000
- **Hotels**: Budget 2-3 star with charging facilities
- **Food**: Street food + budget restaurants (₹200-400/meal)

### Sample Itinerary
```
Day 1: Mumbai → Lonavala (125km)
- EV charge in Mumbai (full)
- Lonavala Caves visit
- Budget stay: ₹1,200/night
- Cost: ₹8,500

Day 2: Lonavala → Matheran (35km)
- Matheran hill station car-free experience
- Local trekking
- Charging at hotel
- Cost: ₹7,800

Day 3: Matheran → Pune (105km)
- Fast DC charger (30 mins)
- Shaniwaar Wada visit
- Food tours
- Cost: ₹7,200

Day 4: Return to Mumbai
- Route via Khandala
- Charging stop in Pune
- Cost: ₹6,500
```

---

## 👨‍👩‍👧‍👦 Example 4: Family Vacation - Gym Stops Included

For fitness-conscious families wanting to maintain workout routine.

### Input
```json
{
  "startLocation": "Delhi, India",
  "placeTypes": ["beaches", "temples", "parks"],
  "budget": 100000,
  "durationDays": 8,
  "groupSize": 5,
  "vehicleType": "XUV700",
  "preferences": ["gym stops", "family-friendly", "vegetarian"],
  "maxDistanceKm": 600
}
```

### Expected Output
- **Total Cost**: ₹95,000-105,000
- **Gym Options**: 2-3 partner gyms included
- **Accommodation**: 4-5 star hotels with gym facilities
- **Meals**: Vegetarian-focused restaurants
- **Activities**: Kid-friendly attractions

### Sample Itinerary
```
Day 1-2: Delhi → Agra
- Taj Mahal visit
- Hotel with gym access
- Yoga sessions
- Cost: ₹18,000/day

Days 3-4: Agra → Jaipur
- Palace visits
- Morning gym sessions
- Vegetarian thali experiences
- Cost: ₹16,000/day

Days 5-8: Jaipur exploration
- City Palace, Jantar Mantar
- Daily gym access
- Family activities
- Local cuisine exploration
- Cost: ₹15,000/day
```

---

## 🌾 Example 5: Rural Tourism & Offbeat Experiences

Travelers seeking authentic, less-touristy experiences.

### Input
```json
{
  "startLocation": "Guwahati, Assam",
  "placeTypes": ["wildlife", "parks", "historical"],
  "budget": 60000,
  "durationDays": 7,
  "groupSize": 4,
  "vehicleType": "fortuner",
  "preferences": ["offbeat", "photography spots"],
  "maxDistanceKm": 350
}
```

### Expected Output
- **Total Cost**: ₹58,000-62,000
- **Destinations**: Kaziranga, Local villages, Tea gardens
- **Activities**: Wildlife spotting, cultural immersion
- **Accommodation**: Eco-lodges, homestays
- **Unique Experiences**: Local market visits, cooking classes

### Sample Itinerary
```
Day 1-2: Guwahati → Kaziranga
- One-horned rhino safari
- Bird watching
- Sunrise/sunset viewing
- Cost: ₹14,000/day

Days 3-4: Tea garden tour
- Visit working tea estates
- Learning tea production
- Homestay experience
- Cost: ₹12,000/day

Days 5-7: Local exploration
- Village walks
- Traditional craft workshops
- Photography expeditions
- Cost: ₹11,000/day
```

---

## 📱 Mobile App Integration

### React Native Example
```javascript
import axios from 'axios';

const generateItinerary = async (input) => {
  try {
    const response = await axios.post(
      'https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/call',
      input,
      {
        headers: {
          'Authorization': `Bearer ${APIFY_TOKEN}`,
        },
      }
    );

    const { datasetId } = response.data;
    
    // Fetch results
    const resultResponse = await axios.get(
      `https://api.apify.com/v2/datasets/${datasetId}/items`,
      {
        headers: {
          'Authorization': `Bearer ${APIFY_TOKEN}`,
        },
      }
    );

    return resultResponse.data[0];
  } catch (error) {
    console.error('Itinerary generation failed:', error);
    throw error;
  }
};

// Usage in React
function TravelPlanner() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateItinerary = async (input) => {
    setLoading(true);
    try {
      const result = await generateItinerary(input);
      setItinerary(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading && <ActivityIndicator />}
      {itinerary && (
        <ScrollView>
          <Text>Total Cost: ₹{itinerary.totalCost}</Text>
          {itinerary.itinerary.map((day) => (
            <View key={day.day}>
              <Text>Day {day.day}</Text>
              <Text>{day.places.join(', ')}</Text>
              <Text>Cost: ₹{day.cost}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
```

### Kotlin Example
```kotlin
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApifyService {
    @POST("v2/acts/YOUR_USERNAME/personalized-tourist-planner/call")
    fun generateItinerary(@Body input: TourInput): Call<ActorResponse>
}

data class TourInput(
    val startLocation: String,
    val placeTypes: List<String>,
    val budget: Int,
    val durationDays: Int,
    val groupSize: Int,
    val vehicleType: String,
    val preferences: List<String>,
    val maxDistanceKm: Int
)

// Usage
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.apify.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val service = retrofit.create(ApifyService::class.java)

val input = TourInput(
    startLocation = "Bhubaneswar, Odisha",
    placeTypes = listOf("beaches", "temples"),
    budget = 50000,
    durationDays = 5,
    groupSize = 4,
    vehicleType = "creta",
    preferences = listOf("photography spots"),
    maxDistanceKm = 200
)

service.generateItinerary(input).enqueue(object : Callback<ActorResponse> {
    override fun onResponse(call: Call<ActorResponse>, response: Response<ActorResponse>) {
        val itinerary = response.body()
        // Update UI with itinerary data
    }

    override fun onFailure(call: Call<ActorResponse>, t: Throwable) {
        Log.e("ApifyError", t.message ?: "Unknown error")
    }
})
```

---

## 🔧 Advanced Configurations

### Multi-destination Planning
Combine multiple trips for regional tours:
```json
{
  "startLocation": "Bangalore, Karnataka",
  "placeTypes": ["beaches", "hills", "temples"],
  "budget": 150000,
  "durationDays": 14,
  "groupSize": 6,
  "vehicleType": "bus",
  "preferences": ["luxury", "photography spots"],
  "maxDistanceKm": 1000
}
```

### Corporate Team Outing
```json
{
  "startLocation": "Hyderabad, Telangana",
  "placeTypes": ["adventure", "parks", "museums"],
  "budget": 200000,
  "durationDays": 3,
  "groupSize": 25,
  "vehicleType": "bus",
  "preferences": ["team-building", "gym stops"],
  "maxDistanceKm": 150
}
```

---

## 💡 Tips for Best Results

1. **Start locations**: Use format "City, State" for better geocoding
2. **Budget**: Include 10-15% buffer for unexpected expenses
3. **Group size**: Larger groups get better per-person pricing
4. **Vehicle selection**: Match actual vehicle for accurate fuel calculations
5. **Preferences**: Select only truly important ones (max 4-5)
6. **Duration**: 4-7 days optimal for cost optimization
7. **Season**: Monsoon (June-Sept) may increase costs, influence recommendations

---

For more information, see the main [README.md](./README.md)
