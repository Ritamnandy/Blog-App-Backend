# Blog App Backend - API Documentation

Complete API reference for the Blog App Backend service. This document provides detailed information about all available endpoints, request/response formats, authentication methods, and usage examples.

---

## 📍 Base URL

```
http://localhost:5000/api/v1
```

## 🔐 Authentication

### Token-Based Authentication

Protected endpoints require an access token that can be provided in two ways:

**1. Authorization Header (Bearer Token)**
```http
Authorization: Bearer <accessToken>
```

**2. HTTP-Only Cookie**
```http
Cookie: accessToken=<accessToken>
```

### Token Storage

Both `accessToken` and `refreshToken` are set as `httpOnly` and `secure` cookies in login/register responses:
- `accessToken` - Short-lived token for API requests (expires in 7 days)
- `refreshToken` - Long-lived token for obtaining new access tokens (expires in 30 days)

---

## 📋 Response Format

### Success Response

```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "success": true
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "data": null,
  "success": false,
  "error": []
}
```

### Validation Error Response

```json
{
  "statusCode": 422,
  "message": "Received data is not valid",
  "data": null,
  "success": false,
  "error": [
    {
      "field_name": "Error message for this field"
    }
  ]
}
```

### Rate Limit Error Response

```json
{
  "statusCode": 429,
  "message": "Too many requests, Please try again later",
  "data": null,
  "success": false,
  "error": ["Too many requests"]
}
```

---

## 📊 API Endpoints Summary

### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| `POST` | `/register` | ❌ | Register a new user account |
| `POST` | `/verify-email` | ❌ | Verify email with verification code |
| `POST` | `/resend-code` | ❌ | Resend verification code to email |
| `POST` | `/send-reset-password-mail` | ❌ | Request password reset email |
| `POST` | `/forget-password` | ❌ | Reset password with verification code |
| `POST` | `/login` | ❌ | Login with email and password |
| `POST` | `/refresh` | ❌ | Refresh access token |
| `POST` | `/logout` | ✅ | Logout the authenticated user |
| `POST` | `/avatar` | ✅ | Upload user avatar/profile picture |
| `GET` | `/myallblogs` | ✅ | Get all blogs created by authenticated user |
| `GET` | `/google` | ❌ | Initiate Google OAuth login |
| `GET` | `/google/callback` | ❌ | Google OAuth callback handler |

### Blog Endpoints (`/api/v1/blog`)

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| `POST` | `/addblog` | ✅ | Create a new blog post |
| `PATCH` | `/updateblog/:id` | ✅ | Update an existing blog post |
| `DELETE` | `/deleteblog/:id` | ✅ | Delete a blog post |
| `GET` | `/getallblogs` | ✅ | Get all blog posts with comments |
| `POST` | `/addcomment/:id` | ✅ | Add a comment to a blog post |
| `PATCH` | `/updatecomment/:id` | ✅ | Update a comment |
| `DELETE` | `/deletecomment/:id` | ✅ | Delete a comment |
| `POST` | `/addlike/:id` | ✅ | Like a blog post |
| `DELETE` | `/removelike/:id` | ✅ | Unlike a blog post |

---

## 🔑 Authentication Endpoints

### 1. Register User

Create a new user account with email and password.

```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- `firstName` - Required, non-empty string
- `lastName` - Required, non-empty string
- `email` - Required, valid email format
- `password` - Required, non-empty string (min 6 characters recommended)

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "User created successfully, Check your email for verification",
  "data": ["Check your email for verification"],
  "success": true
}
```

**Error Responses:**
- `400` - Missing or invalid fields
- `400` - User with this email already exists

**Next Steps:** User must verify email using the code sent to their email address.

---

### 2. Verify Email

Verify user email address using the verification code sent to their email.

```http
POST /api/v1/auth/verify-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Email verified successfully",
  "data": [
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "john",
        "lastName": "doe",
        "email": "john.doe@example.com",
        "avatar": "",
        "loginType": "EMAIL_PASSWORD",
        "isVerified": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:32:00Z"
      }
    }
  ],
  "success": true
}
```

