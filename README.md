# Movie Director API

A RESTful API service for managing movies and directors built with Node.js, TypeScript, MongoDB, and Redis.

## Project Overview

This API allows you to manage a collection of movies and their directors with the following functionalities:
- Creating, updating, retrieving, and deleting movies
- Creating and deleting directors
- Data caching with Redis for improved performance

## Technologies Used

- **Backend**: Node.js with TypeScript and Express
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Containerization**: Docker and Docker Compose
- **Testing**: Jest

## Project Structure

The application follows a clean architecture approach with the following layers:

```
movie-director-api/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # HTTP request handlers
│   ├── middlewares/      # Express middlewares including Redis caching
│   ├── models/           # MongoDB/Mongoose schemas
│   ├── repositories/     # Data access layer
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server entry point
├── tests/                # Test files
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Production Docker Compose configuration
├── docker-compose.dev.yml# Development Docker Compose configuration
├── -.postman_collection  # Postman collection for API testing
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.test.json    # TypeScript configuration for test
└── package.json          # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v14 or higher) for local development
- [Postman](https://www.postman.com/downloads/) for API testing (optional)

### Running with Docker (Production)

```bash
# Build and start all services (app, MongoDB, Redis)
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

The API will be available at http://localhost:3000

### Running for Development

1. Start MongoDB and Redis using the development Docker Compose file:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following content:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/moviedb
REDIS_HOST=localhost
REDIS_PORT=6379
```

4. Start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:3000 with hot-reloading enabled.

## Testing

This project includes unit and integration tests using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch
```

## API Documentation

### Movies Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/movies | Get all movies |
| POST   | /api/movies | Create a new movie |
| PUT    | /api/movies/:id | Update a movie |
| DELETE | /api/movies/:id | Delete a movie |

### Directors Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/directors | Create a new director |
| DELETE | /api/directors/:id | Delete a director |

### Data Models

#### Director

```json
{
  "firstName": "Martin",
  "secondName": "McDonagh",
  "birthDate": "1970-03-26T00:00:00.000Z",
  "bio": "British-Irish playwright, screenwriter, and film director known for his dark comedies and crime dramas."
}
```

#### Movie

```json
{
  "title": "In Bruges",
  "description": "Guilt-stricken after a job gone wrong, two Irish hitmen hide out in Bruges, where they encounter a series of strange and violent events.",
  "releaseDate": "2008-02-08T00:00:00.000Z",
  "genre": ["Crime", "Comedy", "Drama"],
  "rating": 7.9,
  "imdbId": "tt0780536",
  "director": "60d21b4667d0d8992e610c86" // MongoDB ObjectId
}
```

## Using the Postman Collection

This repository includes a Postman Collection for testing all API endpoints. To use it:

1. Open Postman and import the collection from the `postman` directory.
2. If the API is running locally, no configuration is needed.
3. If running with Docker, ensure you're using the correct port.

## Performance

The API utilizes Redis for caching frequently accessed endpoints to reduce database load and improve response times. The caching middleware automatically caches GET requests for a configurable period.

## Development Workflow

1. Make changes to the codebase
2. Run tests to ensure functionality: `npm test`
3. Start the development server: `npm run dev`
4. Test changes with Postman or your preferred API testing tool
5. Build for production: `npm run build`

## Troubleshooting

### Common Issues

1. **Connection errors to MongoDB or Redis:**
   - Ensure containers are running: `docker ps`
   - Check logs: `docker-compose logs mongodb` or `docker-compose logs redis`

2. **API not starting:**
   - Check the logs: `docker-compose logs app`
   - Verify environment variables are correctly set

3. **Changes not reflecting in Docker environment:**
   - Rebuild the container: `docker-compose up --build`

## License

This project is licensed under the MIT License.
