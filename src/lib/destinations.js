export const DESTINATIONS = [
  {
    id: 1, name: "Paris", country: "France", category: "Culture", categories: ["Culture", "History", "Food"],
    lat: 48.8566, lng: 2.3522,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.8, distance: "5,500 km", budget: "$1,200", weather: "18°C ☀️",
    description: "The City of Light enchants with iconic landmarks, world-class cuisine, and timeless romance."
  },
  {
    id: 2, name: "Kyoto", country: "Japan", category: "History", categories: ["History", "Culture"],
    lat: 35.0116, lng: 135.7681,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    rating: 4.9, distance: "9,200 km", budget: "$1,500", weather: "22°C 🌤",
    description: "Ancient temples, pristine gardens, and centuries of tradition await in Japan's cultural heart."
  },
  {
    id: 3, name: "Bali", country: "Indonesia", category: "Nature", categories: ["Nature", "Adventure", "Culture"],
    lat: -8.3405, lng: 115.0920,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.7, distance: "12,000 km", budget: "$800", weather: "28°C 🌴",
    description: "Tropical paradise of emerald rice terraces, sacred temples, and world-class surfing."
  },
  {
    id: 4, name: "Santorini", country: "Greece", category: "Adventure", categories: ["Adventure", "Culture"],
    lat: 36.3932, lng: 25.4615,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    rating: 4.9, distance: "8,000 km", budget: "$1,800", weather: "25°C ☀️",
    description: "Iconic white-washed cliffs overlooking the sparkling Aegean Sea with legendary sunsets."
  },
  {
    id: 5, name: "Jaipur", country: "India", category: "Culture", categories: ["Culture", "History"],
    lat: 26.9124, lng: 75.7873,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    rating: 4.6, distance: "6,800 km", budget: "$600", weather: "32°C 🌞",
    description: "The Pink City dazzles with royal palaces, vibrant bazaars, and centuries of Rajput heritage."
  },
  {
    id: 6, name: "Iceland", country: "Iceland", category: "Adventure", categories: ["Adventure", "Nature"],
    lat: 64.9631, lng: -19.0208,
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    rating: 4.8, distance: "4,200 km", budget: "$2,000", weather: "5°C ❄️",
    description: "Land of fire and ice with geysers, glaciers, northern lights, and dramatic volcanic landscapes."
  },
  {
    id: 7, name: "Marrakech", country: "Morocco", category: "Culture", categories: ["Culture", "History", "Food"],
    lat: 31.6295, lng: -7.9811,
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    rating: 4.5, distance: "3,500 km", budget: "$700", weather: "30°C ☀️",
    description: "Sensory overload of spice souks, ornate riads, and the magic of Jemaa el-Fnaa square."
  },
  {
    id: 8, name: "Machu Picchu", country: "Peru", category: "History", categories: ["History", "Adventure"],
    lat: -13.1631, lng: -72.5450,
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    rating: 4.9, distance: "10,500 km", budget: "$1,100", weather: "16°C 🌤",
    description: "The lost Incan citadel perched high in the Andes, shrouded in mist and mystery."
  }
];

export const SUGGESTIONS = [
  "Paris", "France", "Eiffel Tower", "Louvre Museum", "Versailles",
  "Kyoto", "Japan", "Tokyo", "Mount Fuji", "Fushimi Inari",
  "Bali", "Indonesia", "Ubud", "Kuta Beach", "Tanah Lot",
  "Santorini", "Greece", "Athens", "Acropolis", "Mykonos",
  "Jaipur", "India", "Taj Mahal", "Agra", "Delhi", "Mumbai", "Varanasi",
  "Iceland", "Reykjavik", "Blue Lagoon", "Northern Lights",
  "Marrakech", "Morocco", "Casablanca", "Fes", "Sahara Desert",
  "Machu Picchu", "Peru", "Cusco", "Lima", "Sacred Valley",
  "Rome", "Italy", "Colosseum", "Vatican", "Venice", "Florence", "Pisa",
  "Germany", "Berlin", "Brandenburg Gate", "Neuschwanstein Castle", "Cologne Cathedral", "Berlin Wall", "Munich",
  "Spain", "Barcelona", "Sagrada Familia", "Madrid", "Seville",
  "Egypt", "Pyramids of Giza", "Cairo", "Luxor", "Aswan",
  "London", "UK", "Big Ben", "Tower Bridge", "Stonehenge",
  "USA", "New York", "Statue of Liberty", "Grand Canyon", "San Francisco",
  "Australia", "Sydney", "Opera House", "Great Barrier Reef",
  "China", "Beijing", "Great Wall of China", "Shanghai", "Terracotta Army",
  "Cambodia", "Angkor Wat",
  "Brazil", "Rio de Janeiro", "Christ the Redeemer",
  "Turkey", "Istanbul", "Hagia Sophia", "Cappadocia",
  "South Africa", "Cape Town", "Table Mountain",
  "Czech Republic", "Prague", "Charles Bridge",
  "Austria", "Vienna", "Schonbrunn Palace",
  "Russia", "Moscow", "Red Square", "Saint Basil's Cathedral",
  "Thailand", "Bangkok", "Chiang Mai", "Phuket",
  "Vietnam", "Hanoi", "Ha Long Bay",
  "Jordan", "Petra",
];

