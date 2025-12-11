# Integration Guide - Personalized Tourist Planner

Complete integration examples for React Native, Kotlin, and other platforms.

## 🔗 API Endpoint

```
Base URL: https://api.apify.com/v2/acts/{USERNAME}/personalized-tourist-planner/calls
Method: POST
Auth: Bearer Token (Apify API token)
```

## 📱 React Native Integration

### Installation
```bash
npm install axios react-native-dotenv
```

### Implementation

```javascript
// tourplannerService.js
import axios from 'axios';
import { APIFY_TOKEN, APIFY_ACTOR_ID } from '@env';

const API_BASE_URL = 'https://api.apify.com/v2';

export const generateTourItinerary = async (input) => {
  try {
    // Initiate actor call
    const callResponse = await axios.post(
      `${API_BASE_URL}/acts/${APIFY_ACTOR_ID}/calls`,
      input,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APIFY_TOKEN}`,
        },
        timeout: 60000,
      }
    );

    const { id: runId, defaultDatasetId } = callResponse.data;

    // Poll for completion
    let isRunning = true;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    while (isRunning && attempts < maxAttempts) {
      const statusResponse = await axios.get(
        `${API_BASE_URL}/actor-runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${APIFY_TOKEN}`,
          },
        }
      );

      const { status } = statusResponse.data;

      if (status === 'SUCCEEDED') {
        isRunning = false;

        // Fetch results
        const resultResponse = await axios.get(
          `${API_BASE_URL}/datasets/${defaultDatasetId}/items`,
          {
            headers: {
              'Authorization': `Bearer ${APIFY_TOKEN}`,
            },
          }
        );

        return resultResponse.data[0];
      } else if (status === 'FAILED') {
        throw new Error('Actor execution failed');
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Actor execution timeout');
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
};

// tourScreen.js - React Native Component
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { generateTourItinerary } from './tourplannerService';