**Cookies Set:**
- `accessToken` - httpOnly, secure
- `refreshToken` - httpOnly, secure

**Error Responses:**
- `400` - Missing required fields
- `404` - User not found
- `400` - Email is already verified
- `400` - Invalid verification code
- `400` - Verification code has expired

---

### 3. Resend Verification Code

Request a new verification code if the original has expired or not received.

```http
POST /api/v1/auth/resend-code
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Verification code sent successfully",
  "data": ["Verification code sent successfully"],
  "success": true
}
```

**Error Responses:**
- `400` - Missing email
- `404` - User not found

**Note:** Verification code is valid for 5 minutes.

---

### 4. Login User

Authenticate user with email and password.

```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- `email` - Required, valid email format
- `password` - Required, non-empty string

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": [
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "john",
      "lastName": "doe",
      "email": "john.doe@example.com",
      "avatar": "https://cloudinary.com/...",
      "loginType": "EMAIL_PASSWORD",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  ],
  "success": true
}
```

**Cookies Set:**
- `accessToken` - httpOnly, secure
- `refreshToken` - httpOnly, secure

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password
- `400` - Email is not verified
- `404` - User not found

---

### 5. Send Password Reset Email

Request a password reset by sending a verification code to email.

```http
POST /api/v1/auth/send-reset-password-mail
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Verification code sent successfully",
  "data": ["Verification code sent successfully"],
  "success": true
}
```

**Error Responses:**
- `400` - Missing email
- `404` - User not found

**Note:** Verification code valid for 5 minutes. User receives reset code via email.

---

### 6. Forget Password (Reset Password)

Reset password using the verification code sent to email.

```http
POST /api/v1/auth/forget-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "code": "123456",
  "newPassword": "NewSecurePassword456!"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Password updated successfully",
  "data": [],
  "success": true
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - User not found
- `400` - Invalid OTP
- `400` - OTP expired

**Next Steps:** User can now login with the new password.

---

### 7. Refresh Access Token

Obtain a new access token using the refresh token.

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request Methods:**
- Cookie: Automatically sent as `refreshToken` cookie
- Header: `Authorization: Bearer <refreshToken>`
- Body: `{ "refreshToken": "<token>" }`

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Access token refreshed successfully",
  "data": [
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ],
  "success": true
}
```

**Cookies Set:**
- `accessToken` - httpOnly, secure (renewed)
- `refreshToken` - httpOnly, secure (renewed)

**Error Responses:**
- `401` - Refresh token not found
- `401` - User not found or invalid refresh token

---

### 8. Logout User

Logout the authenticated user and clear tokens. ✅ **Protected Endpoint**

```http
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User logged out successfully",
  "data": [],
  "success": true
}
```

**Cookies Cleared:**
- `accessToken` - Cleared
- `refreshToken` - Cleared

**Error Responses:**
- `401` - Unauthorized / User not found
- `401` - Missing authentication token

---

### 9. Upload Avatar

Upload a user profile picture/avatar. ✅ **Protected Endpoint**

```http
POST /api/v1/auth/avatar
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
avatar: <image file>
```

