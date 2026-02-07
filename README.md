# Movie API

A RESTful API for accessing movie data and managing user accounts.
Built as part of the CareerFoundry Full-Stack Web Development certification.

## Live API

https://movieapi-virid.vercel.app

## Documentation

API documentation available at: https://movieapi-virid.vercel.app/documentation.html

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT via Passport.js
- **Password Hashing:** bcrypt
- **Hosting:** Vercel (API) + MongoDB Atlas (Database)

## Features

- User registration with input validation
- JWT-based authentication
- Secure password hashing
- Password confirmation required for profile updates and account deletion
- CRUD operations for user favorite movies
- Movie, genre, and director data retrieval

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | None | Authenticate and receive JWT |
| POST | `/users` | None | Register new user |
| GET | `/movies` | JWT | Get all movies |
| GET | `/movies/:Title` | JWT | Get movie by title |
| GET | `/movies/genre/:genreName` | JWT | Get genre info |
| GET | `/movies/director/:directorName` | JWT | Get director info |
| PUT | `/users/:Username` | JWT + Password | Update user info |
| POST | `/users/:Username/movies/:MovieID` | JWT | Add movie to favorites |
| DELETE | `/users/:Username/movies/:MovieID` | JWT | Remove movie from favorites |
| DELETE | `/users/:Username` | JWT + Password | Delete user account |

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local installation or Atlas account)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/elicost/movie_api.git
   cd movie_api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   CONNECTION_URI=mongodb://localhost:27017/cfDB
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. API will be available at `http://localhost:8080`




README.md template produced using Claude Code and verified by developer.