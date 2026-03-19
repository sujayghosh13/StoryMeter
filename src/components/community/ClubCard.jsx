import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClubCard({ club }) {
  return (
    <Link to={`/genres/${club.genre}`} className="block" id={`club-${club.id}`}>
      <div className="glass rounded-2xl p-5 card-hover group">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${club.color}22`, border: `1px solid ${club.color}44` }}
          >
            {club.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">
              {club.name}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Users size={10} />
              {club.members.toLocaleString()} members
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{club.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-600">
            {club.threads.length} active threads
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: club.color, background: `${club.color}15` }}
          >
            {club.genre}
          </span>
        </div>
      </div>
    </Link>
  );
}
