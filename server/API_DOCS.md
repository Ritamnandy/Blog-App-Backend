# Blog App Backend API Documentation

This document describes the API that is currently mounted by the server code.

Base URL:

```text
http://localhost:5000/api/v1
```

Auth routes are mounted from `src/app.js`:

```text
/api/v1/auth
```

## Authentication

Protected endpoints accept the access token in either place:

```text
Authorization: Bearer <accessToken>
```

or:

```text
Cookie: accessToken=<accessToken>
```

Login and register responses also set:

- `accessToken`
- `refreshToken`

Both cookies are `httpOnly` and `secure`.

## Response Shapes

Success responses use `ApiResponse`:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Operation successful",
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

Validation errors return status `422` and include field-level messages:

```json
{
  "statusCode": 422,
  "data": null,
  "message": "Recived data is not valid",
  "success": false,
  "error": [
    {
      "email": "Email is invalid"
    }
  ]
}
```

## Endpoint Summary

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Register a user and receive tokens |
| `POST` | `/auth/login` | No | Log in and receive tokens |
| `POST` | `/auth/refresh` | No | Refresh tokens using the current refresh implementation |
| `POST` | `/auth/logout` | Yes | Log out the authenticated user |
| `POST` | `/auth/avatar` | Yes | Upload the authenticated user's avatar |
| `GET` | `/auth/google` | No | Start Google OAuth |
| `GET` | `/auth/google/callback` | No | Google OAuth callback |

Full URLs use the base prefix. Example: `POST http://localhost:5000/api/v1/auth/register`.

## Register User

```http
POST /api/v1/auth/register
Content-Type: application/json
```

Request body:

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
