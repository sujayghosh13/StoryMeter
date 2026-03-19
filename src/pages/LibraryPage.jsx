import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLibraryBooks } from '../hooks/useBooks';
import BookCard from '../components/books/BookCard';
import { BookOpen, Heart, CheckCircle, Clock, Loader2 } from 'lucide-react';

const tabs = [
  { key: 'wantToRead', label: 'Want to Read', icon: Heart, color: '#00d4ff' },
  { key: 'currentlyReading', label: 'Reading', icon: BookOpen, color: '#a855f7' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: '#22c55e' },
];

export default function LibraryPage() {
  const { library } = useApp();
  const [activeTab, setActiveTab] = useState('wantToRead');

  const { books: tabBooks, loading } = useLibraryBooks(library[activeTab] || []);

  const totalBooks = library.wantToRead.length + library.currentlyReading.length + library.completed.length;

  return (
    <div className="page-enter" id="library-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">My Library</h1>
        <p className="text-sm text-gray-500">{totalBooks} books in your collection</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {tabs.map(tab => (
          <div key={tab.key} className="glass rounded-xl p-4 text-center">
            <tab.icon size={20} className="mx-auto mb-2" style={{ color: tab.color }} />
            <div className="text-xl font-bold text-white">{library[tab.key].length}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{tab.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/10'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
              style={isActive ? { borderColor: `${tab.color}44` } : {}}
            >
              <tab.icon size={14} style={isActive ? { color: tab.color } : {}} />
              {tab.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5">{library[tab.key].length}</span>
            </button>
          );
        })}
      </div>

      {/* Books Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 glass rounded-2xl">
          <Loader2 size={24} className="animate-spin text-neon-blue" />
          <p className="text-sm text-gray-400">Loading your books...</p>
        </div>
      ) : tabBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tabBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-gray-400 text-sm">No books here yet.</p>
          <p className="text-gray-600 text-xs mt-1">Explore and add books to your library!</p>
        </div>
      )}

      {/* Reading Timeline */}
      {!loading && activeTab === 'completed' && tabBooks.length > 0 && (
        <div className="mt-10" id="reading-timeline">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Clock size={18} className="text-neon-blue" /> Reading Timeline
          </h2>
          <div className="relative pl-6 border-l border-white/10 space-y-6">
            {tabBooks.map((book) => (
              <div key={book.id} className="relative">
                <div className="absolute -left-[29px] w-3 h-3 rounded-full bg-neon-blue border-2 border-dark-900" />
                <div className="glass rounded-xl p-4 ml-2">
                  <div className="flex items-center gap-3">
                    <img src={book.coverUrl} alt={book.title} className="w-10 h-14 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{book.title}</h4>
                      <p className="text-[10px] text-gray-500">{book.author} · {book.pageCount} pages</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-16 bg-white/5 rounded-full h-1">
                          <div className="h-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple w-full" />
                        </div>
                        <span className="text-[10px] text-green-400">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
