export const users = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    booksRead: 47,
    favoriteGenre: "Fantasy",
    averageRating: 88,
    streak: 12,
    joinDate: "2024-03-15",
    badges: ["bookworm", "reviewer_pro", "streak_master"],
  },
  {
    id: 2,
    name: "Maya Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    booksRead: 62,
    favoriteGenre: "Sci-Fi",
    averageRating: 91,
    streak: 24,
    joinDate: "2023-11-01",
    badges: ["bookworm", "reviewer_pro", "genre_explorer", "century_club"],
  },
  {
    id: 3,
    name: "Jordan Park",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    booksRead: 35,
    favoriteGenre: "Thriller",
    averageRating: 85,
    streak: 7,
    joinDate: "2024-06-20",
    badges: ["bookworm", "night_owl"],
  },
  {
    id: 4,
    name: "Sam Taylor",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
    booksRead: 89,
    favoriteGenre: "Romance",
    averageRating: 82,
    streak: 45,
    joinDate: "2023-05-10",
    badges: ["bookworm", "reviewer_pro", "streak_master", "genre_explorer", "century_club"],
  },
  {
    id: 5,
    name: "Riley Kim",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    booksRead: 53,
    favoriteGenre: "Literary Fiction",
    averageRating: 90,
    streak: 18,
    joinDate: "2024-01-08",
    badges: ["bookworm", "reviewer_pro", "eloquent_writer"],
  },
];

export const currentUser = users[0];

export const badges = {
  bookworm: { name: "Bookworm", icon: "📚", description: "Read 10+ books", color: "#a855f7" },
  reviewer_pro: { name: "Reviewer Pro", icon: "✍️", description: "Write 20+ reviews", color: "#00d4ff" },
  streak_master: { name: "Streak Master", icon: "🔥", description: "30+ day reading streak", color: "#ef4444" },
  genre_explorer: { name: "Genre Explorer", icon: "🗺️", description: "Read books from 5+ genres", color: "#22c55e" },
  century_club: { name: "Century Club", icon: "💯", description: "Read 100+ books", color: "#f59e0b" },
  night_owl: { name: "Night Owl", icon: "🦉", description: "Read past midnight 10+ times", color: "#6366f1" },
  eloquent_writer: { name: "Eloquent Writer", icon: "🪶", description: "Get 50+ likes on a review", color: "#ec4899" },
};

export default users;
