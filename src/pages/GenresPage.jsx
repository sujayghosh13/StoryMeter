import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { genres } from '../data/books';
import BookCard from '../components/books/BookCard';
import { useGenreBooks, useBooks } from '../hooks/useBooks';
import { ArrowLeft, Star, Loader2, Globe } from 'lucide-react';

export default function GenresPage() {
  const { genre: selectedGenre } = useParams();
  const [sort, setSort] = useState('score');
  
  // For the main Grid view (all genres)
  const { allBooks } = useBooks();

  // For the Detail view (specific genre)
  const { books: genreBooks, loading } = useGenreBooks(selectedGenre);

  const sortedGenreBooks = useMemo(() => {
    let filtered = [...genreBooks];
    if (sort === 'score') filtered.sort((a, b) => b.storyMeterScore - a.storyMeterScore);
    else if (sort === 'year') filtered.sort((a, b) => b.publishYear - a.publishYear);
    else if (sort === 'pages') filtered.sort((a, b) => a.pageCount - b.pageCount);
    return filtered;
  }, [genreBooks, sort]);

  // Genre grid view
  if (!selectedGenre) {
    return (
      <div className="page-enter" id="genres-page">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Genres</h1>
          <p className="text-sm text-gray-500">Explore books by category — Powered by Google Books API</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {genres.map(genre => {
            const genreMatches = allBooks.filter(b => b.genre === genre.name);
            const count = genreMatches.length;
            const avgScore = count > 0 
              ? Math.round(genreMatches.reduce((s, b) => s + b.storyMeterScore, 0) / count)
              : 85;

            return (
              <Link
                key={genre.name}
                to={`/genres/${genre.name}`}
                className="glass rounded-2xl p-6 card-hover group"
                id={`genre-${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-4xl mb-3">{genre.icon}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">
                  {genre.name}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{count > 0 ? `${count}+ trending` : 'Discover'}</span>
                  <span className="flex items-center gap-1">
                    <Star size={10} className="text-neon-blue" /> Avg {avgScore}%
                  </span>
                </div>
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${avgScore}%`, background: genre.color }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Genre detail view
  const genre = genres.find(g => g.name === selectedGenre);

  return (
    <div className="page-enter" id="genre-detail-page">
      <Link to="/genres" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-neon-blue transition-colors mb-6">
        <ArrowLeft size={16} /> All Genres
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{genre?.icon}</span>
          <h1 className="text-2xl font-bold text-white">{selectedGenre}</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            {loading ? 'Searching...' : `${genreBooks.length} books found`}
          </p>
          {!loading && genreBooks.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20">
              <Globe size={10} className="text-neon-purple" />
              <span className="text-[9px] text-neon-purple font-medium uppercase tracking-wider">Live API</span>
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 glass rounded-2xl">
          <Loader2 size={24} className="animate-spin text-neon-blue" />
          <p className="text-sm text-gray-400">Loading {selectedGenre} books from Google...</p>
        </div>
      ) : (
        <>
          {/* Sort */}
          {genreBooks.length > 0 && (
            <div className="flex gap-2 mb-6">
              {[
                { key: 'score', label: 'Top Rated', icon: '⭐' },
                { key: 'year', label: 'Newest', icon: '🆕' },
                { key: 'pages', label: 'Shortest', icon: '📄' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    sort === s.key ? 'bg-neon-blue/20 text-neon-blue' : 'glass text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedGenreBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {!loading && genreBooks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400 text-sm">No books found for this genre.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
