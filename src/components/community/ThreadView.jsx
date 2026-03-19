import { Heart, MessageCircle, Clock } from 'lucide-react';

export default function ThreadView({ thread }) {
  return (
    <div className="glass rounded-xl p-5 mb-3" id={`thread-${thread.id}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={thread.authorAvatar}
          alt={thread.author}
          className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
        />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white hover:text-neon-blue transition-colors cursor-pointer">
            {thread.title}
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
            <span>{thread.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={10} />{thread.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-300 mb-3 leading-relaxed">{thread.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-3">
        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-pink transition-colors">
          <Heart size={14} /> {thread.likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-blue transition-colors">
          <MessageCircle size={14} /> {thread.replies?.length || 0}
        </button>
      </div>

      {/* Replies */}
      {thread.replies?.length > 0 && (
        <div className="pl-4 border-l border-white/5 space-y-3">
          {thread.replies.map((reply, i) => (
            <div key={i} className="bg-white/[0.02] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-300">{reply.author}</span>
                <span className="text-[10px] text-gray-600">{reply.timestamp}</span>
              </div>
              <p className="text-xs text-gray-400">{reply.content}</p>
              <button className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-neon-pink mt-1.5 transition-colors">
                <Heart size={10} /> {reply.likes}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