**File Requirements:**
- Format: JPG, PNG, GIF, WebP
- Max Size: Depends on Multer configuration (typically 50MB)
- Field Name: `avatar`

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/..."
  },
  "success": true
}
```

**Error Responses:**
- `400` - Missing avatar file
- `401` - Unauthorized / User not found
- `500` - Cloudinary upload error

**Note:** Avatar is uploaded to Cloudinary and URL is stored in user profile.

---

### 10. Get My Blogs

Retrieve all blog posts created by the authenticated user. ✅ **Protected Endpoint**

```http
GET /api/v1/auth/myallblogs
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Blogs fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "john",
      "lastName": "doe",
      "_id": "507f1f77bcf86cd799439012",
      "blog": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "title": "My First Blog",
          "description": "This is my first blog post...",
          "thumbnailImage": "https://cloudinary.com/...",
          "likes": 5,
          "status": "published",
          "comments": [
            {
              "_id": "507f1f77bcf86cd799439014",
              "comment": "Great post!"
            }
          ]
        }
      ]
    }
  ],
  "success": true
}
```

**Error Responses:**
- `404` - Blogs not found
- `401` - Unauthorized / User not found

---

### 11. Google OAuth - Initiate Login

Start Google OAuth 2.0 login flow.

```http
GET /api/v1/auth/google
```

**Behavior:**
1. Redirects user to Google consent screen
2. Requests `email` and `profile` scopes
3. Returns to callback endpoint on user consent

**Query Parameters:**
- `scope`: Automatically set to `['email', 'profile']`

**Redirect:** User is redirected to Google login page

---

### 12. Google OAuth - Callback

Handles Google OAuth callback after user authentication.

```http
GET /api/v1/auth/google/callback?code=...&state=...
```

**On Success:**
- User is authenticated via Google
- New user created if first-time login
- Tokens generated and set as cookies
- Redirect to `/api/v1/auth/google/callback` handler

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Google logged in successfully",
  "data": [
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "john",
        "lastName": "doe",
        "email": "john.doe@google.com",
        "googleId": "1234567890",
        "avatar": "",
        "loginType": "GOOGLE",
        "isVerified": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "success": true
}
```

**Cookies Set:**
- `accessToken` - httpOnly, secure
- `refreshToken` - httpOnly, secure

**On Failure:**
- Redirects to `/login` page

---

## 📝 Blog Endpoints

### 1. Add Blog Post

Create a new blog post with title, description, and thumbnail image. ✅ **Protected Endpoint**

```http
POST /api/v1/blog/addblog
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: string (required)
description: string (required)
status: string (required) - "draft", "published", or "archived"
image: file (required) - JPG, PNG, GIF, WebP
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Blog added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Amazing Blog",
    "description": "This is the content of my blog...",
    "author": "507f1f77bcf86cd799439012",
    "thumbnailImage": "https://res.cloudinary.com/...",
    "status": "published",
    "likes": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "success": true
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - Thumbnail image is required
- `401` - Unauthorized / User not found
- `500` - Cloudinary upload failed

**Blog Status Options:**
- `draft` - Not yet published (default)
- `published` - Visible to all users
- `archived` - Hidden from listings

---

### 2. Update Blog Post

Update an existing blog post. ✅ **Protected Endpoint**

```http
PATCH /api/v1/blog/updateblog/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**URL Parameters:**
- `:id` - Blog post ID (required)

**Request Body:**
```json
{
  "title": "Updated Blog Title",
  "description": "Updated blog description...",
  "status": "published"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Blog updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Blog Title",
    "description": "Updated blog description...",
    "author": "507f1f77bcf86cd799439012",
    "thumbnailImage": "https://res.cloudinary.com/...",
    "status": "published",
    "likes": 5,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  },
  "success": true
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - Blog not found
- `401` - Unauthorized

---

### 3. Delete Blog Post

Delete a blog post. ✅ **Protected Endpoint**

```http
DELETE /api/v1/blog/deleteblog/:id
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `:id` - Blog post ID (required)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Blog deleted successfully",
  "data": [],
  "success": true
}
```

**Error Responses:**
- `400` - Missing blog ID
- `404` - Blog not found
- `401` - Unauthorized

---

### 4. Get All Blogs

Retrieve all blog posts with comments aggregated. ✅ **Protected Endpoint**

```http
GET /api/v1/blog/getallblogs
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Blogs fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My Amazing Blog",
      "description": "This is the content of my blog...",
      "author": "507f1f77bcf86cd799439012",
      "thumbnailImage": "https://res.cloudinary.com/...",
      "status": "published",
      "likes": 5,
      "comments": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "comment": "Great post!"
        },
        {
          "_id": "507f1f77bcf86cd799439014",
          "comment": "Thanks for sharing!"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "success": true
}
```

**Error Responses:**
- `404` - Blogs not found
- `401` - Unauthorized

---

### 5. Add Comment

Add a comment to a blog post. ✅ **Protected Endpoint**

```http
POST /api/v1/blog/addcomment/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**URL Parameters:**
- `:id` - Blog post ID (required)

