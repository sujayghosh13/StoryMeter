import { Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';

export default function Header() {
  const { searchQuery, setSearchQuery } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    navigate('/search');
  };

  return (
    <header className="sticky top-0 z-20 glass-strong px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative ml-12 md:ml-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
            placeholder="Search books, authors, genres..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/[0.07] transition-all"
            id="search-input"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors" id="notifications-btn">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
              alt="Avatar"
              className="w-8 h-8 rounded-full ring-2 ring-neon-blue/30 object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">Alex Rivera</p>
              <p className="text-[10px] text-neon-blue">12 day streak 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
