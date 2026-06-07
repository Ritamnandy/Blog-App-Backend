# Blog App Backend

A modern, feature-rich Node.js and Express backend for a comprehensive blogging platform. Built with MongoDB, JWT authentication, OAuth integration, and cloud-based image management.

## 🌟 Features

### Authentication & Security
- **Email/Password Authentication**: User registration and login with email verification
- **Google OAuth 2.0**: Seamless Google sign-in integration with Passport.js
- **JWT Tokens**: Secure access and refresh token generation
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage
- **HTTP-Only Cookies**: Secure token storage in httpOnly cookies
- **Email Verification**: Verification code-based email confirmation with expiry
- **Password Reset**: Forgot password functionality with email-based reset links

### Blog Management
- **Full CRUD Operations**: Create, read, update, and delete blog posts
- **Blog Status**: Draft, published, and archived states
- **Thumbnail Images**: Blog post cover images with Cloudinary integration
- **Comments System**: Add, update, and delete comments on blog posts
- **Likes Feature**: Like and unlike blog posts with count tracking
- **Author Tracking**: Blog ownership and author information

### File Management & Storage
- **Cloudinary Integration**: Cloud-based image storage and optimization
- **Multer Middleware**: Local file upload handling with validation
- **Avatar Support**: User profile picture management

### Performance & Reliability
- **Rate Limiting**: Express rate limiter to prevent abuse (500 requests per 15 minutes)
- **Compression**: Gzip compression for optimized response sizes
- **CORS Support**: Cross-origin request handling for frontend integration
- **Request IP Tracking**: IP address logging for security and analytics
- **Session Management**: Express sessions with Passport.js
- **Request Validation**: Input validation using express-validator

### API Features
- **RESTful API**: Clean and intuitive API endpoints
- **Standardized Responses**: Consistent response format for success and error states
- **Error Handling**: Comprehensive error messages with field-level validation
- **API Documentation**: Complete endpoint documentation with examples

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Google OAuth credentials (for OAuth integration)
- SMTP service for email (Nodemailer compatible)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Blog-App/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/blogApp
DB_NAME=blogApp

# JWT Tokens
JWT_TOKEN_SECRET=your_jwt_secret_key_here
JWT_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Session
SESSION_SECRET=your_session_secret_here

# Cloudinary (Image Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### 4. Start the Server

```bash
npm start
```

The server will start on `http://localhost:5000` and connect to MongoDB.

## 📁 Project Structure

```
Blog-App/
├── README.md                     # Project documentation
├── server/
│   ├── API_DOCS.md              # Complete API documentation
│   ├── package.json             # Project dependencies
│   ├── package-lock.json        # Locked dependency versions
│   │
│   └── src/
│       ├── app.js               # Express app setup and middleware configuration
│       ├── index.js             # Server entry point with database connection
│       ├── constant.js          # Application constants and enums
│       │
│       ├── config/
│       │   └── env.config.js    # Environment variables configuration
│       │
│       ├── controllers/
│       │   ├── user.controllers.js      # User authentication and profile handlers
│       │   └── blog.controllers.js      # Blog, comment, and like handlers
│       │
│       ├── db/
│       │   └── connect.db.js    # MongoDB connection setup
│       │
│       ├── middlewares/
│       │   ├── auth.middlewares.js      # JWT verification middleware
│       │   └── multer.middlewares.js    # File upload configuration
│       │
│       ├── models/
│       │   ├── user.models.js           # User schema and methods
│       │   ├── blog.models.js           # Blog schema and fields
│       │   └── comments.models.js       # Comment schema and relationships
│       │
│       ├── passport/
│       │   └── oauth.js         # Google OAuth 2.0 strategy configuration
│       │
│       ├── routes/
│       │   ├── auth.routes.js   # Authentication endpoints
│       │   └── blog.routes.js   # Blog management endpoints
│       │
│       ├── utils/
│       │   ├── apierror.js              # Custom API error class
│       │   ├── apiresponse.js           # Standardized API response class
│       │   ├── asynchandler.js          # Async error handling wrapper
│       │   ├── cloudinary.upload.js     # Cloudinary upload utility
│       │   └── mail.js                  # Email sending utility
│       │
│       ├── validators/
│       │   ├── validate.js      # Validation middleware
│       │   └── auth/
│       │       └── user.validators.js   # User registration/login validation
│       │
│       └── public/
│           └── temp/            # Temporary file storage for uploads
```

## 🔗 API Base URL

```
http://localhost:5000/api/v1
```

### Available Routes

- **Authentication**: `/api/v1/auth` - User registration, login, verification, password reset, Google OAuth
- **Blog Operations**: `/api/v1/blog` - Blog CRUD, comments, and likes

For complete endpoint documentation, see [API_DOCS.md](server/API_DOCS.md).

## 📚 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework and routing |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **Bcrypt** | Password hashing and comparison |
| **Passport.js** | Authentication middleware |
| **Cloudinary** | Cloud image storage and optimization |
| **Multer** | File upload middleware |
| **Nodemailer** | Email sending |
| **Mailgen** | Email template generation |
| **CORS** | Cross-origin request handling |
| **express-validator** | Request validation |
| **express-rate-limit** | Rate limiting |
| **express-compression** | Response compression |
| **Nodemon** | Development server auto-reload |

