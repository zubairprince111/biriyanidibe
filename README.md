🌙 Biriyani Dibe (বিরিয়ানি দিবে)
The viral crowdsourced map helping Dhaka find the best Iftar and Sehri spots.

📖 The Story
What started as a simple weekend hackathon project to solve a personal problem—finding good local food during Ramadan—unexpectedly exploded. Biriyani Dibe went viral, amassing over 5 million views across platforms, 2 million+ hits, and 100,000+ active users in a matter of days.

It was featured on national news, but the massive surge in traffic brought the ultimate developer reality check: our servers caught on fire. We experienced database connection limits maxing out and sophisticated bot attacks (using tools like faker.js) flooding the map with fake pins.

We are officially open-sourcing the frontend so the community can help build the ultimate food map, improve our security, and learn from our scaling challenges together.

💻 Tech Stack (The Journey)
Current / Previous Stack
Frontend: React + Vite (Fast, optimized, and lightweight)

Backend & Database: Supabase (PostgreSQL)

Hosting & Edge Network: Migrated from Vercel to Cloudflare Pages (To utilize Cloudflare's heavy DDoS & Bot Fight Mode during the viral surge)

Map Integration: (Add your specific map provider here, e.g., Mapbox, Google Maps API, or Leaflet)

The Architecture Pivot
Initially, the app utilized Supabase's real-time WebSocket listeners. When 100,000+ users hit the app simultaneously, it maxed out concurrent connection limits. We had to quickly pivot to a heavy edge-caching strategy and move to Cloudflare to absorb the malicious traffic.

✨ Features
Interactive Map: Browse crowdsourced pins for Iftar and Sehri locations across Dhaka.

Add a Spot: Users can drop pins to recommend their favorite local Biriyani, Haleem, or Tehari joints.

Real-Time Discovery: Find hidden gems that aren't listed on standard delivery apps.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or higher recommended)

npm or yarn

Installation
Clone the repo:

Bash
git clone https://github.com/zubairprince111/biriyani-map-live.git
Navigate to the project directory:

Bash
cd biriyani-map-live
Install dependencies:

Bash
npm install
Set up your environment variables (Create a .env file in the root):

Code snippet
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# Add your map API keys here
Start the development server:

Bash
npm run dev
🤝 Contributing & The Challenge
We are actively looking for the community's help! Since we have open public-write endpoints, we are currently battling automated scripts dropping fake data.

Areas we need help with:

Frontend Anti-Spam: Implementing Cloudflare Turnstile or robust client-side validation.

Data Moderation UI: Building community-driven upvote/downvote systems to hide fake pins.

Performance: Optimizing map rendering for hundreds of markers without lagging mobile devices.

Eid Features: Transitioning the map to show "Open on Eid" spots and dessert locations.

If you have experience with these challenges, we would love your Pull Requests!
