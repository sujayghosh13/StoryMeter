import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../hooks/useBooks';
import { genres, moods } from '../data/books';
import BookCard from '../components/books/BookCard';
import { Search, SlidersHorizontal, X, Globe, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [filterGenre, setFilterGenre] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Hook for API search with debounce
  const { books: searchResults, loading, totalItems } = useSearch(localQuery, {
    orderBy: sortBy === 'newest' ? 'newest' : 'relevance',
  });

  // Client-side filtering for score, mood, genre (since API can't do exact score filtering)
  const results = searchResults.filter(b => {
    if (filterGenre && b.genre !== filterGenre) return false;
    if (filterMood && !b.moods.includes(filterMood)) return false;
    if (filterMinScore > 0 && b.storyMeterScore < filterMinScore) return false;
    return true;
  });

  if (sortBy === 'score') results.sort((a, b) => b.storyMeterScore - a.storyMeterScore);
  else if (sortBy === 'title') results.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === 'pages') results.sort((a, b) => a.pageCount - b.pageCount);

  const clearFilters = () => {
    setFilterGenre('');
    setFilterMood('');
    setFilterMinScore(0);
    setSortBy('relevance');
  };

  const hasFilters = filterGenre || filterMood || filterMinScore > 0;

  return (
    <div className="page-enter" id="search-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
          Search & Discover 
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20">
            <Globe size={12} className="text-neon-purple" />
            <span className="text-[10px] text-neon-purple font-medium uppercase tracking-wider">Google Books API</span>
          </span>
        </h1>
        <p className="text-sm text-gray-500">Search millions of books instantly</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={localQuery}
            onChange={e => { setLocalQuery(e.target.value); setSearchQuery(e.target.value); }}
            placeholder="Search by title, author, or keyword..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-all shadow-inner"
            id="search-input"
          />
          {localQuery && (
            <button
              onClick={() => { setLocalQuery(''); setSearchQuery(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
            showFilters || hasFilters
              ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
              : 'glass text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal size={16} /> <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass rounded-2xl p-5 mb-6 animate-slide-up" id="filters-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Refine Results</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-neon-blue hover:underline font-medium">
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Genre</label>
              <select
                value={filterGenre}
                onChange={e => setFilterGenre(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50"
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Mood</label>
              <select
                value={filterMood}
                onChange={e => setFilterMood(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50"
              >
                <option value="">Any Mood</option>
                {moods.map(m => (
                  <option key={m.name} value={m.name}>{m.emoji} {m.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                <span>Min Score</span>
                <span className="text-neon-blue font-bold">{filterMinScore}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filterMinScore}
                onChange={e => setFilterMinScore(Number(e.target.value))}
                className="story-slider w-full mt-2"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50"
              >
                <option value="relevance">API Relevance</option>
                <option value="score">Highest Rated</option>
                <option value="title">Title A-Z</option>
                <option value="newest">Newest</option>
                <option value="pages">Shortest</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-neon-blue" /> Searching Google Books...
            </span>
          ) : (
            <>
              {results.length} {results.length === 1 ? 'book' : 'books'} shown
              {localQuery && <span className="text-gray-400"> for "{localQuery}"</span>}
              {totalItems > 0 && (
                <span className="text-gray-600 ml-1">({totalItems.toLocaleString()} available)</span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Results grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-20 px-4 glass rounded-3xl mt-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-white text-lg font-medium mb-2">
            {localQuery ? 'No exact matches found' : 'Start your next adventure'}
          </p>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {localQuery 
              ? 'Try adjusting your filters or using different keywords to search the Google Books database.' 
              : 'Search millions of books by title, author, or keyword to find your next favorite read.'}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-6 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white font-medium transition-colors">
              Clear Filters
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
