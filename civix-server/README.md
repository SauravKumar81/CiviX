# Civix Backend API

The backend server for Civix, handling authentication, reporting, and community data.

## 🛠️ Tech Stack
- **Server**: Node.js / Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & Google OAuth2
- **File Uploads**: Cloudinary with Multer
- **Validation**: Manual input validation in controllers

## 🚀 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Local login
- `POST /api/auth/google` - Google authentication
- `GET /api/auth/me` - Get current user profile

### Reports
- `GET /api/reports` - List all reports
- `POST /api/reports` - Create a report (Authenticated)
- `GET /api/reports/:id` - Single report details

## ⚙️ Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server (nodemon):
   ```bash
   npm run dev
   ```
3. Start production server:
   ```bash
   npm start
   ```

## 🔐 Environment Variables Required
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL` (For CORS production)
