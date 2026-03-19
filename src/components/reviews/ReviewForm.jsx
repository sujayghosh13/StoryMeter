import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(75);
  const [text, setText] = useState('');

  const getRatingLabel = (r) => {
    if (r >= 95) return '🌟 Masterpiece';
    if (r >= 85) return '✨ Brilliant';
    if (r >= 75) return '👍 Great';
    if (r >= 60) return '😊 Good';
    if (r >= 40) return '😐 Okay';
    return '💤 Timepass';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit?.({ rating, text });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-5" id="review-form">
      <h4 className="text-sm font-semibold text-white mb-4">Write a Review</h4>

      {/* Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Your Rating</span>
          <span className="text-sm font-bold gradient-text">{getRatingLabel(rating)}</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="story-slider w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-600">Timepass</span>
          <span className="text-[10px] text-gray-600">Masterpiece</span>
        </div>
      </div>

      {/* Text */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Share your thoughts... What made this book special?"
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 resize-none h-24 focus:outline-none focus:border-neon-blue/50 transition-colors mb-3"
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold disabled:opacity-30 hover:shadow-neon-blue transition-all flex items-center gap-2"
      >
        <Send size={14} /> Post Review
      </button>
    </form>
  );
}
