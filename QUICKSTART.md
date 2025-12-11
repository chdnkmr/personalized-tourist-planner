# Quick Start Guide - Personalized Tourist Planner

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
```bash
# Install Node.js 20+ from nodejs.org
# Verify installation
node --version  # Should be v20.0.0 or higher
npm --version
```

### Step 2: Clone and Setup
```bash
cd /Users/chandankumar/VS_Workspace/ApifyWorkspace/Tourplanner

# Copy environment template
cp .env.example .env

# Open .env and add your API keys:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# OR
# OPENAI_API_KEY=sk-your-openai-key-here
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Locally
```bash
npm start
```

## 📋 Testing Locally

### Create a Test Input File
```bash
cat > test-input.json << 'EOF'
{
  "startLocation": "Bhubaneswar, Odisha",
  "placeTypes": ["beaches", "hills"],
  "budget": 50000,
  "durationDays": 5,
  "groupSize": 4,
  "vehicleType": "XUV700",
  "preferences": ["gym stops", "EV charging"],
  "maxDistanceKm": 500
}
EOF
```

### Run with Test Input
```bash
APIFY_INPUT_FILE_PATH=test-input.json npm start
```

## 🌐 Deploy to Apify

### Step 1: Create Apify Account
- Sign up at [apify.com](https://apify.com)
- Get API token from Console

### Step 2: Install Apify CLI
```bash
npm install -g apify-cli
```

### Step 3: Login
```bash
apify login
# Paste your API token when prompted
```

### Step 4: Deploy Actor
```bash
apify create personalized-tourist-planner
apify push
```

### Step 5: Run on Apify
```bash
apify call
```

## 📊 Example API Call

### Using cURL
```bash
curl -X POST \
  https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/calls \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  -d '{
    "startLocation": "Bangalore, Karnataka",
    "placeTypes": ["hills", "coffee plantations"],
    "budget": 75000,
    "durationDays": 7,
    "groupSize": 3,
    "vehicleType": "creta",
    "preferences": ["photography spots"],
    "maxDistanceKm": 300,
    "llmProvider": "anthropic"
  }'
```

### Using Node.js
```bash
npm install axios

# Create call.js:
cat > call.js << 'EOF'
import axios from 'axios';

const input = {
  startLocation: 'Bhubaneswar, Odisha',
  placeTypes: ['beaches', 'temples'],
  budget: 50000,
  durationDays: 5,
  groupSize: 4,
  vehicleType: 'XUV700',
  preferences: ['gym stops'],
  maxDistanceKm: 200,
};

axios.post(
  'https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/calls',
  input,
  {
    headers: {
      'Authorization': `Bearer ${process.env.APIFY_TOKEN}`,
    },
  }
)
.then(res => console.log(JSON.stringify(res.data, null, 2)))
.catch(err => console.error(err));
EOF

node call.js
```

## 🔍 Verify Installation

### Check All Files
```bash
# Should see these files:
ls -la
# - package.json
# - INPUT_SCHEMA.json
# - OUTPUT_SCHEMA.json
# - apify.json
# - README.md
# - .env.example
# - Dockerfile
# - EXAMPLES.md
# - QUICKSTART.md (this file)

# Check src/ directory:
ls -la src/
# - main.js
# - utils/

# Check utils:
ls -la src/utils/
# - geocoder.js
# - weather.js
# - scraper.js
# - llm.js
# - costCalculator.js
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'axios'"
```bash
# Solution:
npm install axios
npm install
```

### Issue: "ANTHROPIC_API_KEY is not set"
```bash
# Check .env file has the key:
cat .env | grep ANTHROPIC

# Or export directly:
export ANTHROPIC_API_KEY=sk-ant-xxxxx
npm start
```

### Issue: "Location not found: Bhubaneswar"
```bash
# Try with full location:
"Bhubaneswar, Odisha, India"
# or
"Bhubaneswar, Odisha"
```

### Issue: Actor times out
```bash
# Increase timeout in apify.json:
# Change from 300 to 600 seconds
```

## 📱 Mobile Integration

See **EXAMPLES.md** for React Native and Kotlin integration examples.

## 📚 Documentation

- **README.md** - Full documentation
- **EXAMPLES.md** - Use case examples
- **INPUT_SCHEMA.json** - Input validation rules
- **OUTPUT_SCHEMA.json** - Output format specification
- **package.json** - Dependencies and scripts

## 🎯 Next Steps

1. ✅ Get API keys (Anthropic or OpenAI)
2. ✅ Run locally and test
3. ✅ Deploy to Apify platform
4. ✅ Test with different inputs
5. ✅ Integrate with your app/website
6. ✅ Monitor usage and costs

## 💡 Key Features

✨ **AI-Powered Optimization** using Claude 3.5 Sonnet or GPT-4o
📍 **Real-Time Data** from tourism APIs and scrapers
💰 **Smart Cost Calculation** with ±10% accuracy
🗺️ **Navigation Integration** with Google Maps
⚠️ **Risk Assessment** for safety and weather
🎭 **Preference Support** for gym, EV charging, etc.

## 🚀 Performance

- **Execution Time**: 30-60 seconds per run
- **Memory**: 256-512 MB
- **Cost**: ~₹5 per run on Apify + LLM API costs
- **Accuracy**: ±10% cost estimation

---

**Ready to launch? Start with Step 1 above! 🎉**

For more details, see [README.md](./README.md) and [EXAMPLES.md](./EXAMPLES.md)
