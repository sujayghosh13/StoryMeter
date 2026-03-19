import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, ExternalLink, ShoppingCart, Quote, Globe, Loader2 } from 'lucide-react';
import { useBookDetail, useRecommendations } from '../hooks/useBooks';
import { reviews as allReviews } from '../data/reviews';
import StoryMeterScore from '../components/books/StoryMeterScore';
import VibeChart from '../components/books/VibeChart';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewForm from '../components/reviews/ReviewForm';
import BookCard from '../components/books/BookCard';
import { useApp } from '../context/AppContext';

export default function BookDetailPage() {
  const { id } = useParams();
  const { getBookStatus, setBookStatus } = useApp();
  const [sortReviews, setSortReviews] = useState('top');
  
  // API hooks
  const { book, loading, error } = useBookDetail(id);
  const { books: recommendations } = useRecommendations(book?.genre, book?.moods?.[0]);

  if (loading) {
    return (
      <div className="page-enter flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 size={28} className="animate-spin text-neon-blue" />
        <p className="text-sm text-gray-500">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="page-enter flex flex-col items-center justify-center h-[60vh] gap-2">
        <p className="text-4xl">📚</p>
        <p className="text-gray-500">{error || 'Book not found'}</p>
        <Link to="/" className="text-xs text-neon-blue hover:underline mt-2">← Back to Explore</Link>
      </div>
    );
  }

  const status = getBookStatus(book.id);
  // Optional: keep static reviews for demo purposes, mapping them by looking for a matching title or just randomizing
  // Since we don't have review IDs matching Google Books IDs, we'll just show some random reviews if it's trending or has good score
  const bookReviews = allReviews.slice(0, Math.floor(book.storyMeterScore / 15));
  
  const sortedReviews = [...bookReviews].sort((a, b) =>
    sortReviews === 'top' ? b.likes - a.likes : new Date(b.timestamp) - new Date(a.timestamp)
  );

  const readingTime = book.pageCount ? Math.ceil(book.pageCount / 40) : null;

  const vibeData = book.vibeData || {
    emotion: 75,
    plotDepth: 80,
    characterDev: 78,
    pacing: 82,
    writingStyle: 77,
  };

  const statusButtons = [
    { key: 'want', label: '📌 Want to Read', color: 'from-neon-blue/20 to-neon-blue/5 border-neon-blue/30 text-neon-blue' },
    { key: 'reading', label: '📖 Currently Reading', color: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 text-neon-purple' },
    { key: 'completed', label: '✅ Completed', color: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400' },
  ];

  const purchaseLinks = book.purchaseLinks || {
    amazon: `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`,
    kindle: `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}&i=digital-text`,
  };

  return (
    <div className="page-enter max-w-5xl mx-auto" id="book-detail-page">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-neon-blue transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Explore
      </Link>

      {/* API badge */}
      {book.isFromApi && (
        <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20 w-fit">
          <Globe size={12} className="text-neon-purple" />
          <span className="text-[10px] text-neon-purple font-medium uppercase tracking-wider">Google Books API</span>
        </div>
      )}

      {/* Hero section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Cover */}
        <div className="flex-shrink-0">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-48 md:w-56 rounded-2xl shadow-2xl mx-auto md:mx-0"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0, 212, 255, 0.1)' }}
            />
          ) : (
            <div className="w-48 md:w-56 aspect-[2/3] rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center mx-auto md:mx-0">
              <BookOpen size={48} className="text-gray-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#a855f722', color: '#a855f7' }}>
              {book.genre || 'Fiction'}
            </span>
            {book.publishYear && <span className="text-xs text-gray-500">{book.publishYear}</span>}
            {book.trending && (
              <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-semibold">
                🔥 Trending
              </span>
            )}
            {book.averageRating > 0 && (
              <span className="text-xs text-gray-500">
                ⭐ {book.averageRating}/5 ({book.ratingsCount?.toLocaleString()} ratings)
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{book.title}</h1>
          <p className="text-base text-gray-400 mb-4">by <span className="text-gray-300">{book.author}</span></p>
          {book.publisher && <p className="text-xs text-gray-500 mb-3">Published by {book.publisher}</p>}

          <div className="flex items-center gap-6 mb-5">
            <StoryMeterScore score={book.storyMeterScore} size={72} />
            <div className="space-y-1.5 text-sm text-gray-400">
              {book.pageCount > 0 && (
                <div className="flex items-center gap-2"><BookOpen size={14} /> {book.pageCount} pages</div>
              )}
              {readingTime && (
                <div className="flex items-center gap-2"><Clock size={14} /> ~{readingTime}h reading time</div>
              )}
              {book.moods?.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {book.moods.map(m => (
                    <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed mb-5 line-clamp-6">{book.description}</p>

          {/* Status buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            {statusButtons.map(btn => (
              <button
                key={btn.key}
                onClick={() => setBookStatus(book.id, status === btn.key ? null : btn.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  status === btn.key
                    ? `bg-gradient-to-r ${btn.color}`
                    : 'border-white/10 text-gray-400 hover:bg-white/5'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Purchase links */}
          <div className="flex items-center gap-3 flex-wrap">
            <a href={purchaseLinks.amazon} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-gray-400 hover:text-neon-blue transition-colors">
              <ShoppingCart size={14} /> Buy on Amazon
              <ExternalLink size={10} />
            </a>
            <a href={purchaseLinks.kindle} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-gray-400 hover:text-neon-blue transition-colors">
              <BookOpen size={14} /> Read on Kindle
              <ExternalLink size={10} />
            </a>
            {book.previewLink && (
              <a href={book.previewLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-gray-400 hover:text-neon-purple transition-colors">
                <Globe size={14} /> Google Preview
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Charts + Quotes grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <VibeChart vibeData={vibeData} />

        {/* Quotes */}
        <div className="glass rounded-2xl p-5" id="book-quotes">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Quote size={14} className="text-neon-pink" /> Notable Quotes
          </h3>
          <div className="space-y-4">
            {book.quotes?.length > 0 ? (
              book.quotes.map((quote, i) => (
                <div key={i} className="pl-4 border-l-2 border-neon-purple/30">
                  <p className="text-sm text-gray-300 italic leading-relaxed">"{quote}"</p>
                </div>
              ))
            ) : (
              <div className="pl-4 border-l-2 border-white/10">
                <p className="text-sm text-gray-500 italic">No quotes available for this book yet. Dive in to find your own!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mb-10" id="book-reviews">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Community Reviews</h2>
          <div className="flex gap-2">
            {['top', 'latest'].map(s => (
              <button
                key={s}
                onClick={() => setSortReviews(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sortReviews === s ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s === 'top' ? '🔝 Top' : '🕐 Latest'}
              </button>
            ))}
          </div>
        </div>
        <ReviewForm />
        <div className="mt-6 space-y-3">
          {sortedReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {sortedReviews.length === 0 && (
            <div className="text-center py-10 glass rounded-2xl">
              <p className="text-2xl mb-2">⭐</p>
              <p className="text-sm text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <section className="mb-10" id="recommendations">
          <h2 className="text-lg font-bold text-white mb-5">💡 If You Liked This, Read These</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
