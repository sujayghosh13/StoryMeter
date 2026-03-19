import { useApp } from '../context/AppContext';
import { currentUser } from '../data/users';
import { useLibraryBooks } from '../hooks/useBooks';
import StatsCard from '../components/dashboard/StatsCard';
import BadgeCard from '../components/dashboard/BadgeCard';
import ReadingChart from '../components/dashboard/ReadingChart';
import { Flame, Target, Trophy, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { library, userRatings } = useApp();

  const allLibIds = [...new Set([...library.wantToRead, ...library.currentlyReading, ...library.completed])];
  const { books: completedBooks, loading } = useLibraryBooks(library.completed);

  const avgRating = Object.values(userRatings).length
    ? Math.round(Object.values(userRatings).reduce((s, r) => s + r, 0) / Object.values(userRatings).length)
    : 0;

  // Favorite genre
  const genreCounts = {};
  completedBooks.forEach(b => { genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1; });
  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Total pages
  const totalPages = completedBooks.reduce((s, b) => s + (b.pageCount || 0), 0);

  return (
    <div className="page-enter" id="dashboard-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {currentUser.name}! Here's your reading journey.</p>
      </div>

      {/* Profile card */}
      <div className="glass rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-neon-blue/20"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
          <p className="text-sm text-gray-400">Member since {new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-semibold flex items-center gap-1.5">
              <Flame size={12} /> {currentUser.streak} day streak
            </span>
            <span className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-semibold">
              ❤️ {loading ? '...' : favoriteGenre} lover
            </span>
          </div>
        </div>
        <div className="sm:ml-auto text-center">
          <div className="text-3xl font-bold gradient-text">{allLibIds.length}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Books in Library</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon="📚" value={library.completed.length} label="Books Read" color="#00d4ff" />
        <StatsCard icon="⭐" value={avgRating} label="Avg Rating" color="#a855f7" suffix="%" />
        <StatsCard icon="🔥" value={currentUser.streak} label="Day Streak" color="#ef4444" />
        <StatsCard 
          icon={loading ? <Loader2 size={16} className="animate-spin" /> : "📄"} 
          value={loading ? '...' : totalPages.toLocaleString()} 
          label="Pages Read" 
          color="#22c55e" 
        />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ReadingChart />

        {/* Genre breakdown */}
        <div className="glass rounded-2xl p-5" id="genre-breakdown">
          <h3 className="text-sm font-semibold text-white mb-4">📊 Genre Distribution</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400 gap-2">
              <Loader2 size={24} className="animate-spin text-neon-blue" />
              <p className="text-sm">Calculating stats...</p>
            </div>
          ) : completedBooks.length === 0 ? (
            <div className="text-center p-8 text-gray-500 text-sm">
              Complete some books to see your genre distribution!
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).map(([genre, count]) => {
                const total = completedBooks.length;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={genre}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-300">{genre}</span>
                      <span className="text-xs text-gray-500">{count} books · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, #00d4ff, #a855f7)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <section className="mb-8" id="badges-section">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-neon-blue" /> Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentUser.badges.map(badge => (
            <BadgeCard key={badge} badgeKey={badge} />
          ))}
        </div>
      </section>

      {/* Reading goals */}
      <div className="glass rounded-2xl p-6" id="reading-goal">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Target size={16} className="text-neon-pink" /> 2026 Reading Goal
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-400">{library.completed.length} of 50 books</span>
              <span className="text-xs text-neon-blue font-semibold">{Math.round((library.completed.length / 50) * 100)}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all"
                style={{ width: `${(library.completed.length / 50) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 mt-3">
          {50 - library.completed.length} books to go! Keep the streak alive 🔥
        </p>
      </div>
    </div>
  );
}