**Request Body:**
```json
{
  "comment": "This is a great blog post!"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Comment added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "comment": "This is a great blog post!",
    "blog": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "success": true
}
```

**Error Responses:**
- `400` - Missing comment text
- `404` - Blog not found
- `401` - Unauthorized

---

### 6. Update Comment

Update an existing comment. ✅ **Protected Endpoint**

```http
PATCH /api/v1/blog/updatecomment/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**URL Parameters:**
- `:id` - Comment ID (required)

**Request Body:**
```json
{
  "comment": "Updated comment text"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Comment updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "comment": "Updated comment text",
    "blog": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:05:00Z"
  },
  "success": true
}
```

**Error Responses:**
- `400` - Missing comment ID or comment text
- `404` - Comment not found
- `401` - Unauthorized

---

### 7. Delete Comment

Delete a comment from a blog post. ✅ **Protected Endpoint**

```http
DELETE /api/v1/blog/deletecomment/:id
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `:id` - Comment ID (required)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Comment deleted successfully",
  "data": [],
  "success": true
}
```

**Error Responses:**
- `400` - Missing comment ID
- `404` - Comment not found
- `401` - Unauthorized

---

### 8. Add Like

Like a blog post (increments like count). ✅ **Protected Endpoint**

```http
POST /api/v1/blog/addlike/:id
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `:id` - Blog post ID (required)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Blog liked successfully",
  "data": 6,
  "success": true
}
```

**Response Data:** The new total like count (number)

**Error Responses:**
- `400` - Missing blog ID
- `404` - Blog not found
- `401` - Unauthorized

---

### 9. Remove Like

Unlike a blog post (decrements like count). ✅ **Protected Endpoint**

```http
DELETE /api/v1/blog/removelike/:id
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `:id` - Blog post ID (required)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Blog liked successfully",
  "data": 5,
  "success": true
}
```

**Response Data:** The new total like count (number)

**Behavior:** 
- Decrements like count if > 0
- Sets to 0 if already at 0 (prevents negative values)

**Error Responses:**
- `400` - Missing blog ID
- `404` - Blog not found
- `401` - Unauthorized

---

## 📊 Status Codes Reference

| Code | Meaning | Common Cause |
|------|---------|--------------|
| `200` | OK | Successful GET, POST, or PUT request |
| `201` | Created | Successful resource creation |
| `400` | Bad Request | Invalid input or missing required fields |
| `401` | Unauthorized | Missing or invalid authentication token |
| `404` | Not Found | Resource doesn't exist |
| `422` | Unprocessable Entity | Validation error on request body |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error or external service failure |

---

## 🔄 Data Models

### User Model

```json
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string (unique)",
  "password": "string (hashed with bcrypt)",
  "googleId": "string (optional)",
  "loginType": "EMAIL_PASSWORD | GOOGLE",
  "isVerified": "boolean",
  "verificationCode": "string (6 digits)",
  "verificationCodeExpiresAt": "Date",
  "avatar": "string (URL)",
  "refreshToken": "string (JWT)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Blog Model

```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "author": "ObjectId (User reference)",
  "thumbnailImage": "string (URL)",
  "status": "draft | published | archived",
  "likes": "number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Comment Model

```json
{
  "_id": "ObjectId",
  "comment": "string",
  "blog": "ObjectId (Blog reference)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🛠️ Common Use Cases

### 1. Complete Registration & Login Flow

```bash
# Step 1: Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Step 2: Verify Email
curl -X POST http://localhost:5000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456"
  }'

# Step 3: Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Create and Manage Blog Posts

```bash
# Create blog post
curl -X POST http://localhost:5000/api/v1/blog/addblog \
  -H "Authorization: Bearer <accessToken>" \
  -F "title=My Blog" \
  -F "description=Blog content..." \
  -F "status=published" \
  -F "image=@/path/to/image.jpg"

# Get all blogs
curl -X GET http://localhost:5000/api/v1/blog/getallblogs \
  -H "Authorization: Bearer <accessToken>"

# Update blog
curl -X PATCH http://localhost:5000/api/v1/blog/updateblog/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "archived"
  }'
