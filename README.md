# SocialApp

SocialApp is a robust, scalable backend API for a modern social networking platform. Built with Node.js, Express, TypeScript, MongoDB, and AWS S3, it provides a solid foundation for user management, content sharing, and secure media storage. The architecture emphasizes modularity, maintainability, and extensibility for future growth.

> **Status:** 🚧 _This project is under active development. Features, APIs, and structure are subject to change._

---

## Basic Features

- **User Registration & Authentication:** Secure sign-up and login with hashed passwords and JWT-based authentication.
- **Modular Architecture:** Clean separation of concerns for easy feature expansion and maintenance.
- **MongoDB Integration:** Efficient data storage and retrieval using Mongoose ODM.
- **Centralized Error Handling:** Consistent and informative error responses across the API.
- **Input Validation:** Robust request validation using Zod for data integrity.
- **Environment-Based Configuration:** Flexible setup for different environments using dotenv.
- **AWS S3 Integration:** Secure upload and storage of profile and cover images via Amazon S3.
- **Email Notifications:** Utility functions for sending emails (e.g., verification, password reset).
- **File Uploads:** Multer middleware for handling multipart/form-data and direct S3 uploads.


## Other Features
- **Send Friend Request** 
- **Accept Friend request** 
- **Delete Friend request** 
- **Block users** 
- **Freezing Posts** 
- **Create users ,Posts ,Comments and replies** 
- **Update users ,Posts ,Comments and replies** 
- **Delete users ,Posts ,Comments and replies** 


---

## Project Structure

```
src/
  bootstrap.ts
  index.ts
  routes.ts
  common/
    Enums/
      user.enum.ts
      post.enum.ts
    Interfaces/
      user.interface.ts
      post.interface.ts
      comment.interface.ts
      reply.interface.ts
    Types/
      user.type.ts
  config/
    .env
  DB/
    DBConnection.ts
    Models/
      user.model.ts
      post.model.ts
      comment.model.ts
      reply.mode.ts
    Repository/
      database.repository.ts
      post.repository.ts
      user.repository.ts
      comment.repository.ts
      reply.repository.ts
  middleware/
    validation.middleware.ts
    auth.middleware.ts
  Modules/
    postModule/
      post.controller.ts
      post.services.ts
      post.DTO.ts
      post.validation.ts
      index.ts
    userModule/
      user.controller.ts
      user.services.ts
      user.DTO.ts
      user.validation.ts
      index.ts
    commentModule/  
      comment.controller.ts
      comment.services.ts
      comment.DTO.ts
      comment.validation.ts
    replyModule/
      reply.controller.ts
      reply.services.ts
      reply.DTO.ts
      reply.validation.ts
  utils/
    Emails/
      emailEvents.ts
      generatehtml.ts
      sendEmail.ts
    multer/
      multer.ts
      s3config.ts
      s3.services.ts
    bcrypt.ts
    Error.ts
    jwt.ts
    sucessHandler.ts
```

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**
   - Copy `src/config/.env` and set your values (e.g., `PORT`, database URI, JWT secret, AWS S3 credentials).

3. **Build the project:**
   ```sh
   npx tsc
   ```

4. **Start the server:**
   ```sh
   npm start
   ```

---

## AWS S3 Configuration

To enable image uploads, add the following to your `.env` file:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
```

The S3 integration is managed in `utils/multer/s3config.ts` and `utils/multer/s3.services.ts`.

---


## Technologies Used

- **Node.js** & **Express** — Backend framework
- **TypeScript** — Type safety
- **MongoDB** & **Mongoose** — Database and ODM
- **Zod** — Input validation
- **dotenv** — Environment configuration
- **chalk** — Terminal string styling
- **AWS S3** — Cloud storage for images
- **Multer** — File upload middleware
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT authentication
- **nodemailer** — Email sending

---



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements 
