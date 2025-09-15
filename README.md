# SocialApp

A Node.js social application backend built with Express, TypeScript, and MongoDB.

## Features

- User registration with validation
- Modular structure for scalability
- MongoDB integration via Mongoose
- Centralized error handling
- Environment configuration with dotenv

## Project Structure

```
src/
  bootstrap.ts
  index.ts
  routes.ts
  common/
    Enums/
      user.enum.ts
    Interfaces/
      user.interface.ts
  config/
    .env
  DB/
    DBConnection.ts
    Models/
      user.model.ts
    Repository/
      database.repository.ts
      user.repository.ts
  middleware/
    validation.middleware.ts
  Modules/
    postModule/
      post.controller.ts
      post.services.ts
      post.validation.ts
    userModule/
      user.controller.ts
      user.services.ts
      user.validation.ts
  utils/
    Error.ts
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**
   - Copy `src/config/.env` and set your values (e.g., `PORT`, database URI).

3. **Build the project:**
   ```sh
   npx tsc
   ```

4. **Start the server:**
   ```sh
   npm start
   ```

## API Endpoints

- `POST /user/sign-up` — Register a new user

## Technologies

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Zod (validation)
- dotenv
-
