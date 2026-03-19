import { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroBanner({ books = [] }) {
  const [current, setCurrent] = useState(0);

  const displayBooks = books.length > 0 ? books.slice(0, 6) : [];
  const book = displayBooks[current];

  useEffect(() => {
    if (displayBooks.length === 0) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % displayBooks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBooks.length]);

  if (!book) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 h-[320px] md:h-[380px]" id="hero-banner">
      {/* Background image */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : 'none',
          backgroundColor: '#1a1a2e',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.4)',
          transform: 'scale(1.2)',
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-6 md:px-10">
        <div className="flex items-center gap-8 w-full">
          {/* Book cover */}
          <Link to={`/book/${book.id}`} className="hidden sm:block flex-shrink-0">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-36 md:w-44 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0, 212, 255, 0.1)' }}
              />
            ) : (
              <div className="w-36 md:w-44 aspect-[2/3] rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-4xl">
                📚
              </div>
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> Trending
              </span>
              <span className="text-xs text-gray-400">{book.genre}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {book.title}
            </h2>
            <p className="text-sm text-gray-400 mb-1">by {book.author}</p>
            <p className="text-sm text-gray-500 mb-5 line-clamp-2 max-w-lg">
              {book.description}
            </p>

            <div className="flex items-center gap-4">
              <Link
                to={`/book/${book.id}`}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold hover:shadow-neon-blue transition-all duration-300 flex items-center gap-2"
              >
                Explore <ChevronRight size={16} />
              </Link>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-neon-blue">{book.storyMeterScore}</div>
                <div className="text-[10px] text-gray-500 leading-tight">STORY<br/>METER</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displayBooks.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-neon-blue' : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
