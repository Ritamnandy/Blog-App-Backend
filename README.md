# Blog App Backend

Node.js, Express, and MongoDB backend for a blog application. The current codebase focuses on user authentication, Google OAuth, JWT cookie/session handling, avatar upload plumbing, and shared MongoDB models for users, blogs, comments, and likes.

The active API surface is mounted under:

```text
/api/v1/auth
```

Detailed endpoint documentation lives in [server/API_DOCS.md](server/API_DOCS.md).

## Current Features

- Email/password user registration and login
- Google OAuth login with Passport
- JWT access and refresh token generation
- HTTP-only auth cookies
- Protected logout and avatar routes
- Express request validation for register/login payloads
- MongoDB connection through Mongoose
- Password hashing with bcrypt
- CORS, compression, cookies, sessions, request IP tracking, and rate limiting
- Cloudinary upload helper and Multer local upload middleware
- Blog, comment, and like Mongoose models prepared for future blog routes

## Project Structure

```text
Blog-App/
|-- README.md
`-- server/
    |-- API_DOCS.md
    |-- package.json
    |-- package-lock.json
    `-- src/
        |-- app.js
        |-- index.js
        |-- constant.js
        |-- config/
        |   `-- env.config.js
        |-- controllers/
        |   `-- user.controllers.js
        |-- db/
        |   `-- connect.db.js
        |-- middlewares/
        |   |-- auth.middlewares.js
        |   `-- multer.middlewares.js
        |-- models/
        |   |-- blog.models.js
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
