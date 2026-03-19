import { Link } from 'react-router-dom';
import StoryMeterScore from './StoryMeterScore';
import { useApp } from '../../context/AppContext';
import { BookOpen, Heart, Clock } from 'lucide-react';

export default function BookCard({ book }) {
  const { getBookStatus } = useApp();
  const status = getBookStatus(book.id);

  const statusColors = {
    want: 'bg-neon-blue/20 text-neon-blue',
    reading: 'bg-neon-purple/20 text-neon-purple',
    completed: 'bg-neon-green/20 text-green-400',
  };

  const statusLabels = {
    want: 'Want to Read',
    reading: 'Reading',
    completed: 'Completed',
  };

  const readingTime = Math.ceil(book.pageCount / 40);

  return (
    <Link to={`/book/${book.id}`} className="group block" id={`book-card-${book.id}`}>
      <div className="glass rounded-2xl overflow-hidden card-hover">
        {/* Cover */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />

          {/* Score badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <StoryMeterScore score={book.storyMeterScore} size={56} />
          </div>

          {/* Status badge */}
          {status && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${statusColors[status]}`}>
              {statusLabels[status]}
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 backdrop-blur-sm">
                {book.genre}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {readingTime}h
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate group-hover:text-neon-blue transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-gray-400 truncate">{book.author}</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-full bg-white/5 rounded-full h-1.5 w-20">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000"
                style={{ width: `${book.storyMeterScore}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-neon-blue">{book.storyMeterScore}%</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Heart size={12} />
            <span className="text-[10px]">{Math.floor(Math.random() * 200 + 50)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
