# AI-Powered Second-Hand Car Marketplace

A modern, intelligent platform for buying and selling used cars, powered by 6 specialized AI models.

## Features

### For Buyers
- **Smart Search & Filtering** - Find cars by brand, price, fuel type, and more
- **AI Recommendations** - Personalized car suggestions based on your preferences
- **Price Analysis** - See if a car is priced fairly with AI predictions
- **Fraud Detection** - Get alerts about suspicious listings
- **Virtual Assistant** - Ask questions and get instant answers
- **Insurance Estimates** - Calculate insurance costs before buying

### For Sellers
- **Easy Listing Creation** - Simple form to list your car
- **AI Analysis** - Get instant feedback on your listing quality
- **Price Suggestions** - AI-powered price recommendations
- **Performance Tracking** - Monitor views, favorites, and engagement
- **Fraud Prevention** - Automatic checks to ensure listing authenticity

### For Administrators
- **Moderation Dashboard** - Review and approve listings
- **Fraud Alerts** - AI-powered fraud detection system
- **User Management** - Manage buyers, sellers, and their activities
- **Analytics** - Platform-wide statistics and insights

## AI Models

The platform integrates 6 specialized AI models:

1. **Car Listing Analyzer** (Ahmed Kolsi) - Vision + NLP for image and text analysis
2. **Price Prediction Engine** (Motaz ben chikh) - ML regression for price estimation
3. **Fraud Detection** (Mayyara haj yahia) - Anomaly detection for security
4. **Recommendation System** (Nour chehida) - Personalized car matching
5. **Virtual Assistant** (Adam hachana) - NLP chatbot for user support
6. **Insurance Risk Analyzer** (Ilyes chaabani) - Risk assessment and premium estimation

See [docs/AI_MODELS.md](docs/AI_MODELS.md) for detailed documentation.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Authentication:** Mock auth (ready for Supabase/NextAuth)
- **Database:** Mock data (ready for Supabase/Neon)
- **AI Integration:** REST API endpoints (ready for ML models)

## Project Structure

\`\`\`
├── app/
│   ├── api/ai/              # AI model API endpoints
│   ├── buyer/               # Buyer dashboard and pages
│   ├── seller/              # Seller dashboard and pages
│   ├── admin/               # Admin moderation panel
│   ├── login/               # Authentication pages
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── navbar.tsx           # Navigation component
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── mock-data.ts         # Mock data and utilities
│   ├── auth-context.tsx     # Authentication context
│   └── ai-models.ts         # AI model integration layer
├── docs/
│   └── AI_MODELS.md         # AI models documentation
└── public/                  # Static assets
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

### Test Accounts

Use these credentials to test different user roles:

- **Buyer:** buyer@example.com (any password)
- **Seller:** seller@example.com (any password)
- **Admin:** admin@example.com (any password)

## Development Roadmap

### Phase 1: UI & Mock Data ✅
- [x] Authentication system
- [x] Buyer dashboard and search
- [x] Seller dashboard and listing management
- [x] Admin moderation panel
- [x] AI API scaffolding

### Phase 2: Database Integration
- [ ] Set up Supabase/Neon database
- [ ] Implement real authentication
- [ ] Create database schema
- [ ] Migrate from mock data

### Phase 3: AI Model Integration
- [ ] Train and deploy ML models
- [ ] Replace mock AI endpoints
- [ ] Optimize performance
- [ ] Add monitoring and logging

### Phase 4: Production Features
- [ ] Real-time messaging
- [ ] Payment integration
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Performance optimization

## AI Model Integration

Each AI model has:
- A dedicated API endpoint in `/app/api/ai/`
- Type-safe client function in `lib/ai-models.ts`
- Mock implementation for development
- Documentation in `docs/AI_MODELS.md`

To integrate a real ML model:
1. Replace the mock logic in the API endpoint
2. Keep the same input/output interface
3. Test with existing UI components

## Contributing

This is a team project. Each AI model has an assigned team member:

- Ahmed Kolsi - Car Listing Analyzer
- Motaz ben chikh - Price Prediction Engine
- Mayyara haj yahia - Fraud Detection
- Nour chehida - Recommendation System
- Adam hachana - Virtual Assistant
- Ilyes chaabani - Insurance Risk Analyzer

## License

This project is for educational purposes.
