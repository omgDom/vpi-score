# VPI Score Platform

A comprehensive platform for quantifying digital creator value.

## Project Structure

```
vpi-score/
├── frontend/           # React frontend application
├── backend/           # Backend services
│   ├── auth-service/  # Authentication service
│   ├── score-service/ # Scoring service
│   ├── platform-service/ # Platform management service
│   └── payment-service/ # Payment processing service
└── docker-compose.yml # Docker configuration
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Docker and Docker Compose
- PostgreSQL

## Setup

1. Install dependencies for all services:
```bash
npm run install:all
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in each service directory
   - Update the variables as needed

3. Start the development environment:

   Option 1 - Using Docker Compose:
   ```bash
   docker-compose up
   ```

   Option 2 - Running services individually:
   ```bash
   # Start all services
   npm run start:all

   # Or start individual services
   npm run start:frontend
   npm run start:auth
   npm run start:score
   npm run start:platform
   npm run start:payment
   ```

## Development

- Frontend: http://localhost:3000
- Auth Service: http://localhost:8000
- Score Service: http://localhost:8001
- Platform Service: http://localhost:8002
- Payment Service: http://localhost:8003

## Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend/auth-service && npm test
cd backend/score-service && npm test
cd backend/platform-service && npm test
cd backend/payment-service && npm test
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT 