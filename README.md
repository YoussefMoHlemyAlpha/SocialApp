# SocialApp

SocialApp is a modern backend API for a social networking platform, built with Node.js, Express, TypeScript, and MongoDB. The project is designed with scalability, modularity, and maintainability in mind.

> **Status:** 🚧 _This project is under active development. Features, APIs, and structure are subject to change._


## Features

- User registration and authentication
- Modular architecture for easy feature expansion
- MongoDB integration using Mongoose
- Centralized error handling
- Input validation with Zod
- Environment-based configuration

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
    Types
      user.type.ts
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
    auth.middleware.ts
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
    Emails/
      emailEvents.ts
      generatehtml.ts
      sendEmail.ts
     bcrypt.ts
     Error.ts
     jwt.ts
     sucessHandler.ts
    
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
- chalk