```

### 3. Comment and Like Operations

```bash
# Add comment
curl -X POST http://localhost:5000/api/v1/blog/addcomment/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "comment": "Great post!" }'

# Like blog
curl -X POST http://localhost:5000/api/v1/blog/addlike/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <accessToken>"

# Unlike blog
curl -X DELETE http://localhost:5000/api/v1/blog/removelike/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <accessToken>"
```

---

## ⚡ Rate Limiting

- **Limit**: 500 requests per 15 minutes
- **Based on**: Client IP address
- **Response**: HTTP 429 with error message

---

## 🔒 Security Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** - Use httpOnly cookies when possible
3. **Validate input** - Never trust client data
4. **Never expose sensitive data** - Passwords, refresh tokens in responses
5. **Implement CSRF protection** for state-changing operations
6. **Use strong passwords** - Enforce minimum requirements
7. **Implement email verification** - Validate user email addresses
8. **Monitor suspicious activities** - Track failed login attempts
9. **Rotate refresh tokens** - Regenerate on each refresh
10. **Set appropriate CORS origins** - Don't use wildcard in production

---

## 📞 Troubleshooting

### Common Issues

**Q: Getting 401 Unauthorized**
- Check if access token is valid
- Verify token hasn't expired
- Ensure token is sent in correct format

**Q: Getting 400 Bad Request**
- Validate all required fields are provided
- Check data types match expected format
- Verify email format is correct

**Q: Getting 429 Too Many Requests**
- Wait for rate limit window to reset (15 minutes)
- Reduce request frequency
- Implement request queuing on client side

**Q: Verification code expired**
- Request new code using resend-code endpoint
- Code expires after 5 minutes

---

## 📝 Version History

- **v1.0.0** - Initial release with authentication, blogs, comments, and likes

---

**Last Updated:** 2024
**API Version:** v1

```json
{
  "firstName": "Ritam",
  "lastName": "Das",
  "email": "ritam@example.com",
  "password": "password123"
}
```

Validation rules:

| Field | Rule |
| --- | --- |
| `firstName` | Required, minimum 3 characters |
| `lastName` | Required, minimum 3 characters |
| `email` | Required, valid email |
| `password` | Required |

Success response: `201 Created`

```json
{
  "statusCode": 201,
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>",
    "user": {
      "_id": "665f0b8b1a2b3c4d5e6f7890",
      "firstName": "Ritam",
      "lastName": "Das",
      "email": "ritam@example.com",
      "googleId": "",
      "loginType": "EMAIL_PASSWORD",
      "avatar": "",
      "createdAt": "2026-06-04T00:00:00.000Z",
      "updatedAt": "2026-06-04T00:00:00.000Z"
    }
  },
  "message": "User created successfully",
  "success": true
}
```

Common errors:

- `400` when a user with the same email already exists.
- `422` when validation fails.
- `500` when user creation fails.

## Login User

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "ritam@example.com",
  "password": "password123"
}
```

Validation rules:

| Field | Rule |
| --- | --- |
| `email` | Required, valid email |
| `password` | Required |

Success response: `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>",
    "user": {
      "_id": "665f0b8b1a2b3c4d5e6f7890",
      "firstName": "Ritam",
      "lastName": "Das",
      "email": "ritam@example.com",
      "googleId": "",
      "loginType": "EMAIL_PASSWORD",
      "avatar": "",
      "createdAt": "2026-06-04T00:00:00.000Z",
      "updatedAt": "2026-06-04T00:00:00.000Z"
    }
  },
  "message": "User logged in successfully",
  "success": true
}
```

Common errors:

- `401` for invalid email or password.
- `422` when validation fails.

## Refresh Tokens

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

Current request body expected by the controller:

```json
{
  "Token": "<refresh-token>"
}
```

