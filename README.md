# Civix - Collective Power for Your City

Civix is a modern platform that empowers citizens to report local issues, build better neighborhoods, and engage with their community in real-time.

## 🚀 Project Overview

This is a full-stack application consisting of:
- **Frontend**: React (Vite) + Tailwind CSS + Mapbox GL
- **Backend**: Node.js + Express + MongoDB + JWT Auth
- **Deployment**: 
  - Frontend: [Vercel](https://civi-x.vercel.app)
  - Backend: [Render](https://civix-w7p1.onrender.com)

## 📁 Project Structure

```bash
CIVIX-APP/
├── civix-app/      # React frontend (Vite)
├── civix-server/   # Express backend (Node.js)
└── package.json    # Root package for concurrent development
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console account (for Auth)
- Mapbox API Token

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SauravKumar81/CiviX.git
   cd CiviX
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Setup Environment Variables:
   Create `.env` files in both `civix-app` and `civix-server` directories.

   **In `civix-app/.env`**:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_id
   VITE_API_URL=http://localhost:5000/api
   VITE_MAPBOX_TOKEN=your_mapbox_token
   ```

   **In `civix-server/.env`**:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   GOOGLE_CLIENT_ID=your_google_id
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

### Running Locally

Run both frontend and backend simultaneously:
```bash
npm run dev
```

## 🌐 Deployment Configuration

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Environment Variables**: Use `VITE_API_URL` pointing to your deployed backend.
- **Routing**: Fixed via `vercel.json` to support SPA routing on refresh.

### Backend (Render)
- **Health Check**: `/`
- **CORS**: Configured to allow Vercel and localhost domains.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

---
Built with ❤️ by Saurav Kumar
