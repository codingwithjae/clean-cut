##  Link Shortener API

A Fullstack link shortener application made with **Node.js** and **React**. This application allows users to shorten URLs, manage their shortened links, and track usage statistics. It includes authentication, validation, and rate-limiting features to ensure security and scalability.

---

## Features

- **Shorten URLs**: Generate short URLs for long links.
- **Redirection**: Redirect users to the original URL using the short link.
- **User Authentication**: Secure login and registration using JWT.
- **URL Management**: Update or delete shortened URLs.
- **Rate Limiting**: Prevent abuse by limiting the number of requests.
- **Validation**: Ensure valid URLs and prevent duplicate short IDs.
- **Frontend**: A React-based interface for interacting with the API.

---

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for creating RESTful APIs.
- **Better SQLite3**: Lightweight database for storing user and URL data.
- **JWT**: JSON Web Tokens for authentication.
- **Express Rate Limit**: Middleware for rate-limiting requests.
- **Argon2**: Secure password hashing.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast development server and build tool.

