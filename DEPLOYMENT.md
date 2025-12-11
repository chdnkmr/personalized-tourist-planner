# Deployment Guide - Personalized Tourist Planner

## 📋 Pre-Deployment Checklist

- [ ] Node.js 20+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] API keys obtained (Anthropic or OpenAI)
- [ ] `.env` file configured with API keys
- [ ] Local testing completed successfully
- [ ] Apify account created
- [ ] Apify CLI installed (`npm install -g apify-cli`)
- [ ] Git repository initialized (optional)

## 🔑 Getting API Keys

### Anthropic Claude
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or login
3. Navigate to "API Keys"
4. Create new key
5. Copy to `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```

### OpenAI GPT-4o
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or login
3. Go to "API Keys" section
4. Create new secret key
5. Copy to `.env`:
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   ```

### Apify Token
1. Visit [console.apify.com](https://console.apify.com)
2. Go to "Settings" → "Integrations"
3. Find "API token"
4. Copy for CLI authentication

## 🚀 Deployment Steps

### Step 1: Local Validation
```bash
# Navigate to project
cd /Users/chandankumar/VS_Workspace/ApifyWorkspace/Tourplanner

# Install dependencies
npm install

# Test with sample input
cat > test-input.json << 'EOF'
{
  "startLocation": "Bhubaneswar, Odisha",
  "placeTypes": ["beaches"],
  "budget": 50000,
  "durationDays": 3,
  "groupSize": 2,
  "vehicleType": "sedan",
  "preferences": [],
  "maxDistanceKm": 100
}
EOF

# Run locally
APIFY_INPUT_FILE_PATH=test-input.json npm start
```

### Step 2: Apify CLI Setup
```bash
# Install CLI globally
npm install -g apify-cli

# Verify installation
apify --version

# Login to Apify
apify login
# Paste your API token when prompted
```

### Step 3: Create Actor
```bash
# Initialize as Apify actor
apify create personalized-tourist-planner

# This creates/updates:
# - apify.json
# - Dockerfile
# - .dockerignore
```

### Step 4: Push to Apify
```bash
# Deploy to Apify platform
apify push

# Output shows actor URL:
# Your actor is ready at:
# https://console.apify.com/actors/your-username/personalized-tourist-planner
```

### Step 5: Test on Platform
```bash
# Call actor with default input
apify call

# Or with custom input file
apify call --input test-input.json

# View results
apify call --return-dataset-table
```

## 🐳 Docker Build (Local)

### Build Locally
```bash
# Build Docker image
docker build -t personalized-tourist-planner:latest .

# Run container locally
docker run --env-file .env personalized-tourist-planner:latest
```

### Using Docker Compose
```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  tourist-planner:
    build: .
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
    volumes:
      - ./storage:/app/storage
EOF

# Run with compose
docker-compose up
```

## 🔐 Environment Variables

### Required for Apify
```bash
# For local development
APIFY_TOKEN=your-token

# For CLI operations
APIFY_CLI_AUTH_TOKEN=your-token
```

### Required for LLM
```bash
# Choose one:
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Required for Claude
OPENAI_API_KEY=sk-xxxxx          # Required for GPT-4o
```

### Optional
```bash
LOG_LEVEL=debug                  # For debugging
NODE_ENV=production              # Production mode
ACTOR_MEMORY_MBYTES=512
ACTOR_TIMEOUT_SECS=300
```

## 📊 Apify Console Configuration

### Actor Settings
1. **Name**: personalized-tourist-planner
2. **Category**: TRAVEL, DATA_ANALYSIS
3. **Memory**: 512 MB (default)
4. **Timeout**: 300 seconds (5 minutes)
5. **Dockerfile**: Use provided Dockerfile

### Build Configuration
1. **Node.js Version**: 20
2. **npm Packages**: All in package.json
3. **Build Time**: ~3-5 minutes

### Run Configuration
1. **Input Schema**: Use INPUT_SCHEMA.json
2. **Output Format**: JSON dataset
3. **Concurrency**: 1 (or based on tier)

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
```yaml
name: Deploy to Apify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install -g apify-cli
      - run: apify login --token ${{ secrets.APIFY_TOKEN }}
      - run: apify push