export const LANDMARKS = [
  {
    id: 1, name: "Eiffel Tower", city: "Paris",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&q=80",
    year: 1889, style: "Iron lattice / Art Nouveau",
    hours: "9:30 AM – 11:45 PM", fee: "€26.80",
    bestTime: "Sunset (7-8 PM)",
    summary: "Gustave Eiffel's masterpiece, originally built as the entrance arch for the 1889 World's Fair. Standing at 330m, it was the world's tallest structure for 41 years.",
    facts: ["Takes 60 tons of paint every 7 years", "Has 1,665 steps to the top", "Was meant to be temporary", "Grows 15cm taller in summer heat"],
    nearby: ["Trocadéro Gardens", "Champ de Mars", "Seine River Cruises"],
    restaurants: ["Le Jules Verne", "Café de l'Homme", "Les Ombres"]
  },
  {
    id: 2, name: "Taj Mahal", city: "Agra",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    year: 1653, style: "Mughal Architecture",
    hours: "6:00 AM – 6:30 PM", fee: "₹1,100",
    bestTime: "Sunrise (5:30-7 AM)",
    summary: "A monument to eternal love, built by Emperor Shah Jahan for his wife Mumtaz Mahal. This ivory-white marble mausoleum is one of the New Seven Wonders.",
    facts: ["Took 22 years to build", "20,000 artisans worked on it", "Changes color throughout the day", "Minarets tilt slightly outward for safety"],
    nearby: ["Agra Fort", "Mehtab Bagh", "Itimad-ud-Daulah"],
    restaurants: ["Pinch of Spice", "Joney's Place", "Sheroes Hangout"]
  },
  {
    id: 3, name: "Colosseum", city: "Rome",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    year: 80, style: "Roman Architecture",
    hours: "8:30 AM – 7:00 PM", fee: "€16",
    bestTime: "Early morning (8:30-10 AM)",
    summary: "The largest ancient amphitheatre ever built, hosting gladiatorial contests and spectacles for over 500 years. Could seat 50,000-80,000 spectators.",
    facts: ["Built in just 8 years", "Had a retractable sun awning", "Underground tunnels housed animals", "Free admission for ancient Romans"],
    nearby: ["Roman Forum", "Palatine Hill", "Arch of Constantine"],
    restaurants: ["Ristorante Aroma", "Luzzi", "Hostaria da Nerone"]
  }
];

export const FESTIVALS = [
  { name: "Diwali Festival", location: "India", date: "Oct 20-24", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80" },
  { name: "Cherry Blossom", location: "Japan", date: "Mar 25 - Apr 10", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80" },
  { name: "Carnival", location: "Rio de Janeiro", date: "Feb 25 - Mar 5", image: "https://images.unsplash.com/photo-1551029506-0807df4e2031?w=800&q=80" },
  { name: "Holi Festival", location: "India", date: "Mar 14", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" }
];

export const CATEGORIES = [
  { name: "Culture", icon: "Palette", color: "from-blue-500 to-indigo-600" },
  { name: "Nature", icon: "TreePine", color: "from-emerald-500 to-teal-600" },
  { name: "Adventure", icon: "Mountain", color: "from-orange-500 to-red-600" },
  { name: "History", icon: "Landmark", color: "from-amber-500 to-yellow-600" },
  { name: "Food", icon: "UtensilsCrossed", color: "from-pink-500 to-rose-600" },
  { name: "Photography", icon: "Camera", color: "from-purple-500 to-violet-600" }
];