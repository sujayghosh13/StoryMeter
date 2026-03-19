import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Start with empty arrays since book IDs are now Google Books string IDs
  const [library, setLibrary] = useState({
    wantToRead: [],
    currentlyReading: [],
    completed: [],
  });

  const [userRatings, setUserRatings] = useState({});
  const [likedReviews, setLikedReviews] = useState(new Set());
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist library to localStorage for demo purposes, so it doesn't clear on reload
  useEffect(() => {
    const saved = localStorage.getItem('storymeter_library');
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse library', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('storymeter_library', JSON.stringify(library));
  }, [library]);

  const getBookStatus = useCallback((bookId) => {
    if (library.completed.includes(bookId)) return 'completed';
    if (library.currentlyReading.includes(bookId)) return 'reading';
    if (library.wantToRead.includes(bookId)) return 'want';
    return null;
  }, [library]);

  const setBookStatus = useCallback((bookId, status) => {
    setLibrary(prev => {
      const newLib = {
        wantToRead: prev.wantToRead.filter(id => id !== bookId),
        currentlyReading: prev.currentlyReading.filter(id => id !== bookId),
        completed: prev.completed.filter(id => id !== bookId),
      };
      if (status === 'want') newLib.wantToRead.push(bookId);
      else if (status === 'reading') newLib.currentlyReading.push(bookId);
      else if (status === 'completed') newLib.completed.push(bookId);
      return newLib;
    });
  }, []);

  const rateBook = useCallback((bookId, rating) => {
    setUserRatings(prev => ({ ...prev, [bookId]: rating }));
  }, []);

  const toggleLikeReview = useCallback((reviewId) => {
    setLikedReviews(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  }, []);

  const value = {
    library,
    userRatings,
    likedReviews,
    selectedMood,
    searchQuery,
    getBookStatus,
    setBookStatus,
    rateBook,
    toggleLikeReview,
    setSelectedMood,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
