# 🗺️ Biriyani Map Live

A modern, interactive web application to discover, add, and review the best Biriyani spots! Built with a robust technical stack including React, Vite, TypeScript, Tailwind CSS, shadcn-ui, and Supabase.

## ✨ Features

- **Interactive Map:** Browse Biriyani spots visually on an intuitive map interface powered by React Leaflet.
- **Community-Driven:** Users can seamlessly submit their favorite Biriyani locations.
- **Spam Protection & Rate Limiting:** Backed by Supabase Edge Functions, the platform enforces strict IP-based submission limits, time-based banning mechanisms, and robust spam filters to maintain high data quality.
- **Voting & Rating System:** Secure upvote/downvote system for Biriyani spots powered by custom PostgreSQL functions.
- **Modern UI:** A clean, vibrant, and fully responsive design utilizing Tailwind CSS and accessible shadcn-ui components.
- **Optimized Performance:** Fast and reliable data caching and fetching with React Query.

## 🚀 Technologies Used

### Frontend Core
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Query (TanStack)](https://tanstack.com/query)

### UI & Styling
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Lucide React](https://lucide.dev/) (Icons)

### Backend & Database
- [Supabase](https://supabase.com/) - Backend as a Service
- **PostgreSQL** - Relational database utilizing advanced Row Level Security (RLS) policies.
- **Supabase Edge Functions** - Serverless functions used for secure data mutations such as analyzing spam metrics and validating submissions.

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd biriyani-map-live
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file at the root of the project and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🛠️ Project Architecture

- **`src/components/`**: Reusable UI elements, including map components, popups, grids, and shadcn pre-built primitives.
- **`src/pages/`**: Primary application views (e.g., the main full-screen map interface in `Index.tsx`).
- **`src/hooks/`**: Custom React hooks handling business logic.
- **`src/lib/`**: Utility functions and the Supabase client initialization.
- **`supabase/functions/`**: Deno-based Supabase Edge Functions for evaluating submissions and filtering spam securely.
- **`supabase/migrations/`**: Raw SQL migration files handling table creation, PostgreSQL function definitions, index setups, and strict RLS policies to prevent direct manipulation from clients.

## 🔒 Security Details

- **Database Protection:** Public write access is entirely disabled. Tables are protected using Row Level Security (RLS) policies, allowing only secure Edge Functions and internal db modifications to alter data state.
- **Submission Guarding:** To stop abuse, spot creations are routed exclusively through backend Edge Functions where parameters are scrutinized, and temporary IP bans are maintained for repeated violations.
