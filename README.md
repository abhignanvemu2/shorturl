# My Application

**Live Demo:** https://app.netlify.com/sites/incandescent-mooncake-132a8e/deploys/67b80450cea17de93c5218f2

---

## Overview

This is a full-stack Node.js application that incorporates Google OAuth for authentication, secure session management using Passport.js, Redis for caching, and MongoDB for persistent storage. The app is designed to be robust and scalable with an emphasis on error handling, dynamic configuration, and performance optimization.

---

## How to Run

Here’s how you can get the project running locally:

1. **Clone the Repository:**
   First, clone the repo to your local machine:
   ```bash
   git clone https://github.com/abhignanvemu2/shorturl.git
   
   cd shorturl

   npm install

2. **For run redis**
   redis-server --port 6380

3. **ENV file**
  CONNECTION_STRING=<Your MongoDB Connection String>
  PRIMARY_KEY=<Your Primary Key>
  DATABASE_ID=CortexFin
  CONTAINER_ID=users
  PORT=3000
  JWT_SECRET=<Your JWT Secret>
  ORIGIN=http://localhost:5173
  REDIS_HOST=127.0.0.1
  REDIS_PORT=6380
  REDIS_URL=redis://127.0.0.1:6380
  SESSION_SECRET=<Your Session Secret>
  GOOGLE_CLIENT_SECRET=<Your Google Client Secret>
  GOOGLE_CLIENT_ID=<Your Google Client ID>
  GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
  NODE_ENV=development


4. **Run The Project**
  npm start

---

## Features 

  **Unique URL Generation:**
  Creates short, easy-to-share links from long URLs.

  **URL Validation:**
  Verifies that submitted URLs are in the correct format and safe.

  **Scalability:**
  Handles high traffic using efficient database queries and caching.

  **Rate Limiting:**
  Limits the number of requests per user to prevent abuse.

  **Analytics Tracking:**
  Records click counts and user interactions for each shortened URL.

  **Secure OAuth Authentication:**
  Uses Google OAuth 2.0 for secure and reliable user authentication.

  **Session Management:**
  Integrates with Passport.js to manage user sessions and token storage securely.

---

## Challenges

**Unique URL Generation:**
=> Ensuring each short URL is unique while avoiding collisions.
**solution**
 - Use a base62-encoded hash (alphanumeric short codes).
 - Check for existing records in the database before inserting a new one.
 - Generate a fallback short code if a collision occurs.


**Rate Limiting & Abuse Prevention**
=> Preventing excessive API requests that could overload the system.
**solution**
 - Use express-rate-limit to limit requests per IP.
 - Implement user authentication to restrict non-logged-in users.
 - Log and monitor unusual activity for further action.


**Handling Asynchronous Database Operations**
=> Preventing race conditions and ensuring database transactions complete properly.
**solution**
 - Use async/await with proper error handling.
 - Use database transactions (if supported) to ensure atomicity.
 - Implement retries for failed operations.


**Google OAuth Flow Management**
=> Handling Google authentication, token storage, and session expiry.
**solution**
 - Use passport-google-oauth20 for easy Google Sign-In integration.

