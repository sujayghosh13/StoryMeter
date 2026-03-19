import { useState, useEffect, useCallback, useMemo } from 'react';
import { searchGoogleBooks, getGoogleBook, searchByGenre, searchByMood } from '../services/googleBooks';

// Cache to avoid re-fetching the same queries
const queryCache = new Map();

async function cachedFetch(key, fetcher) {
  if (queryCache.has(key)) return queryCache.get(key);
  const result = await fetcher();
  queryCache.set(key, result);
  return result;
}

/**
 * Primary hook for loading books from Google Books API.
 * Used by ExplorePage, GenresPage, etc.
 */
export function useBooks() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [fantasyPicks, setFantasyPicks] = useState([]);
  const [scifiPicks, setScifiPicks] = useState([]);
  const [romancePicks, setRomancePicks] = useState([]);
  const [thrillerPicks, setThrillerPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      try {
        const [trendingRes, topRes, newRes, fantasyRes, scifiRes, romanceRes, thrillerRes] = await Promise.all([
          cachedFetch('trending', () => searchGoogleBooks('bestseller fiction 2024', { maxResults: 8 })),
          cachedFetch('top-rated', () => searchGoogleBooks('highest rated fiction books', { maxResults: 8 })),
          cachedFetch('new-releases', () => searchGoogleBooks('new fiction books 2025', { maxResults: 8, orderBy: 'newest' })),
          cachedFetch('genre-fantasy', () => searchByGenre('fantasy fiction', 8)),
          cachedFetch('genre-scifi', () => searchByGenre('science fiction', 8)),
          cachedFetch('genre-romance', () => searchByGenre('romance fiction', 8)),
          cachedFetch('genre-thriller', () => searchByGenre('thriller mystery', 8)),
        ]);

        if (cancelled) return;

        // Mark trending books
        const trendingBooks = trendingRes.books.map(b => ({ ...b, trending: true }));
        setTrending(trendingBooks);
        setTopRated(topRes.books);
        setNewReleases(newRes.books);
        setFantasyPicks(fantasyRes.books);
        setScifiPicks(scifiRes.books);
        setRomancePicks(romanceRes.books);
        setThrillerPicks(thrillerRes.books);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);

  // Combine all books for search/filtering (deduped)
  const allBooks = useMemo(() => {
    const seen = new Set();
    const all = [];
    [trending, topRated, newReleases, fantasyPicks, scifiPicks, romancePicks, thrillerPicks].forEach(list => {
      list.forEach(book => {
        if (!seen.has(book.id)) {
          seen.add(book.id);
          all.push(book);
        }
      });
    });
    return all;
  }, [trending, topRated, newReleases, fantasyPicks, scifiPicks, romancePicks, thrillerPicks]);

  return {
    trending,
    topRated,
    newReleases,
    fantasyPicks,
    scifiPicks,
    romancePicks,
    thrillerPicks,
    allBooks,
    loading,
  };
}

/**
 * Hook for mood-based book search
 */
export function useMoodBooks(mood) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mood) { setBooks([]); return; }

    let cancelled = false;
    setLoading(true);

    cachedFetch(`mood-${mood}`, () => searchByMood(mood, 12))
      .then(res => { if (!cancelled) setBooks(res.books); })
      .catch(() => { if (!cancelled) setBooks([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [mood]);

  return { books, loading };
}

/**
 * Hook for single book detail
 */
export function useBookDetail(bookId) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    cachedFetch(`book-${bookId}`, () => getGoogleBook(bookId))
      .then(b => { if (!cancelled) setBook(b); })
      .catch(err => { if (!cancelled) setError('Book not found'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [bookId]);

  return { book, loading, error };
}

/**
 * Hook for genre-specific book loading
 */
export function useGenreBooks(genre) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!genre) return;

    let cancelled = false;
    setLoading(true);

    cachedFetch(`genre-detail-${genre}`, () => searchByGenre(genre, 20))
      .then(res => { if (!cancelled) setBooks(res.books); })
      .catch(() => { if (!cancelled) setBooks([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [genre]);

  return { books, loading };
}

/**
 * Hook for search with API
 */
export function useSearch(query, options = {}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const search = useCallback(async (q, opts = {}) => {
    if (!q || q.trim().length < 2) {
      setBooks([]);
      setTotalItems(0);
      return;
    }
    setLoading(true);
    try {
      const result = await searchGoogleBooks(q, { maxResults: 24, ...opts });
      setBooks(result.books);
      setTotalItems(result.totalItems);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search with debounce
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setBooks([]);
      setTotalItems(0);
      return;
    }
    const timer = setTimeout(() => search(query, options), 400);
    return () => clearTimeout(timer);
  }, [query, search]);

  return { books, loading, totalItems };
}

/**
 * Hook to get recommended books based on genre/mood
 */
export function useRecommendations(genre, mood) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!genre && !mood) { setBooks([]); setLoading(false); return; }

    let cancelled = false;
    setLoading(true);

    const query = mood
      ? `${mood.toLowerCase()} ${genre?.toLowerCase() || ''} fiction`
      : `${genre?.toLowerCase()} fiction`;

    cachedFetch(`recommend-${query}`, () => searchGoogleBooks(query, { maxResults: 4 }))
      .then(res => { if (!cancelled) setBooks(res.books); })
      .catch(() => { if (!cancelled) setBooks([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [genre, mood]);

  return { books, loading };
}

/**
 * Hook to fetch multiple specific books by ID (for Library)
 */
export async function fetchLibraryBooks(ids) {
  if (!ids || ids.length === 0) return [];
  
  // Sort IDs so caching works regardless of order
  const cacheKey = `library-${[...ids].sort().join(',')}`;
  
  return cachedFetch(cacheKey, async () => {
    // Dynamically import getGoogleBooks to avoid circular deps if they ever exist
    const { getGoogleBooks } = await import('../services/googleBooks');
    return getGoogleBooks(ids);
  });
}

export function useLibraryBooks(ids) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setBooks([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchLibraryBooks(ids)
      .then(res => { if (!cancelled) setBooks(res); })
      .catch(() => { if (!cancelled) setBooks([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [ids.join(',')]);

  return { books, loading };
}