## 🔐 Authentication Flow

### Email/Password Flow
```
1. User registers with email, password, and profile info
2. Verification code sent to email
3. User verifies email with code
4. Access and refresh tokens generated
5. User can now access protected routes
6. Tokens stored in httpOnly cookies
```

### Google OAuth Flow
```
1. User initiates Google login
2. Redirected to Google consent screen
3. User grants permissions
4. Google callback received
5. User created or authenticated
6. Tokens generated and stored
```

## 📝 Request/Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* response data */ },
  "success": true
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "data": null,
  "success": false,
  "error": [/* error details */]
}
```

## 🛡️ Security Features

- HTTP-only cookies for token storage
- Secure password hashing with bcrypt
- Request validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for trusted origins
- IP address tracking
- Email verification for account security
- Password reset with time-limited codes

## 🚦 Rate Limiting

- **Limit**: 500 requests per 15 minutes
- **Strategy**: IP-based rate limiting
- **Response**: 429 (Too Many Requests) status code

## 📧 Email Features

- Email verification on registration
- Password reset emails
- Verification code expiry (5 minutes)
- HTML email templates via Mailgen

## 🐛 Error Handling

The application uses a custom error handling system:

- **ApiError**: For error responses with status codes and messages
- **ApiResponse**: For successful responses with consistent formatting
- **asyncHandler**: Wrapper for async route handlers with automatic error catching

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use secure environment variables
3. Set up MongoDB Atlas for database
4. Configure Cloudinary for production
5. Use production email service
6. Set appropriate CORS origins
7. Use HTTPS for all connections

## 📖 API Documentation

For detailed API endpoints, request/response examples, and usage instructions, refer to [API_DOCS.md](server/API_DOCS.md).
        |   |-- comments.models.js
        |   |-- like.controllers.js
        |   `-- user.models.js
        |-- passport/
        |   `-- oauth.js
        |-- routes/
        |   `-- auth.router.js
        |-- utils/
        |   |-- apierror.js
        |   |-- apiresponse.js
        |   |-- asynchandler.js
        |   `-- cloudinary.upload.js
        `-- validators/
            |-- validate.js
            `-- auth/
                `-- user.validators.js
```

## Requirements

- Node.js 18 or newer recommended
- npm
- MongoDB connection string
- Google OAuth credentials if using Google login
- Cloudinary credentials if using avatar uploads

## Installation

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000

MONGODB_URL=mongodb://127.0.0.1:27017

JWT_TOKEN_SECRET=replace-with-access-token-secret
JWT_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=replace-with-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=10d

SESSION_SECRET=replace-with-session-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Start the development server:

```bash
npm start
```

The server listens on `http://localhost:<PORT>` after MongoDB connects. The database name is `blogApp`, appended in `src/db/connect.db.js`.

## Available Script

```bash
npm start
```

Runs `nodemon src/index.js`.

## Active Routes

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | No | Create a user and issue tokens |
| `POST` | `/api/v1/auth/login` | No | Log in and issue tokens |
| `POST` | `/api/v1/auth/refresh` | No | Refresh tokens using the current `Token` input |
| `POST` | `/api/v1/auth/logout` | Yes | Clear refresh token and auth cookies |
| `POST` | `/api/v1/auth/avatar` | Yes | Upload avatar with multipart field `avatar` |
| `GET` | `/api/v1/auth/google` | No | Start Google OAuth |
| `GET` | `/api/v1/auth/google/callback` | No | Google OAuth callback |

Protected routes accept either:

```text
Authorization: Bearer <accessToken>
```

or:

```text
Cookie: accessToken=<accessToken>
```

## Data Models

### User

Fields: `firstName`, `lastName`, `email`, `password`, `googleId`, `loginType`, `avatar`, `refreshToken`, timestamps.

Model methods:

- `comparePassword(password)`
- `generateAccessToken()`
- `generateRefreshToken()`

### Blog

Fields: `title`, `description`, `author`, `thumbnailImage`, `status`, `comments`, `likes`, timestamps.

Allowed statuses: `draft`, `published`, `archived`.

### Comment

Fields: `comment`, `blog`, `user`, timestamps.

### Like

Fields: `blog`, `user`, timestamps.

## Response Format

Successful responses use `ApiResponse`:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

Error responses use `ApiError`:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "error": []
}
```

## Known Current Limitations

- Blog, comment, and like models exist, but no blog/comment/like routes are mounted in `app.js` yet.
- `POST /api/v1/auth/refresh` currently looks for a field named `Token` and then references `userId`, which is not defined in that controller path.
- `POST /api/v1/auth/avatar` currently destructures `req.file.path` as `{ avatarPath }`, so avatar upload may fail until that controller uses the uploaded file path directly.
- Auth cookies are set with `secure: true`, so cookie-based auth requires HTTPS-compatible clients or adjusted local development settings.

## Development Notes

- Keep routes under `src/routes` and mount them in `src/app.js`.
- Wrap async controllers with `asyncHandler`.
- Return API payloads through `ApiResponse` and `ApiError`.
- Add validators in `src/validators` for request body checks.
- Keep new environment variables documented here and in `server/API_DOCS.md`.
