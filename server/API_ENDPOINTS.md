# Blog App Backend - API Endpoints Quick Reference

## 📋 Endpoint Summary

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

---

## 🔑 Authentication Methods

### Required Headers

**For Protected Endpoints (✅ Yes):**

Option 1 - Bearer Token:
```
Authorization: Bearer <accessToken>
```

Option 2 - Cookie:
```
Cookie: accessToken=<token>
```

---

## 📊 Common Request/Response Patterns

### Success Response (2xx)
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "success": true,
  "data": { /* Response data */ }
}
```

### Error Response (4xx/5xx)
```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "data": null,
  "error": ["Specific error 1", "Specific error 2"]
}
```

---

## 🧪 Quick Test Commands

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Pass123!"}'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass123!"}'
```

### 3. Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Create Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"title":"My Blog","description":"Desc","content":"Content","tags":["tag1"]}'
```

### 5. Get All Blogs
```bash
curl -X GET "http://localhost:5000/api/blogs?page=1&limit=10&tag=nodejs"
```

### 6. Get Single Blog
```bash
curl -X GET http://localhost:5000/api/blogs/<blogId>
```

---

## ✅ Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `204` | No Content | Request successful, no response body |
| `400` | Bad Request | Invalid input/validation error |
| `401` | Unauthorized | Missing/invalid authentication |
| `403` | Forbidden | Authenticated but insufficient permissions |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Resource already exists |
| `422` | Unprocessable Entity | Validation error |
| `500` | Server Error | Internal server error |

---

## 🔐 Token Details

**Access Token:**
- Duration: 7 days
- Usage: Include in every authenticated request
- Stored in: Cookie or Authorization header

**Refresh Token:**
- Duration: 30 days
- Usage: Get new access token
- Endpoint: `/api/auth/refresh-token`

---

## 📝 Query Parameters

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?tag=nodejs&search=mongodb
```

### Sorting
```
?sort=createdAt&order=desc
```

---

## 🎯 Common HTTP Status Scenarios

### User Registration
- ✅ `201` - User created
- ❌ `400` - Invalid email/password
- ❌ `409` - Email already exists
- ❌ `422` - Validation failed

### Authentication
- ✅ `200` - Login successful
- ❌ `401` - Invalid credentials
- ❌ `400` - Missing fields

### Blog Operations
- ✅ `200` - Success
- ❌ `401` - Not authenticated
- ❌ `403` - Not blog author
- ❌ `404` - Blog not found

---

## 🛠️ Environment Setup

Required Environment Variables:
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
3. Use accessToken for subsequent requests

### Blog Creation & Publishing Flow
1. `POST /api/auth/login` → Authenticate
2. `POST /api/blogs` → Create blog
3. `PATCH /api/blogs/:id` → Update blog
4. `GET /api/blogs/:id` → View blog

### Reading & Interacting Flow
1. `GET /api/blogs` → Browse blogs
2. `GET /api/blogs/:id` → Read blog
3. `POST /api/blogs/:id/comments` → Add comment
4. `POST /api/blogs/:id/like` → Like blog

---

## 📖 Response Time Expectations

- Authentication: ~200ms
- Blog retrieval: ~150-500ms
- Blog creation: ~300-800ms
- File upload: ~1-5s (depends on file size)

---

## ⚠️ Rate Limiting (Recommended Implementation)

- General: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File upload: 10 requests per hour

---

## 🔄 Refresh Token Flow

```
1. User calls /api/auth/login
   ↓
2. Get accessToken (7 days) & refreshToken (30 days)
   ↓
3. Use accessToken for API calls
   ↓
4. When accessToken expires, call /api/auth/refresh-token
   ↓
5. Get new accessToken & refreshToken
```

---

## 💾 Common Data Fields

### Timestamps (Auto-generated)
- `createdAt` - Creation time (ISO 8601)
- `updatedAt` - Last update time (ISO 8601)

### Pagination Response
- `totalItems` - Total count
- `currentPage` - Current page number
- `totalPages` - Total pages
- `limit` - Items per page

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
- Verify you're the resource owner
- Check user permissions

### 404 Not Found
- Verify resource ID is correct
- Check if resource exists

### 500 Server Error
- Check server logs
- Verify environment variables
- Check database connection

---

**API Version**: v1  
**Last Updated**: June 2, 2026
