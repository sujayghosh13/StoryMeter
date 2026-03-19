const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Fetches books from the Google Books API.
 * @param {string} query - Search query (title, author, genre, etc.)
 * @param {object} options - Optional filters
 * @param {number} options.maxResults - Max results (default 20, max 40)
 * @param {number} options.startIndex - Pagination offset
 * @param {string} options.orderBy - 'relevance' or 'newest'
 * @param {string} options.filter - 'partial', 'full', 'free-ebooks', 'paid-ebooks', 'ebooks'
 * @returns {Promise<{books: Array, totalItems: number}>}
 */
export async function searchGoogleBooks(query, options = {}) {
  if (!query || !query.trim()) return { books: [], totalItems: 0 };

  const params = new URLSearchParams({
    q: query.trim(),
    maxResults: String(options.maxResults || 20),
    startIndex: String(options.startIndex || 0),
    orderBy: options.orderBy || 'relevance',
    printType: 'books',
    langRestrict: 'en',
  });

  if (options.filter) params.set('filter', options.filter);

  const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch from Google Books API');

  const data = await response.json();
  const books = (data.items || []).map(normalizeGoogleBook);

  return {
    books,
    totalItems: data.totalItems || 0,
  };
}

/**
 * Fetches a single book by Google Books volume ID.
 */
export async function getGoogleBook(volumeId) {
  const response = await fetch(`${GOOGLE_BOOKS_API}/${volumeId}`);
  if (!response.ok) throw new Error('Failed to fetch book details');
  const data = await response.json();
  return normalizeGoogleBook(data);
}

/**
 * Fetches multiple books by Google Books volume IDs.
 */
export async function getGoogleBooks(volumeIds) {
  if (!volumeIds || volumeIds.length === 0) return [];
  const promises = volumeIds.map(id => getGoogleBook(id).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

/**
 * Search by category/genre keyword
 */
export async function searchByGenre(genre, maxResults = 12) {
  return searchGoogleBooks(`subject:${genre}`, { maxResults, orderBy: 'relevance' });
}

/**
 * Search trending / popular books
 */
export async function fetchTrendingBooks() {
  return searchGoogleBooks('bestseller 2025', { maxResults: 10, orderBy: 'relevance' });
}

/**
 * Search by mood keywords
 */
const MOOD_KEYWORDS = {
  Happy: 'feel good uplifting fiction',
  Sad: 'emotional heartbreaking literary fiction',
  Dark: 'dark gothic suspense fiction',
  Romantic: 'romance love story fiction',
  Thriller: 'thriller suspense mystery fiction',
};

export async function searchByMood(mood, maxResults = 12) {
  const keywords = MOOD_KEYWORDS[mood] || mood;
  return searchGoogleBooks(keywords, { maxResults });
}

/**
 * Normalizes a Google Books API response item into our book format.
 */
function normalizeGoogleBook(item) {
  const info = item.volumeInfo || {};
  const images = info.imageLinks || {};

  // Generate a pseudo-score based on ratings if available
  const avgRating = info.averageRating || 0;
  const ratingsCount = info.ratingsCount || 0;
  const score = avgRating > 0
    ? Math.round(avgRating * 20)
    : Math.floor(Math.random() * 20 + 70); // Random 70-90 if no rating data

  // Map categories to our genre list
  const categories = info.categories || [];
  const genre = mapGenre(categories);

  // Map to moods based on genre/categories
  const moods = mapMoods(categories, genre);

  // Generate vibe data from available metadata
  const vibeData = generateVibeData(info, score);

  // Best available cover image
  const coverUrl = images.extraLarge
    || images.large
    || images.medium
    || images.thumbnail
    || images.smallThumbnail
    || '';

  // Make cover URL use HTTPS
  const secureCoverUrl = coverUrl.replace('http://', 'https://');

  return {
    id: item.id, // Google Books volume ID (string)
    googleBooksId: item.id,
    title: info.title || 'Unknown Title',
    author: (info.authors || ['Unknown Author']).join(', '),
    genre,
    description: info.description || info.subtitle || 'No description available.',
    coverUrl: secureCoverUrl,
    storyMeterScore: score,
    pageCount: info.pageCount || 0,
    publishYear: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : null,
    moods,
    vibeData,
    quotes: [], // Google Books doesn't provide quotes
    purchaseLinks: {
      amazon: `https://www.amazon.com/s?k=${encodeURIComponent(info.title || '')}`,
      kindle: `https://www.amazon.com/s?k=${encodeURIComponent(info.title || '')}&i=digital-text`,
    },
    trending: false,
    // Additional Google Books data
    isbn: getISBN(info.industryIdentifiers),
    previewLink: info.previewLink || '',
    infoLink: info.infoLink || '',
    language: info.language || 'en',
    publisher: info.publisher || '',
    averageRating: avgRating,
    ratingsCount,
    isFromApi: true,
  };
}

function mapGenre(categories) {
  if (!categories.length) return 'Literary Fiction';

  const cats = categories.join(' ').toLowerCase();
  if (cats.includes('fantasy') || cats.includes('magic')) return 'Fantasy';
  if (cats.includes('science fiction') || cats.includes('sci-fi')) return 'Sci-Fi';
  if (cats.includes('romance') || cats.includes('love')) return 'Romance';
  if (cats.includes('thriller') || cats.includes('mystery') || cats.includes('suspense')) return 'Thriller';
  if (cats.includes('horror')) return 'Horror';
  if (cats.includes('fiction')) return 'Literary Fiction';
  return 'Literary Fiction';
}

function mapMoods(categories, genre) {
  const moods = [];
  const cats = categories.join(' ').toLowerCase();

  if (genre === 'Romance' || cats.includes('romance')) moods.push('Romantic');
  if (genre === 'Thriller' || cats.includes('thriller') || cats.includes('suspense')) moods.push('Thriller');
  if (genre === 'Horror' || cats.includes('dark') || cats.includes('gothic')) moods.push('Dark');
  if (cats.includes('humor') || cats.includes('comedy') || cats.includes('uplifting')) moods.push('Happy');
  if (cats.includes('drama') || cats.includes('emotional') || cats.includes('tragic')) moods.push('Sad');

  if (moods.length === 0) {
    // Assign default moods based on genre
    const defaults = {
      Fantasy: ['Happy', 'Dark'],
      'Sci-Fi': ['Thriller'],
      Romance: ['Romantic'],
      Thriller: ['Thriller', 'Dark'],
      Horror: ['Dark'],
      'Literary Fiction': ['Sad', 'Happy'],
    };
    return defaults[genre] || ['Happy'];
  }
  return moods;
}

function generateVibeData(info, score) {
  const base = Math.max(60, Math.min(95, score));
  const variance = () => Math.floor(Math.random() * 20 - 10);

  return {
    emotion: Math.max(40, Math.min(100, base + variance())),
    plotDepth: Math.max(40, Math.min(100, base + variance())),
    characterDev: Math.max(40, Math.min(100, base + variance())),
    pacing: Math.max(40, Math.min(100, base + variance())),
    writingStyle: Math.max(40, Math.min(100, base + variance())),
  };
}

function getISBN(identifiers) {
  if (!identifiers) return null;
  const isbn13 = identifiers.find(i => i.type === 'ISBN_13');
  const isbn10 = identifiers.find(i => i.type === 'ISBN_10');
  return isbn13?.identifier || isbn10?.identifier || null;
}

export default {
  searchGoogleBooks,
  getGoogleBook,
  getGoogleBooks,
  searchByGenre,
  searchByMood,
  fetchTrendingBooks,
};
