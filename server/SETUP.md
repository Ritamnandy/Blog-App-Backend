# Setup Guide

Quick start guide for setting up the Blog App Backend development environment.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Google OAuth credentials
- SMTP email service

## Installation Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment Variables

**IMPORTANT:** Never commit the `.env` file to version control. It contains sensitive credentials.

```bash
# Copy the example file to create your local .env
cp .env.example .env
```

### 3. Configure `.env` File

Open `.env` and replace all placeholder values with your actual credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/blogApp
DB_NAME=blogApp

# JWT Secrets (use strong, random strings)
JWT_TOKEN_SECRET=your_strong_secret_here
JWT_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_strong_refresh_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Session
SESSION_SECRET=your_strong_session_secret_here

# Cloudinary (for image uploads)
CLOUDINARY_NAME=your_cloudinary_account_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Email Service (Gmail with App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### 4. Start Development Server

```bash
npm start
```

Server will start on `http://localhost:5000` and connect to MongoDB.

## Environment Security

### ⚠️ Security Reminders

1. **Never commit `.env`** - It's already added to `.gitignore`
2. **Never share `.env`** - Keep credentials private
3. **Use strong secrets** - Use at least 32 random characters for JWT secrets
4. **Rotate secrets regularly** - Change secrets periodically in production
5. **Use `.env.example`** - Share this file with the team (without sensitive data)

### .env vs .env.example

- **`.env`** - Contains your actual credentials (ignored by git)
- **`.env.example`** - Template with placeholders (committed to git)

## Getting Credentials

### MongoDB Connection String
- Local: `mongodb://localhost:27017/blogApp`
- Cloud (Atlas): `mongodb+srv://username:password@cluster.mongodb.net/blogApp`

### Cloudinary Credentials
1. Sign up at https://cloudinary.com
2. Get credentials from Dashboard
3. Add to `.env`

### Google OAuth Credentials
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs: `http://localhost:5000/api/v1/auth/google/callback`

### Gmail App Password (for emails)
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password at https://myaccount.google.com/apppasswords
3. Use this password (not your actual Gmail password) in `.env`

## Troubleshooting

**Q: "Cannot find module" error**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Q: MongoDB connection refused**
- Ensure MongoDB is running locally or use MongoDB Atlas connection string

**Q: Cloudinary upload fails**
- Verify `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correct

**Q: Google OAuth not working**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check `GOOGLE_CALLBACK_URL` matches your registered URI

**Q: Emails not sending**
- Use Gmail app password (not regular password)
- Enable less secure apps OR use app-specific password
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

## Next Steps

1. Read [API_DOCS.md](API_DOCS.md) for endpoint documentation
2. Read [../README.md](../README.md) for project overview
3. Start developing! 🚀
