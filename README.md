# Blog App Backend

A robust and scalable blog application backend built with Node.js, Express, and MongoDB. This application provides comprehensive user authentication, blog management, and file upload capabilities with JWT-based security.

## 🚀 Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Password Security**: Bcrypt encryption for secure password storage
- **Token Management**: Access token and refresh token system for enhanced security
- **File Upload**: File upload support using Multer with cloud storage integration via Cloudinary
- **API Error Handling**: Centralized error handling and standardized API responses
- **CORS Support**: Cross-Origin Resource Sharing enabled for frontend integration
- **Cookie Management**: Secure cookie-based token storage
- **Async Error Handling**: Custom async handler for clean error management
- **Database Integration**: MongoDB integration using Mongoose ODM

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas cloud database)
- **Cloudinary Account** (for image uploads)
- **Environment Variables** configured

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── index.js                        # Application entry point
│   ├── constant.js                     # Application constants (database name)
│   │
│   ├── controllers/
│   │   └── user.controllers.js         # User-related endpoint controllers
│   │
│   ├── models/
│   │   └── user.model.js               # User schema and model definition
│   │
│   ├── routes/                         # API route definitions
│   │
│   ├── middlewares/
│   │   ├── auth.middlewares.js         # JWT verification middleware
│   │   └── multer.middlewares.js       # File upload middleware configuration
│   │
│   ├── db/
│   │   └── connect.db.js               # MongoDB connection setup
│   │
│   ├── utils/
│   │   ├── apierror.js                 # Centralized error response class
│   │   ├── apiresponse.js              # Standardized API response class
│   │   ├── asynchandler.js             # Async function error handler wrapper
│   │   └── cloudinary.upload.js        # Cloudinary file upload integration
│   │
│   └── public/
│       └── temp/                       # Temporary file storage for uploads
│
├── package.json                        # Project dependencies and scripts
└── .env.example                        # Environment variables template (create as .env)
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Blog-App/server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**

Edit `.env` file and add the following variables:

```env
# Database Configuration
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net

# JWT Configuration
JWT_TOKEN_SECRET=your_jwt_secret_key_here
JWT_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 📦 Dependencies

### Production Dependencies
- **express** (^5.2.1) - Web framework
- **mongoose** (^9.6.3) - MongoDB ODM
- **bcrypt** (^6.0.0) - Password hashing
- **jsonwebtoken** (^9.0.3) - JWT token generation and verification
- **multer** (^2.1.1) - File upload handling
- **cloudinary** (^2.10.0) - Cloud file storage
- **dotenv** (^17.4.2) - Environment variable management
- **cors** (^2.8.6) - Cross-Origin Resource Sharing
- **cookie-parser** (^1.4.7) - Cookie middleware

### Development Dependencies
- **nodemon** (^3.1.14) - Auto-restart development server

## 🚀 Getting Started

1. **Start the development server**
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT)

2. **Server will automatically restart** on file changes thanks to Nodemon

## 📚 API Structure

### Authentication Middleware
- **Path**: `src/middlewares/auth.middlewares.js`
- **Middleware**: `verifyJWT` - Validates JWT tokens from cookies or Authorization headers

### User Model
- **Location**: `src/models/user.model.js`
- **Fields**:
  - `firstName` (String, required) - User's first name
  - `lastName` (String, required) - User's last name
  - `email` (String, required, unique) - User's email
  - `password` (String, required) - Encrypted password
  - `avatar` (String) - User profile picture URL
  - `refreshToken` (String) - Token for refreshing access token
  - `timestamps` - Auto-generated createdAt and updatedAt

### Key Methods
- `comparePassword()` - Verify password during login
- `generateAccessToken()` - Create short-lived access token
- `generateRefreshToken()` - Create long-lived refresh token

## 🔐 Security Features

- **Password Encryption**: Passwords are hashed using bcrypt with salt rounds of 10
- **JWT Authentication**: Tokens include user id, email, and name with configurable expiration
- **Access Control**: Protected routes require valid JWT tokens
- **CORS Configuration**: Controlled cross-origin requests
- **Cookie Security**: Tokens stored securely in HTTP-only cookies
- **Error Messages**: Standardized error responses without sensitive data exposure

## 📁 Utility Functions

### `asynchandler.js`
Wrapper function for async route handlers to catch errors automatically and pass them to the next middleware.

### `apierror.js`
Standardized error class for consistent API error responses with:
- Status code
- Error message
- Error details array
- Success flag (false for errors)

### `apiresponse.js`
Standardized response class for consistent API responses with:
- Status code
- Message
- Data payload
- Success flag (true for responses with status < 400)

## 🔄 File Upload

### Multer Configuration
- **Location**: `src/middlewares/multer.middlewares.js`
- **Storage**: Temporary local storage in `src/public/temp/`
- **File Naming**: Timestamp-based naming with original extension

### Cloudinary Integration
- **Location**: `src/utils/cloudinary.upload.js`
- Handles file upload to cloud storage
- Clean up temporary files after upload

## 💾 Database

- **Database Name**: `blogApp` (defined in `src/constant.js`)
- **ODM**: Mongoose
- **Connection**: Centralized in `src/db/connect.db.js`

## 🛠 Development Workflow

1. **Make changes** to your code
2. **Nodemon automatically restarts** the server
3. **Check console** for any errors or logs
4. **Test API** endpoints using Postman or similar tools

## 📝 Available Scripts

```bash
# Start development server with auto-reload
npm start

# Install dependencies
npm install
```

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code structure
2. Use async/await with asyncHandler wrapper
3. Use ApiResponse and ApiError for consistent responses
4. Add proper error handling
5. Document complex functions

## 📖 Best Practices Implemented

- ✅ Centralized error handling
- ✅ Standardized API responses
- ✅ Environment variable management
- ✅ Async/await patterns with error handling
- ✅ JWT token management
- ✅ Password security with bcrypt
- ✅ CORS and cookie security
- ✅ Modular project structure
- ✅ Separation of concerns

## 🚨 Troubleshooting

### MongoDB Connection Failed
- Verify `MONGO_URL` in `.env` file
- Check if MongoDB instance is running
- Ensure network access is allowed in MongoDB Atlas

### JWT Errors
- Verify `JWT_TOKEN_SECRET` is set in `.env`
- Check token expiration time
- Ensure token is being sent correctly in requests

### File Upload Issues
- Check if `src/public/temp/` directory exists
- Verify Cloudinary credentials are correct
- Ensure file permissions are set properly

## 📞 Support

For issues or questions, please check the project documentation or create an issue in the repository.

## 📄 License

ISC License

---

**Happy Coding!** 🎉