```

## 💰 Cost Optimization

### Memory Settings
- **Minimum**: 256 MB (may timeout for complex queries)
- **Recommended**: 512 MB
- **Maximum**: 1024+ MB (for large datasets)

### Timeout Settings
- **Minimum**: 60 seconds (for simple queries)
- **Recommended**: 300 seconds
- **Maximum**: 600+ seconds (for complex optimization)

### API Usage Costs
```
Monthly estimate (100 runs):
- Apify Actor: ₹500
- Anthropic Claude: $0.50-5
- OpenAI GPT-4o: $1-10
- Free APIs: Nominatim, Open-Meteo
Total: ₹500-1000/month
```

## 🧪 Monitoring & Debugging

### View Logs
```bash
# Real-time logs
apify call --tail

# Or on Apify Console:
# Runs → Select Run → Logs tab
```

### Monitor Performance
```bash
# Check run duration
apify info

# View dataset results
apify dataset get-items
```

### Error Handling
- Check `.env` API keys are valid
- Verify location format: "City, State"
- Ensure budget > 10,000
- Check max-distance > 50km

## ✅ Post-Deployment

### Verification
1. ✅ Actor appears in console
2. ✅ Can be called via CLI
3. ✅ Generates valid JSON output
4. ✅ Cost calculations within ±10%
5. ✅ Weather data populated
6. ✅ Attractions listed correctly

### Testing Different Inputs
```bash
# Beach holiday
apify call --input '{"startLocation":"Goa, India","placeTypes":["beaches"],"budget":40000,"durationDays":4,"groupSize":3,"vehicleType":"sedan","maxDistanceKm":150}'

# Hill station
apify call --input '{"startLocation":"Shimla, Himachal Pradesh","placeTypes":["hills"],"budget":60000,"durationDays":5,"groupSize":4,"vehicleType":"suv","maxDistanceKm":300}'

# Adventure trip
apify call --input '{"startLocation":"Rishikesh, Uttarakhand","placeTypes":["adventure"],"budget":50000,"durationDays":4,"groupSize":5,"vehicleType":"bus","maxDistanceKm":200}'
```

### Share with Users
1. **Apify Console URL**: Share actor URL
2. **API Endpoint**: Provide REST API endpoint
3. **Example Input**: Include sample JSON
4. **Documentation**: Share README.md link

## 🔄 Updates & Maintenance

### Update Actor Code
```bash
# Make changes locally
# Run npm start to test
# Then push:
apify push
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update axios

# Update all
npm install
apify push
```

### Version Management
```bash
# In package.json
"version": "1.0.0"  # Increment for updates

# In apify.json
"version": "1.0.0"  # Keep in sync
```

## 📱 Mobile App Integration

### API Endpoint
```
https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/calls
```

### Example REST Call
```bash
curl -X POST \
  https://api.apify.com/v2/acts/YOUR_USERNAME/personalized-tourist-planner/calls \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  -d '{
    "startLocation":"Bhubaneswar, Odisha",
    "placeTypes":["beaches"],
    "budget":50000,
    "durationDays":5,
    "groupSize":4,
    "vehicleType":"XUV700",
    "preferences":["gym stops"],
    "maxDistanceKm":500
  }'
```

### Webhook Integration
Configure webhooks in Apify Console for:
- Run started
- Run succeeded
- Run failed
- Dataset items available

## 🆘 Troubleshooting

### Actor Not Building
```
Solution:
1. Check Dockerfile syntax
2. Verify Node.js version compatibility
3. Check npm packages install correctly locally
4. Review build logs on Apify Console
```

### API Key Issues
```
Solution:
1. Verify API key format
2. Check API key has necessary permissions
3. Ensure API key not expired
4. Try with different provider if one fails
```

### High Memory Usage
```
Solution:
1. Reduce attractions database
2. Limit geocoding requests
3. Cache weather forecasts
4. Implement request batching
```

### Slow Execution (>60 seconds)
```
Solution:
1. Increase actor timeout to 600 seconds
2. Optimize LLM prompts (smaller context)
3. Cache API responses
4. Use faster LLM model (Claude Haiku)
```

## 📞 Support Resources

- **Apify Documentation**: [docs.apify.com](https://docs.apify.com)
- **Anthropic Docs**: [docs.anthropic.com](https://docs.anthropic.com)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **GitHub Issues**: Report issues in repository
- **Apify Community**: [community.apify.com](https://community.apify.com)

---

**Deployment Complete! 🎉 Your actor is now live on Apify Platform.**

For detailed usage, see [README.md](./README.md) and [EXAMPLES.md](./EXAMPLES.md)
