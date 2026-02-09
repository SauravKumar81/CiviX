# CiviX

CiviX is a modern civic engagement platform designed to empower citizens to report, track, and resolve local community issues. It fosters better communication between residents and local authorities through a transparent, map-based interface.

![CiviX App](https://via.placeholder.com/800x400?text=CiviX+App+Preview)

## 🚀 Features

-   **📍 Issue Reporting**: Easily report problems (potholes, broken lights, etc.) with location, photos, and descriptions.
-   **🗺️ Interactive Map**: Visualize reports on a dynamic map powered by Mapbox. Filter by trending issues, neighborhood, or official updates.
-   **📈 Trending & Voting**: Upvote important issues to increase visibility and track trending community concerns.
-   **👤 User Profiles**: Manage your submitted reports, view status updates, and customize your profile.
-   **📱 Responsive Design**: A mobile-first, responsive interface built with Tailwind CSS.
-   **🔐 Secure Authentication**: Integrated authentication system including Google OAuth support.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Maps**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) & [React Map GL](https://visgl.github.io/react-map-gl/)
-   **Routing**: [React Router DOM v7](https://reactrouter.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **API Client**: [Axios](https://axios-http.com/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/civix-app.git
    cd civix-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory based on `.env.example` (if available) or add the following variables:

    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
    VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    The application should now be running at `http://localhost:5173`.

## 📂 Project Structure

```
civix-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context (Auth, etc.)
│   ├── pages/           # Application pages (Home, Map, Login, etc.)
│   ├── services/        # API service calls (Axios setup)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 📜 Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the app for production.
-   `npm run preview`: Preview the production build locally.
-   `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