Success response when working:

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "<new-access-token>",
    "refreshToken": "<new-refresh-token>"
  },
  "message": "Access token refreshed successfully",
  "success": true
}
```

Known implementation note: this controller currently destructures `Token` from `req.cookies || req.headers || req.body` and then calls `generateTokenPair(userId)` even though `userId` is not defined in that scope. Until fixed, this endpoint may return a server error even with a valid refresh token.

## Logout User

```http
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>
```

Success response: `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully",
  "success": true
}
```

Behavior:

- Requires a valid access token.
- Sets the user's stored `refreshToken` to a blank string.
- Clears `accessToken` and `refreshToken` cookies.

Common errors:

- `401` when the access token is missing, invalid, or does not map to a user.

## Upload Avatar

```http
POST /api/v1/auth/avatar
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Form data:

| Field | Type | Required |
| --- | --- | --- |
| `avatar` | File | Yes |

Success response when working:

```json
{
  "statusCode": 200,
  "data": {
    "avatar": "https://res.cloudinary.com/example/image/upload/example.png"
  },
  "message": "Avatar uploaded successfully",
  "success": true
}
```

Known implementation note: the controller currently uses `const { avatarPath } = req.file?.path`, but `req.file.path` is a string. This should be changed to read the file path directly before avatar uploads can reliably work.

## Google OAuth

### Start Google OAuth

```http
GET /api/v1/auth/google
```

Redirects the user to Google OAuth with these scopes:

- `email`
- `profile`

### Google Callback

```http
GET /api/v1/auth/google/callback
```

Passport handles the Google callback. On success, the server issues JWT cookies and returns:

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>",
    "user": {
      "_id": "665f0b8b1a2b3c4d5e6f7890",
      "firstName": "Ritam",
      "lastName": "Das",
      "email": "ritam@example.com",
      "googleId": "<google-profile-id>",
      "loginType": "GOOGLE",
      "avatar": ""
    }
  },
  "message": "Google logged in successfully",
  "success": true
}
```

On failure, Passport redirects to `/login`.

## Environment Variables

Create `server/.env` because `src/config/env.config.js` loads `.env` from the `server` directory.

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

## Quick cURL Examples

Register:

```bash
curl -i -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ritam",
    "lastName": "Das",
    "email": "ritam@example.com",
    "password": "password123"
  }'
```

Login:

```bash
curl -i -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ritam@example.com",
    "password": "password123"
  }'
```

Logout:

```bash
curl -i -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

Upload avatar:

```bash
curl -i -X POST http://localhost:5000/api/v1/auth/avatar \
  -H "Authorization: Bearer <accessToken>" \
  -F "avatar=@/path/to/avatar.png"
```

## Models Overview

### User

| Field | Type | Notes |
| --- | --- | --- |
| `firstName` | String | Required, trimmed |
| `lastName` | String | Required, trimmed |
| `email` | String | Required, unique, trimmed |
| `password` | String | Hashed before save when modified |
| `googleId` | String | Defaults to empty string |
| `loginType` | String | `GOOGLE` or `EMAIL_PASSWORD` |
| `avatar` | String | Defaults to empty string |
| `refreshToken` | String | Stores latest refresh token |

### Blog

| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | Required |
| `description` | String | Required |
| `author` | ObjectId | References `User` |
| `thumbnailImage` | String | Required |
| `status` | String | `draft`, `published`, or `archived` |
| `comments` | ObjectId[] | References `Comment` |
| `likes` | ObjectId[] | References `Like` |

### Comment

| Field | Type | Notes |
| --- | --- | --- |
| `comment` | String | Required |
| `blog` | ObjectId | References `Blog` |
| `user` | ObjectId | References `User` |

### Like

| Field | Type | Notes |
| --- | --- | --- |
| `blog` | ObjectId | References `Blog` |
| `user` | ObjectId | References `User` |

## Not Yet Exposed

The codebase includes blog, comment, and like models, but there are currently no mounted routes for creating, listing, updating, or deleting blog posts, comments, or likes.