const TourPlannerScreen = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState({
    startLocation: 'Bhubaneswar, Odisha',
    placeTypes: ['beaches', 'temples'],
    budget: 50000,
    durationDays: 5,
    groupSize: 4,
    vehicleType: 'XUV700',
    preferences: ['gym stops'],
    maxDistanceKm: 500,
  });

  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      const result = await generateTourItinerary(formData);
      setItinerary(result);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10 }}>Generating your itinerary...</Text>
      </View>
    );
  }

  if (itinerary) {
    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Your Tour Plan
        </Text>
        
        <View style={{ backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8 }}>
          <Text>Total Cost: ₹{itinerary.totalCost}</Text>
          <Text>Duration: {itinerary.itinerary.length} days</Text>
          <Text>Location: {itinerary.startLocation.name}</Text>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
          Day-by-Day Itinerary
        </Text>

        <FlatList
          scrollEnabled={false}
          data={itinerary.itinerary}
          keyExtractor={(item) => item.day.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Day {item.day}</Text>
              <Text>{item.places.join(', ')}</Text>
              <Text>Distance: {item.distance} km</Text>
              <Text>Cost: ₹{item.cost}</Text>
              <Text>{item.activities}</Text>
              <Text>Stay: {item.accommodation}</Text>
            </View>
          )}
        />

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
          Cost Breakdown
        </Text>
        <View style={{ backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8 }}>
          {Object.entries(itinerary.costBreakdown).map(([key, value]) => (
            <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              <Text>₹{value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setItinerary(null)}
          style={{ backgroundColor: '#0066cc', padding: 15, borderRadius: 8, marginTop: 20 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Plan Another Trip
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Tour Planner
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 5 }}>Location</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        value={formData.startLocation}
        onChangeText={(text) => setFormData({ ...formData, startLocation: text })}
        placeholder="e.g., Bhubaneswar, Odisha"
      />

      <Text style={{ fontSize: 14, marginBottom: 5 }}>Budget (₹)</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        value={formData.budget.toString()}
        onChangeText={(text) => setFormData({ ...formData, budget: parseInt(text) || 0 })}
        keyboardType="number-pad"
        placeholder="50000"
      />

      <Text style={{ fontSize: 14, marginBottom: 5 }}>Duration (days)</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        value={formData.durationDays.toString()}
        onChangeText={(text) => setFormData({ ...formData, durationDays: parseInt(text) || 0 })}
        keyboardType="number-pad"
        placeholder="5"
      />

      <Text style={{ fontSize: 14, marginBottom: 5 }}>Group Size</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        value={formData.groupSize.toString()}
        onChangeText={(text) => setFormData({ ...formData, groupSize: parseInt(text) || 1 })}
        keyboardType="number-pad"
        placeholder="4"
      />

      <TouchableOpacity
        onPress={handleGenerateItinerary}
        style={{ backgroundColor: '#0066cc', padding: 15, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
          Generate Itinerary
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TourPlannerScreen;
```

---

## 🤖 Kotlin Integration (Android Native)

### Gradle Setup
```gradle
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
}
```

### Data Models
```kotlin
// Models.kt
data class TourInput(
    val startLocation: String,
    val placeTypes: List<String>,
    val budget: Int,
    val durationDays: Int,
    val groupSize: Int,
    val vehicleType: String,
    val preferences: List<String>,
    val maxDistanceKm: Int,
    val llmProvider: String = "anthropic"
)

data class ActorCall(
    val id: String,
    val defaultDatasetId: String,
    val status: String
)

data class ItineraryDay(
    val day: Int,
    val places: List<String>,
    val distance: Int,
    val cost: Int,
    val activities: String,
    val accommodation: String,
    val meals: List<String>
)

data class CostBreakdown(
    val fuel: Int,
    val stay: Int,
    val food: Int,
    val attractions: Int,
    val misc: Int
)

data class TourOutput(
    val success: Boolean,
    val startLocation: Map<String, Any>,
    val totalCost: Int,
    val costBreakdown: CostBreakdown,
    val itinerary: List<ItineraryDay>,
    val attractions: List<Map<String, Any>>,
    val accommodations: List<Map<String, Any>>,
    val transportation: Map<String, Any>,
    val risks: List<String>,
    val recommendations: List<String>,
    val maps: List<Map<String, String>>,
    val generatedAt: String,
    val llmModel: String
)
```

### API Service
```kotlin
// ApifyService.kt
import retrofit2.Call
import retrofit2.http.*

interface ApifyService {
    @POST("v2/acts/{actorId}/calls")
    fun callActor(
        @Path("actorId") actorId: String,
        @Body input: TourInput,
        @Header("Authorization") auth: String
    ): Call<ActorCall>

    @GET("v2/actor-runs/{runId}")
    fun getRunStatus(
        @Path("runId") runId: String,
        @Header("Authorization") auth: String
    ): Call<Map<String, String>>

    @GET("v2/datasets/{datasetId}/items")
    fun getResults(
        @Path("datasetId") datasetId: String,
        @Header("Authorization") auth: String
    ): Call<List<TourOutput>>
}

// RetrofitClient.kt
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor

object RetrofitClient {
    private const val BASE_URL = "https://api.apify.com/"
    
    val instance: Retrofit by lazy {
        val logging = HttpLoggingInterceptor().apply {
            setLevel(HttpLoggingInterceptor.Level.BODY)
        }
        
        val httpClient = OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .build()
        
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}
```

### Repository & ViewModel
```kotlin
// TourRepository.kt
import kotlinx.coroutines.*

class TourRepository(private val apiService: ApifyService) {
    
    suspend fun generateItinerary(input: TourInput, apiToken: String): TourOutput? {
        return withContext(Dispatchers.IO) {
            try {
                // Step 1: Call actor
                val callResponse = apiService.callActor(
                    "your-username/personalized-tourist-planner",
                    input,
                    "Bearer $apiToken"
                ).execute()
                
                if (!callResponse.isSuccessful) {
                    throw Exception("Failed to start actor")
                }
                
                val actorCall = callResponse.body() ?: throw Exception("No response body")
                val runId = actorCall.id
                val datasetId = actorCall.defaultDatasetId
                
                // Step 2: Poll for completion
                var isRunning = true
                var attempts = 0
                val maxAttempts = 60
                
                while (isRunning && attempts < maxAttempts) {
                    val statusResponse = apiService.getRunStatus(
                        runId,
                        "Bearer $apiToken"
                    ).execute()
                    
                    if (statusResponse.isSuccessful) {
                        val status = statusResponse.body()?.get("status") ?: ""
                        
                        when (status) {
                            "SUCCEEDED" -> isRunning = false
                            "FAILED" -> throw Exception("Actor execution failed")
                            else -> {
                                delay(5000)
                                attempts++
                            }
                        }
                    }
                }
                
                if (attempts >= maxAttempts) {
                    throw Exception("Timeout waiting for results")
                }
                
                // Step 3: Fetch results
                val resultsResponse = apiService.getResults(
                    datasetId,
                    "Bearer $apiToken"
                ).execute()
                
                return@withContext if (resultsResponse.isSuccessful) {
                    resultsResponse.body()?.firstOrNull()
                } else {
                    throw Exception("Failed to fetch results")
                }
                
            } catch (e: Exception) {
                Log.e("TourRepository", "Error: ${e.message}", e)
                null
            }
        }
    }
}

// TourViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import kotlinx.coroutines.launch

class TourViewModel(private val repository: TourRepository) : ViewModel() {
    
    private val _itinerary = MutableLiveData<TourOutput?>()
    val itinerary: LiveData<TourOutput?> = _itinerary
    
    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    fun generateItinerary(input: TourInput, apiToken: String) {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            
            try {
                val result = repository.generateItinerary(input, apiToken)
                _itinerary.value = result
                
                if (result == null) {
                    _error.value = "Failed to generate itinerary"
                }
            } catch (e: Exception) {
                _error.value = e.message
                Log.e("TourViewModel", "Error: ${e.message}", e)
            } finally {
                _loading.value = false
            }
        }
    }
}
```

### UI Activity
```kotlin
// TourPlannerActivity.kt
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope

class TourPlannerActivity : AppCompatActivity() {
    
    private lateinit var viewModel: TourViewModel
    private lateinit var apiService: ApifyService
    private val API_TOKEN = "your-apify-token"
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tour_planner)
        
        // Initialize API service
        apiService = RetrofitClient.instance.create(ApifyService::class.java)
        val repository = TourRepository(apiService)
        viewModel = ViewModelProvider(this, TourViewModelFactory(repository)).get(TourViewModel::class.java)
        
        // Setup UI
        setupUI()
        observeViewModel()
    }
    
    private fun setupUI() {
        findViewById<Button>(R.id.btnGenerate).setOnClickListener {
            val input = TourInput(
                startLocation = findViewById<EditText>(R.id.etLocation).text.toString(),
                placeTypes = listOf("beaches", "temples"),
                budget = findViewById<EditText>(R.id.etBudget).text.toString().toIntOrNull() ?: 50000,
                durationDays = findViewById<EditText>(R.id.etDays).text.toString().toIntOrNull() ?: 5,
                groupSize = findViewById<EditText>(R.id.etGroupSize).text.toString().toIntOrNull() ?: 4,
                vehicleType = "XUV700",
                preferences = listOf("gym stops"),
                maxDistanceKm = 500
            )
            
            viewModel.generateItinerary(input, API_TOKEN)
        }
    }
    
    private fun observeViewModel() {
        viewModel.loading.observe(this) { loading ->
            findViewById<ProgressBar>(R.id.progressBar).visibility = if (loading) View.VISIBLE else View.GONE
        }
        
        viewModel.itinerary.observe(this) { itinerary ->
            if (itinerary != null) {
                displayItinerary(itinerary)
            }
        }
        
        viewModel.error.observe(this) { error ->
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun displayItinerary(itinerary: TourOutput) {
        findViewById<TextView>(R.id.tvTotalCost).text = "Total Cost: ₹${itinerary.totalCost}"
        
        val adapter = object : ArrayAdapter<ItineraryDay>(
            this,
            android.R.layout.simple_list_item_2,
            android.R.id.text1,
            itinerary.itinerary
        ) {
            override fun getView(position: Int, convertView: android.view.View?, parent: android.view.ViewGroup?): android.view.View {
                val view = super.getView(position, convertView, parent)
                val day = getItem(position)!!
                
                view.findViewById<TextView>(android.R.id.text1).text = "Day ${day.day}: ${day.places.take(2).joinToString(", ")}"
                view.findViewById<TextView>(android.R.id.text2).text = "₹${day.cost} • ${day.distance}km"
                
                return view
            }
        }
        
        findViewById<ListView>(R.id.lvItinerary).adapter = adapter
    }
}

// TourViewModelFactory.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class TourViewModelFactory(private val repository: TourRepository) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return TourViewModel(repository) as T
    }
}
```

---

## 🌐 Web Integration (React)

```jsx
// TourPlanner.jsx
import React, { useState } from 'react';
import axios from 'axios';

const TourPlanner = () => {
  const [formData, setFormData] = useState({
    startLocation: 'Bhubaneswar, Odisha',
    placeTypes: ['beaches'],
    budget: 50000,
    durationDays: 5,
    groupSize: 4,
    vehicleType: 'XUV700',
    preferences: [],
    maxDistanceKm: 500,
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  const generateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call actor
      const response = await axios.post(
        `https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/calls`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_APIFY_TOKEN}`,
          },
        }
      );

      const { id: runId, defaultDatasetId } = response.data;

      // Poll for completion
      let completed = false;
      let attempts = 0;

      while (!completed && attempts < 60) {
        const statusRes = await axios.get(
          `https://api.apify.com/v2/actor-runs/${runId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_APIFY_TOKEN}`,
            },
          }
        );

        if (statusRes.data.status === 'SUCCEEDED') {
          // Fetch results
          const resultsRes = await axios.get(
            `https://api.apify.com/v2/datasets/${defaultDatasetId}/items`,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_APIFY_TOKEN}`,
              },
            }
          );

          setItinerary(resultsRes.data[0]);
          completed = true;
        } else if (statusRes.data.status === 'FAILED') {
          throw new Error('Actor execution failed');
        }

        if (!completed) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          attempts++;
        }
      }

      if (!completed) {
        throw new Error('Timeout waiting for results');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (itinerary) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Your Tour Plan</h1>
        
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p className="text-lg">Total Cost: ₹{itinerary.totalCost}</p>
          <p>Location: {itinerary.startLocation.name}</p>
          <p>Duration: {itinerary.itinerary.length} days</p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Day-by-Day Plan</h2>
        {itinerary.itinerary.map((day) => (
          <div key={day.day} className="border p-4 mb-4 rounded">
            <h3 className="text-xl font-bold">Day {day.day}</h3>
            <p className="font-semibold">{day.places.join(', ')}</p>
            <p>Distance: {day.distance} km</p>
            <p>Cost: ₹{day.cost}</p>
            <p className="text-gray-700">{day.activities}</p>
          </div>
        ))}

        <h2 className="text-2xl font-bold mb-4">Cost Breakdown</h2>
        <div className="bg-gray-100 p-4 rounded">
          {Object.entries(itinerary.costBreakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between mb-2">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span>₹{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setItinerary(null)}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Plan Another Trip
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={generateItinerary} className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tour Planner</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-2">Location</label>
        <input
          type="text"
          value={formData.startLocation}
          onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="City, State"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Budget (₹)</label>
        <input
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
          className="w-full border p-2 rounded"
          placeholder="50000"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Duration (days)</label>
        <input
          type="number"
          value={formData.durationDays}
          onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
          className="w-full border p-2 rounded"
          placeholder="5"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Group Size</label>
        <input
          type="number"
          value={formData.groupSize}
          onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
          className="w-full border p-2 rounded"
          placeholder="4"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-bold"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Itinerary'}
      </button>
    </form>
  );
};

export default TourPlanner;
```

---

## 🔌 REST API Direct Usage

### cURL Example
```bash
# Step 1: Call Actor
curl -X POST https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/calls \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_APIFY_TOKEN' \
  -d '{
    "startLocation": "Bhubaneswar, Odisha",
    "placeTypes": ["beaches", "temples"],
    "budget": 50000,
    "durationDays": 5,
    "groupSize": 4,
    "vehicleType": "XUV700",
    "preferences": ["gym stops"],
    "maxDistanceKm": 500
  }' | jq .

# Response will include runId and defaultDatasetId
# Step 2: Poll for results (check status)
# Step 3: Get dataset items
```

---

## 📚 Additional Resources

- React Native docs: https://reactnative.dev
- Kotlin docs: https://kotlinlang.org
- Apify API: https://docs.apify.com/api
- Retrofit docs: https://square.github.io/retrofit/

---

All integration examples are ready to use with your deployed Personalized Tourist Planner actor!
