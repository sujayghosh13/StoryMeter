import { NavLink, useLocation } from 'react-router-dom';
import { Compass, BookOpen, Grid3X3, Users, BarChart3, Search, X, Menu, Zap } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: Compass, label: 'Explore' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/genres', icon: Grid3X3, label: 'Genres' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden glass rounded-xl p-2.5 text-white hover:text-neon-blue transition-colors"
        id="sidebar-toggle"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40
        glass-strong
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-neon-blue">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">StoryMeter</h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">Track · Feel · Discover</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/10 text-neon-blue shadow-neon-blue/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
                id={`nav-${label.toLowerCase()}`}
              >
                <Icon size={18} className={isActive ? 'text-neon-blue' : ''} />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-neon-purple/10 to-neon-blue/5 border border-neon-purple/20">
          <p className="text-xs text-gray-400 mb-1">✨ Pro Tip</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Select your mood to get personalized book recommendations!
          </p>
        </div>
      </aside>
    </>
  );
}
