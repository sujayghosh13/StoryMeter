import { Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { users } from '../../data/users';

export default function ReviewCard({ review }) {
  const { likedReviews, toggleLikeReview } = useApp();
  const isLiked = likedReviews.has(review.id);
  const user = users.find(u => u.id === review.userId);

  const getRatingLabel = (r) => {
    if (r >= 95) return 'Masterpiece';
    if (r >= 85) return 'Brilliant';
    if (r >= 75) return 'Great';
    if (r >= 60) return 'Good';
    return 'Timepass';
  };

  const getRatingColor = (r) => {
    if (r >= 95) return 'text-neon-blue';
    if (r >= 85) return 'text-neon-purple';
    if (r >= 75) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="glass rounded-xl p-5 mb-3" id={`review-${review.id}`}>
      <div className="flex items-start gap-3">
        <img
          src={user?.avatar || ''}
          alt={user?.name}
          className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-white">{user?.name}</span>
            <span className={`text-xs font-bold ${getRatingColor(review.rating)}`}>
              {review.rating}% — {getRatingLabel(review.rating)}
            </span>
            <span className="text-[10px] text-gray-600">{review.timestamp}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{review.text}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLikeReview(review.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                isLiked ? 'text-neon-pink' : 'text-gray-500 hover:text-neon-pink'
              }`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              {review.likes + (isLiked ? 1 : 0)}
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-blue transition-colors">
              <MessageCircle size={14} />
              {review.comments?.length || 0}
            </button>
          </div>

          {/* Comments */}
          {review.comments?.length > 0 && (
            <div className="mt-3 pl-4 border-l border-white/5 space-y-2">
              {review.comments.map((c, i) => (
                <div key={i} className="text-xs">
                  <span className="font-semibold text-gray-300">{c.author || users.find(u => u.id === c.userId)?.name}</span>
                  <span className="text-gray-500 ml-2">{c.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
