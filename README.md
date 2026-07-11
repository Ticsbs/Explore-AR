# 🧭 ExploreAR

### Your intelligent companion for exploring the world — safely, spontaneously, and without the guesswork.

**Track:** Base44 Track — Build Prototypes with Base44
**Team:** Vision Hackerz

---

## 🌍 The Problem

Every traveler juggles the same five apps just to get through one day abroad — a weather app, a maps app, a translator, a safety hotline number scribbled on paper, and a search engine to figure out "what even is this building I'm standing in front of?"

That fragmentation isn't just inconvenient — in unfamiliar cities, in emergencies, in places where the traveler doesn't speak the language or know the local emergency number, it costs precious time. **ExploreAR** exists to close that gap: one app that understands *where you are*, *what's around you*, and *what to do if something goes wrong*.

## 💡 What We Built

ExploreAR is a real-time, location-intelligent travel companion that doesn't just show you the world — it understands your place in it.

| Module | What it does |
|---|---|
| 🏠 **Home Intelligence** | Live weather for your real location, upcoming local festivals & holidays, and a real-time travel map of your saved destinations |
| 🔍 **Global Search** | Search any place, monument, or destination on Earth — powered by live places data, not a static database |
| 📸 **Scan & Identify** | Point your camera at a monument — ExploreAR identifies it on the spot with its history, year built, and lesser-known facts |
| 🍽️ **Nearby Intelligence** | One tap surfaces real restaurants, medical facilities, or hotels around your current location — complete with routes to get there |
| 🛡️ **Safety Center** | A live, location-aware safety score, real-time weather advisories, one-tap emergency dialing, and nearby hospitals & police stations |
| 📍 **Live Location Sharing** | Share your real-time location with anyone, on any app, with a single tap — built on the device's native share sheet, no lock-in to one platform |
| ⚙️ **Adaptive Settings** | Every preference — language, accessibility, notifications, saved itineraries — reflects real, persisted user choices |

## 🧠 What Makes This Different

Most travel-safety prototypes stop at showing you a map with pins on it. ExploreAR was built around one core belief: **context is safety**. A traveler doesn't need *more* information — they need the *right* information, surfaced automatically, based on exactly where they're standing right now.

That's why almost nothing in ExploreAR is static. There is no dummy data, no hardcoded city, no placeholder festival list. Every screen — weather, festivals, nearby places, safety scoring — is computed live from the user's actual coordinates the moment they open the app. If you're in Kyoto, ExploreAR knows it's Kyoto. If you're in a city hosting a festival next week, ExploreAR tells you before you'd have stumbled onto it yourself.

## 🏗️ How It's Built

ExploreAR was rapid-prototyped end-to-end for this hackathon, with a strong focus on **real data over mock data** — every core feature is wired to live geolocation and live third-party data sources rather than pre-filled demo content, because a safety tool that lies about "nearby" isn't actually useful.

**Core principles behind the build:**
- **Location-first architecture** — one real GPS fetch, reused consistently across every screen instead of asking repeatedly
- **Graceful degradation** — every data-driven section has a real loading state and a real empty/error state, never a silent blank screen
- **Native-first, not integration-heavy** — location sharing uses the device's own share sheet so it works with *any* messaging app the user already has, instead of us reinventing WhatsApp/Instagram integrations one by one

## 🚀 What's Next

- Expanding Scan into full live augmented-reality overlays (currently photo-based identification)
- Offline-first safety data for low-connectivity regions
- Community-verified safety scores layered on top of live data
- Multi-language real-time translation baked into Search and Scan

## 👥 Team Vision Hackerz

| Name | Role |
|---|---|
| [Name] | |
| [Name] | |
| [Name] | |
| [Name] | |

---

*Built with persistence, a lot of debugging, and the belief that the twenty-first attempt is the one that lands.*
