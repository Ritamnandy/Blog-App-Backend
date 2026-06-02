# Blog App Backend - API Documentation

## 📖 Table of Contents

1. [API Base URL](#api-base-url)
2. [Endpoint Summary](#endpoint-summary)
3. [Authentication APIs](#authentication-apis)
4. [User APIs](#user-apis)
5. [Blog APIs](#blog-apis)
6. [Error Responses](#error-responses)
7. [Request/Response Examples](#requestresponse-examples)
8. [Authentication](#authentication)
9. [Quick Test Commands](#quick-test-commands)
10. [Environment Setup](#environment-setup)
11. [Data Models Overview](#data-models-overview)
12. [API Flow Examples](#api-flow-examples)
13. [Common Data Fields](#common-data-fields)
14. [Testing with Postman](#testing-with-postman)
15. [API Versioning](#api-versioning)

---

## 📋 API Base URL

**Development**: `http://localhost:5000`

**Production**: `https://your-domain.com`

---

## 📌 Endpoint Summary

### Authentication Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/register` | ❌ No | Register new user |
| `POST` | `/api/auth/login` | ❌ No | User login |
| `POST` | `/api/auth/refresh-token` | ❌ No | Refresh access token |
| `POST` | `/api/auth/logout` | ✅ Yes | User logout |

### User Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/users/profile` | ✅ Yes | Get current user profile |
| `PATCH` | `/api/users/profile` | ✅ Yes | Update user profile |
| `POST` | `/api/users/change-password` | ✅ Yes | Change user password |
| `GET` | `/api/users/:userId` | ❌ No | Get user public profile |

### Blog Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/blogs` | ✅ Yes | Create blog post |
| `GET` | `/api/blogs` | ❌ No | Get all blogs |
| `GET` | `/api/blogs/:blogId` | ❌ No | Get single blog |
| `PATCH` | `/api/blogs/:blogId` | ✅ Yes | Update blog (author only) |
| `DELETE` | `/api/blogs/:blogId` | ✅ Yes | Delete blog (author only) |
| `POST` | `/api/blogs/:blogId/comments` | ✅ Yes | Add comment |
| `GET` | `/api/blogs/:blogId/comments` | ❌ No | Get comments |
| `DELETE` | `/api/blogs/:blogId/comments/:commentId` | ✅ Yes | Delete comment |
| `POST` | `/api/blogs/:blogId/like` | ✅ Yes | Like/unlike blog |

### Protected Endpoint Authentication

Use either a bearer token:

```
Authorization: Bearer <accessToken>
```

or an access token cookie:

```
Cookie: accessToken=<token>
```

### Common Response Patterns

Successful responses use this shape:

```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "success": true,
  "data": {}
}
```

Error responses use this shape:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "data": null,
  "error": ["Specific error"]
}
```

### Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `204` | No Content | Request successful, no response body |
| `400` | Bad Request | Invalid input or validation error |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but insufficient permissions |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Resource already exists |
| `422` | Unprocessable Entity | Validation error |
| `500` | Server Error | Internal server error |

---

## 🔐 Authentication APIs

### 1. User Registration

**Endpoint**: `POST /api/auth/register`

**Description**: Register a new user account with email and password.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (201 - Created):
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "john",
    "lastName": "doe",
    "email": "john.doe@example.com",
    "avatar": "",
    "createdAt": "2026-06-02T10:30:00.000Z",
    "updatedAt": "2026-06-02T10:30:00.000Z"
  }
}
```

**Error Response** (400 - Bad Request):
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "success": false,
  "data": null,
  "error": ["User with this email already registered"]
}
```

**Status Codes**:
- `201` - User created successfully
- `400` - Invalid input or email already exists
- `500` - Server error

---

### 2. User Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user and return access token and refresh token.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "User logged in successfully",
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "john",
      "lastName": "doe",
      "email": "john.doe@example.com",
      "avatar": "https://cloudinary.com/...",
      "createdAt": "2026-06-02T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401 - Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "success": false,
  "data": null,
  "error": ["Incorrect email or password"]
}
```

**Cookies Set**:
- `accessToken` - Expires in 7 days
- `refreshToken` - Expires in 30 days

**Status Codes**:
- `200` - Login successful
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### 3. Refresh Access Token

**Endpoint**: `POST /api/auth/refresh-token`

**Description**: Generate a new access token using the refresh token.

**Request Headers**:
```
Content-Type: application/json
Cookie: refreshToken=<token>
```

**Request Body**:
```json
{}
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Access token refreshed successfully",
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401 - Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized request",
  "success": false,
  "data": null,
  "error": ["Invalid refresh token"]
}
```

**Status Codes**:
- `200` - Token refreshed successfully
- `401` - Invalid or expired refresh token
- `500` - Server error

---

### 4. User Logout

**Endpoint**: `POST /api/auth/logout`

**Description**: Logout user and clear authentication tokens.

**Request Headers**:
```
Authorization: Bearer <accessToken>
or
Cookie: accessToken=<token>
```

**Request Body**:
```json
{}
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "User logged out successfully",
  "success": true,
  "data": null
}
```

**Error Response** (401 - Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized request",
  "success": false,
  "data": null,
  "error": ["access token not found"]
}
```

**Status Codes**:
- `200` - Logout successful
- `401` - Unauthorized
- `500` - Server error

---

## 👤 User APIs

### 1. Get Current User Profile

**Endpoint**: `GET /api/users/profile`

**Description**: Retrieve the profile of the currently logged-in user.

**Request Headers**:
```
Authorization: Bearer <accessToken>
or
Cookie: accessToken=<token>
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "User profile fetched successfully",
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "john",
    "lastName": "doe",
    "email": "john.doe@example.com",
    "avatar": "https://cloudinary.com/...",
    "createdAt": "2026-06-02T10:30:00.000Z",
    "updatedAt": "2026-06-02T10:30:00.000Z"
  }
}
```

**Error Response** (401 - Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized request",
  "success": false,
  "data": null,
  "error": ["Invalid access token"]
}
```

**Status Codes**:
- `200` - Profile fetched successfully
- `401` - Unauthorized
- `500` - Server error

---

### 2. Update User Profile

**Endpoint**: `PATCH /api/users/profile`

**Description**: Update user profile information (first name, last name, avatar).

**Request Headers**:
```
Content-Type: multipart/form-data
Authorization: Bearer <accessToken>
or
Cookie: accessToken=<token>
```

**Request Body** (form-data):
```
firstName: "Jane"
lastName: "Smith"
avatar: <image_file>
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "User profile updated successfully",
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "jane",
    "lastName": "smith",
    "email": "john.doe@example.com",
    "avatar": "https://cloudinary.com/...",
    "updatedAt": "2026-06-02T11:00:00.000Z"
  }
}
```

**Error Response** (400 - Bad Request):
```json
{
  "statusCode": 400,
  "message": "Invalid update data",
  "success": false,
  "data": null,
  "error": ["Please provide at least one field to update"]
}
```

**Status Codes**:
- `200` - Profile updated successfully
- `400` - Invalid input data
- `401` - Unauthorized
- `500` - Server error

---

### 3. Change Password

**Endpoint**: `POST /api/users/change-password`

**Description**: Change user password.

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <accessToken>
or
Cookie: accessToken=<token>
```

**Request Body**:
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Password changed successfully",
  "success": true,
  "data": null
}
```

**Error Response** (400 - Bad Request):
```json
{
  "statusCode": 400,
  "message": "Invalid password",
  "success": false,
  "data": null,
  "error": ["Old password is incorrect"]
}
```

**Status Codes**:
- `200` - Password changed successfully
- `400` - Invalid old password
- `401` - Unauthorized
- `500` - Server error

---

## 📝 Blog APIs

### 1. Create Blog Post

**Endpoint**: `POST /api/blogs`

**Description**: Create a new blog post.

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <accessToken>
or
Cookie: accessToken=<token>
```

**Request Body**:
```json
{
  "title": "Getting Started with Node.js",
  "description": "A beginner's guide to Node.js development",
  "content": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
  "tags": ["nodejs", "javascript", "backend"]
}
```

**Response** (201 - Created):
```json
{
  "statusCode": 201,
  "message": "Blog post created successfully",
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "title": "Getting Started with Node.js",
    "description": "A beginner's guide to Node.js development",
    "content": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    "author": "507f1f77bcf86cd799439011",
    "tags": ["nodejs", "javascript", "backend"],
    "createdAt": "2026-06-02T10:30:00.000Z",
    "updatedAt": "2026-06-02T10:30:00.000Z"
  }
}
```

**Status Codes**:
- `201` - Blog post created successfully
- `400` - Invalid input data
- `401` - Unauthorized
- `500` - Server error

---

### 2. Get All Blog Posts

**Endpoint**: `GET /api/blogs`

**Description**: Retrieve all blog posts with pagination and filtering.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `tag` (optional): Filter by tag
- `search` (optional): Search by title or content

**Request Example**:
```
GET /api/blogs?page=1&limit=10&tag=nodejs
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Blog posts fetched successfully",
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "607f1f77bcf86cd799439012",
        "title": "Getting Started with Node.js",
        "description": "A beginner's guide to Node.js development",
        "author": {
          "_id": "507f1f77bcf86cd799439011",
          "firstName": "john",
          "lastName": "doe",
          "avatar": "https://cloudinary.com/..."
        },
        "tags": ["nodejs", "javascript", "backend"],
        "views": 150,
        "createdAt": "2026-06-02T10:30:00.000Z"
      }
    ],
    "totalBlogs": 25,
    "currentPage": 1,
    "totalPages": 3
  }
}
```

**Status Codes**:
- `200` - Blogs fetched successfully
- `500` - Server error

---

### 3. Get Single Blog Post

**Endpoint**: `GET /api/blogs/:blogId`

**Description**: Retrieve a single blog post by ID.

**Path Parameters**:
- `blogId` (required): Blog post ID

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Blog post fetched successfully",
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "title": "Getting Started with Node.js",
    "description": "A beginner's guide to Node.js development",
    "content": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "john",
      "lastName": "doe"
    },
    "tags": ["nodejs", "javascript", "backend"],
    "views": 150,
    "createdAt": "2026-06-02T10:30:00.000Z"
  }
}
```

**Error Response** (404 - Not Found):
```json
{
  "statusCode": 404,
  "message": "Blog post not found",
  "success": false,
  "data": null,
  "error": ["Blog post with this ID does not exist"]
}
```

**Status Codes**:
- `200` - Blog fetched successfully
- `404` - Blog not found
- `500` - Server error

---

### 4. Update Blog Post

**Endpoint**: `PATCH /api/blogs/:blogId`

**Description**: Update a blog post (only by author).

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Path Parameters**:
- `blogId` (required): Blog post ID

**Request Body**:
```json
{
  "title": "Advanced Node.js Concepts",
  "description": "Deep dive into Node.js",
  "content": "Updated content...",
  "tags": ["nodejs", "advanced"]
}
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Blog post updated successfully",
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "title": "Advanced Node.js Concepts",
    "description": "Deep dive into Node.js",
    "content": "Updated content...",
    "tags": ["nodejs", "advanced"],
    "updatedAt": "2026-06-02T11:30:00.000Z"
  }
}
```

**Error Response** (403 - Forbidden):
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "success": false,
  "data": null,
  "error": ["You are not authorized to update this blog post"]
}
```

**Status Codes**:
- `200` - Blog updated successfully
- `401` - Unauthorized
- `403` - Forbidden (not the author)
- `404` - Blog not found
- `500` - Server error

---

### 5. Delete Blog Post

**Endpoint**: `DELETE /api/blogs/:blogId`

**Description**: Delete a blog post (only by author).

**Request Headers**:
```
Authorization: Bearer <accessToken>
or
Cookie: accessToken=<token>
```

**Path Parameters**:
- `blogId` (required): Blog post ID

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Blog post deleted successfully",
  "success": true,
  "data": null
}
```

**Error Response** (403 - Forbidden):
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "success": false,
  "data": null,
  "error": ["You are not authorized to delete this blog post"]
}
```

**Status Codes**:
- `200` - Blog deleted successfully
- `401` - Unauthorized
- `403` - Forbidden (not the author)
- `404` - Blog not found
- `500` - Server error

---

### 6. Add Comment to Blog

**Endpoint**: `POST /api/blogs/:blogId/comments`

**Description**: Add a comment to a blog post.

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Path Parameters**:
- `blogId` (required): Blog post ID

**Request Body**:
```json
{
  "comment": "Great post! Very helpful."
}
```

**Response** (201 - Created):
```json
{
  "statusCode": 201,
  "message": "Comment added successfully",
  "success": true,
  "data": {
    "_id": "708f1f77bcf86cd799439013",
    "comment": "Great post! Very helpful.",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "john",
      "lastName": "doe"
    },
    "blog": "607f1f77bcf86cd799439012",
    "createdAt": "2026-06-02T12:00:00.000Z"
  }
}
```

**Status Codes**:
- `201` - Comment added successfully
- `400` - Invalid input
- `401` - Unauthorized
- `404` - Blog not found
- `500` - Server error

---

### 7. Like/Unlike Blog Post

**Endpoint**: `POST /api/blogs/:blogId/like`

**Description**: Like or unlike a blog post.

**Request Headers**:
```
Authorization: Bearer <accessToken>
```

**Path Parameters**:
- `blogId` (required): Blog post ID

**Request Body**:
```json
{}
```

**Response** (200 - OK):
```json
{
  "statusCode": 200,
  "message": "Blog liked successfully",
  "success": true,
  "data": {
    "likeCount": 45,
    "isLiked": true
  }
}
```

**Status Codes**:
- `200` - Like status toggled
- `401` - Unauthorized
- `404` - Blog not found
- `500` - Server error

---

## ❌ Error Responses

### Standard Error Response Format

All error responses follow this format:

```json
{
  "statusCode": <HTTP_STATUS_CODE>,
  "message": "<Error Message>",
  "success": false,
  "data": null,
  "error": ["<Detailed Error 1>", "<Detailed Error 2>"]
}
```

### Common Error Status Codes

| Status Code | Description |
|-------------|-------------|
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource does not exist |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation failed |
| `500` | Internal Server Error - Server error |

### Common HTTP Status Scenarios

#### User Registration
- ✅ `201` - User created
- ❌ `400` - Invalid email/password
- ❌ `409` - Email already exists
- ❌ `422` - Validation failed

#### Authentication
- ✅ `200` - Login successful
- ❌ `401` - Invalid credentials
- ❌ `400` - Missing fields

#### Blog Operations
- ✅ `200` - Success
- ❌ `401` - Not authenticated
- ❌ `403` - Not blog author
- ❌ `404` - Blog not found

### Common Error Scenarios

#### Missing Required Fields
```json
{
  "statusCode": 400,
  "message": "Validation Error",
  "success": false,
  "error": ["firstName is required", "email is required"]
}
```

#### Invalid Token
```json
{
  "statusCode": 401,
  "message": "Unauthorized request",
  "success": false,
  "error": ["Invalid access token"]
}
```

#### Resource Not Found
```json
{
  "statusCode": 404,
  "message": "Not Found",
  "success": false,
  "error": ["Blog post with this ID does not exist"]
}
```

---

## 📤 Request/Response Examples

### Complete Example: User Registration Flow

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Secure123!"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "john",
    "lastName": "doe",
    "email": "john@example.com",
    "avatar": ""
  }
}
```

---

### Complete Example: Blog Creation Flow

#### 1. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Secure123!"
  }'
```

#### 2. Create Blog Post
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "title": "My First Blog",
    "description": "This is my first blog post",
    "content": "Welcome to my blog!",
    "tags": ["first", "welcome"]
  }'
```

---

### Complete Example: Image Upload

#### 1. Upload with Avatar
```bash
curl -X PATCH http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <accessToken>" \
  -F "firstName=Jane" \
  -F "lastName=Doe" \
  -F "avatar=@/path/to/image.jpg"
```

---

## 🔐 Authentication

### Token Management

All protected endpoints require one of the following:

1. **Bearer Token in Authorization Header**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Token in Cookie**:
```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Details

**Access Token**:
- Expires in: 7 days
- Contains: User ID, email, first name, last name
- Use for: API requests

**Refresh Token**:
- Expires in: 30 days
- Contains: User ID, email
- Use for: Generating new access tokens

---

## 🧪 Quick Test Commands

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Pass123!"}'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass123!"}'
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <accessToken>"
```

### Create Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"title":"My Blog","description":"Desc","content":"Content","tags":["tag1"]}'
```

### Get All Blogs
```bash
curl -X GET "http://localhost:5000/api/blogs?page=1&limit=10&tag=nodejs"
```

### Get Single Blog
```bash
curl -X GET http://localhost:5000/api/blogs/<blogId>
```

---

## 🛠️ Environment Setup

Required environment variables:

```
MONGO_URL=mongodb+srv://...
JWT_TOKEN_SECRET=your_secret
JWT_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRES_IN=30d
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
```

---

## 📚 Data Models Overview

### User Model
```
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  refreshToken: String,
  timestamps: { createdAt, updatedAt }
}
```

### Blog Model (Expected)
```
{
  _id: ObjectId,
  title: String,
  description: String,
  content: String,
  author: ObjectId (User),
  tags: [String],
  views: Number,
  likes: [ObjectId] (User IDs),
  comments: [ObjectId] (Comment IDs),
  timestamps: { createdAt, updatedAt }
}
```

### Comment Model (Expected)
```
{
  _id: ObjectId,
  comment: String,
  author: ObjectId (User),
  blog: ObjectId (Blog),
  timestamps: { createdAt, updatedAt }
}
```

---

## 🔗 API Flow Examples

### User Registration & Login Flow
1. `POST /api/auth/register` → Register
2. `POST /api/auth/login` → Get tokens
3. Use `accessToken` for subsequent requests

### Blog Creation & Publishing Flow
1. `POST /api/auth/login` → Authenticate
2. `POST /api/blogs` → Create blog
3. `PATCH /api/blogs/:blogId` → Update blog
4. `GET /api/blogs/:blogId` → View blog

### Reading & Interacting Flow
1. `GET /api/blogs` → Browse blogs
2. `GET /api/blogs/:blogId` → Read blog
3. `POST /api/blogs/:blogId/comments` → Add comment
4. `POST /api/blogs/:blogId/like` → Like blog

### Refresh Token Flow
```
1. User calls /api/auth/login
   ↓
2. Get accessToken (7 days) and refreshToken (30 days)
   ↓
3. Use accessToken for API calls
   ↓
4. When accessToken expires, call /api/auth/refresh-token
   ↓
5. Get new accessToken and refreshToken
```

---

## 💾 Common Data Fields

### Timestamps
- `createdAt` - Creation time (ISO 8601)
- `updatedAt` - Last update time (ISO 8601)

### Pagination Response
- `totalItems` - Total count
- `currentPage` - Current page number
- `totalPages` - Total pages
- `limit` - Items per page

### Query Parameters
- `page` and `limit` for pagination, for example `?page=1&limit=10`
- `tag` and `search` for filtering, for example `?tag=nodejs&search=mongodb`
- `sort` and `order` for sorting, for example `?sort=createdAt&order=desc`

---

## 📖 Response Time Expectations

- Authentication: ~200ms
- Blog retrieval: ~150-500ms
- Blog creation: ~300-800ms
- File upload: ~1-5s, depending on file size

---

## ⚠️ Rate Limiting (Recommended Implementation)

- General: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File upload: 10 requests per hour

---

## 🚀 Performance Tips

1. **Use pagination** for large datasets
2. **Cache frequently accessed data**
3. **Compress responses** with gzip
4. **Use CDN** for image delivery
5. **Index database fields** appropriately
6. **Implement caching headers**

---

## 📞 Troubleshooting

### 401 Unauthorized
- Check if token is included
- Verify token is not expired
- Check token secret in environment

### 403 Forbidden
- Verify you are the resource owner
- Check user permissions

### 404 Not Found
- Verify resource ID is correct
- Check if resource exists

### 500 Server Error
- Check server logs
- Verify environment variables
- Check database connection

---

## 🧪 Testing with Postman

1. Import the API collection in Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `accessToken`: Token from login response
   - `refreshToken`: Token from login response
3. Test endpoints in sequence

---

## 📝 API Versioning

Current API Version: `v1`

Future versions will use the format: `/api/v2/...`

---

## 💡 Best Practices

1. **Always use HTTPS in production**
2. **Include proper authentication headers**
3. **Handle error responses appropriately**
4. **Implement rate limiting on client side**
5. **Cache responses when appropriate**
6. **Use pagination for large datasets**
7. **Validate input data**

---

## 📞 Support

For API issues or questions, please refer to the main README or create an issue in the repository.

---

**Last Updated**: June 2, 2026
**API Status**: Development
