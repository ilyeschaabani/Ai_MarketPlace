# AI Models Documentation

This document describes the 6 AI models integrated into the AI Car Marketplace platform.

## Overview

The platform uses 6 specialized AI models to provide intelligent features for buyers, sellers, and administrators.

## Model 1: Car Listing Analyzer

**Responsible:** Ahmed Kolsi  
**Technology:** Vision (CNN) + NLP  
**Phase:** Modeling

### Purpose
Automatically analyze car listing images and descriptions to assess quality and completeness.

### Inputs
- Images (array of URLs)
- Description text
- Title

### Outputs
- Image quality score (0-100)
- Detected features (array of strings)
- Description completeness score (0-100)
- Suggestions for improvement

### Algorithm
- **Vision:** Convolutional Neural Networks (CNN) for image analysis
- **NLP:** Natural Language Processing for text analysis

### Integration Points
- `/api/ai/analyze-listing` - REST endpoint
- `analyzeCarListing()` - Client function in `lib/ai-models.ts`

### Usage Example
\`\`\`typescript
const analysis = await analyzeCarListing({
  images: ['url1', 'url2'],
  description: 'Car description...',
  title: 'Peugeot 208 GTi'
})
\`\`\`

---

## Model 2: Price Prediction Engine

**Responsible:** Motaz ben chikh  
**Technology:** Machine Learning / Regression  
**Phase:** Modeling

### Purpose
Predict fair market price for used cars based on characteristics.

### Inputs
- Brand, Model
- Year, Mileage
- Fuel Type, Transmission
- Condition (optional)

### Outputs
- Predicted price (TND)
- Confidence score (0-1)
- Contributing factors with impact values

### Algorithm
- **Regression Models:** Random Forest, Gradient Boosting
- **Features:** Vehicle specs, market trends, historical data

### Integration Points
- `/api/ai/predict-price` - REST endpoint
- `predictCarPrice()` - Client function

### Usage Example
\`\`\`typescript
const prediction = await predictCarPrice({
  brand: 'Peugeot',
  model: '208 GTi',
  year: 2019,
  mileage: 45000,
  fuelType: 'essence',
  transmission: 'manual'
})
\`\`\`

---

## Model 3: Fraud & Authenticity Detection

**Responsible:** Mayyara haj yahia  
**Technology:** Anomaly Detection  
**Phase:** Modeling

### Purpose
Detect fraudulent listings and suspicious patterns to protect users.

### Inputs
- Listing ID
- Price vs Predicted Price
- Images
- Description
- Seller history (optional)

### Outputs
- Fraud score (0-100)
- Risk level (low/medium/high)
- Specific alerts
- Image authenticity score
- Price anomaly flag

### Algorithm
- **Anomaly Detection:** Isolation Forest, One-Class SVM
- **Image Analysis:** Reverse image search, manipulation detection
- **Pattern Recognition:** Behavioral analysis

### Integration Points
- `/api/ai/detect-fraud` - REST endpoint
- `detectFraud()` - Client function

### Usage Example
\`\`\`typescript
const fraudCheck = await detectFraud({
  listingId: '123',
  price: 28000,
  predictedPrice: 27500,
  images: ['url1', 'url2'],
  description: 'Description...'
})
\`\`\`

---

## Model 4: Buyer-Seller Matching & Recommendation

**Responsible:** Nour chehida  
**Technology:** Recommendation System  
**Phase:** Modeling

### Purpose
Match buyers with relevant car listings based on preferences and behavior.

### Inputs
- User ID
- Preferences (brands, price range, fuel types, etc.)
- Search history
- Favorite listings

### Outputs
- Recommended listings with scores
- Reasons for each recommendation

### Algorithm
- **Collaborative Filtering:** User-based and item-based
- **Content-Based Filtering:** Feature matching
- **Hybrid Approach:** Combining both methods

### Integration Points
- `/api/ai/recommendations` - REST endpoint
- `getRecommendations()` - Client function

### Usage Example
\`\`\`typescript
const recommendations = await getRecommendations({
  userId: 'user123',
  preferences: {
    brands: ['Peugeot', 'Renault'],
    priceRange: { min: 20000, max: 30000 }
  }
})
\`\`\`

---

## Model 5: Virtual Car Assistant

**Responsible:** Adam hachana  
**Technology:** NLP / RAG Chatbot  
**Phase:** Modeling

### Purpose
Provide intelligent conversational assistance for car-related questions.

### Inputs
- User message
- Context (listing ID, user ID, conversation history)

### Outputs
- Assistant response
- Sources (optional)
- Suggested actions

### Algorithm
- **NLP:** Natural Language Understanding
- **RAG:** Retrieval-Augmented Generation
- **Knowledge Base:** Car specifications, market data, FAQs

### Integration Points
- `/api/ai/chat` - REST endpoint
- `chatWithAssistant()` - Client function

### Usage Example
\`\`\`typescript
const response = await chatWithAssistant({
  message: 'What is the average price for a 2019 Peugeot 208?',
  context: {
    userId: 'user123'
  }
})
\`\`\`

---

## Model 6: Insurance Risk Analyzer

**Responsible:** Ilyes chaabani  
**Technology:** Classification & Regression  
**Phase:** Modeling

### Purpose
Analyze insurance risk and estimate premium costs for vehicles.

### Inputs
- Vehicle details (brand, model, year, mileage)
- Driver age (optional)
- Driver history (optional)

### Outputs
- Risk score (0-100)
- Risk category (low/medium/high)
- Estimated annual premium (TND)
- Contributing factors

### Algorithm
- **Classification:** Risk category prediction
- **Regression:** Premium estimation
- **Features:** Vehicle age, mileage, driver profile, accident history

### Integration Points
- `/api/ai/insurance-risk` - REST endpoint
- `analyzeInsuranceRisk()` - Client function

### Usage Example
\`\`\`typescript
const insurance = await analyzeInsuranceRisk({
  brand: 'Peugeot',
  model: '208 GTi',
  year: 2019,
  mileage: 45000,
  driverAge: 28
})
\`\`\`

---

## Integration Architecture

### API Layer
All AI models are exposed through REST API endpoints in `/app/api/ai/`.

### Client Layer
Type-safe client functions are provided in `lib/ai-models.ts`.

### Data Flow
1. User action triggers AI analysis
2. Client function calls API endpoint
3. API endpoint processes request (currently mock, ready for real ML models)
4. Response returned to client
5. UI updated with AI insights

### Deployment Strategy
- **Phase 1 (Current):** Mock implementations for UI development
- **Phase 2:** Replace with actual ML models
- **Phase 3:** Optimize and scale

### Performance Considerations
- Parallel execution where possible (`runFullListingAnalysis`)
- Caching for repeated analyses
- Async processing for heavy computations
- Rate limiting for API protection

---

## Next Steps for ML Team

1. **Data Collection:** Gather training data for each model
2. **Model Training:** Train and validate models
3. **API Integration:** Replace mock endpoints with real ML inference
4. **Testing:** Validate accuracy and performance
5. **Monitoring:** Set up logging and metrics
6. **Optimization:** Improve speed and accuracy based on real usage

---

## Contact

For questions about specific models, contact the responsible team member listed in each section.
