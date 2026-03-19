import { useApp } from '../context/AppContext';
import HeroBanner from '../components/explore/HeroBanner';
import MoodSelector from '../components/explore/MoodSelector';
import BookGrid from '../components/books/BookGrid';
import { useBooks, useMoodBooks } from '../hooks/useBooks';
import { Loader2 } from 'lucide-react';

export default function ExplorePage() {
  const { selectedMood } = useApp();
  const { trending, topRated, newReleases, fantasyPicks, scifiPicks, romancePicks, thrillerPicks, loading } = useBooks();
  const { books: moodBooks, loading: moodLoading } = useMoodBooks(selectedMood);

  const displayBooks = selectedMood ? moodBooks : null;

  if (loading) {
    return (
      <div className="page-enter flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 size={28} className="animate-spin text-neon-blue" />
        <p className="text-sm text-gray-500">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="page-enter" id="explore-page">
      <HeroBanner books={trending} />
      <MoodSelector />

      {selectedMood && (
        <div className="mb-6 px-4 py-3 rounded-xl glass border border-neon-blue/20">
          <p className="text-sm text-gray-300">
            🎯 Showing books for <span className="text-neon-blue font-semibold">{selectedMood}</span> mood
            {!moodLoading && <span className="text-gray-500"> · {moodBooks.length} books found</span>}
            {moodLoading && <span className="text-gray-500"> · searching...</span>}
          </p>
        </div>
      )}

      {selectedMood && moodLoading && (
        <div className="flex items-center justify-center py-16 glass rounded-2xl mb-8">
          <Loader2 size={20} className="animate-spin text-neon-blue mr-2" />
          <span className="text-sm text-gray-400">Finding {selectedMood.toLowerCase()} reads...</span>
        </div>
      )}

      {selectedMood && !moodLoading && displayBooks?.length > 0 && (
        <BookGrid
          books={displayBooks}
          title={`${selectedMood} Reads`}
          subtitle={`Books that match your ${selectedMood.toLowerCase()} mood`}
        />
      )}

      {!selectedMood && (
        <>
          {trending.length > 0 && (
            <BookGrid
              books={trending}
              title="🔥 Trending Reads"
              subtitle="What everyone's talking about"
            />
          )}

          <BookGrid
            books={topRated}
            title="⭐ Highest Rated"
            subtitle="Reader favorites with top StoryMeter scores"
          />

          <BookGrid
            books={newReleases}
            title="🆕 Recent Releases"
            subtitle="Fresh stories waiting to be explored"
          />

          {fantasyPicks.length > 0 && (
            <BookGrid
              books={fantasyPicks}
              title="✨ Fantasy Picks"
              subtitle="Magical worlds and epic adventures"
            />
          )}

          {scifiPicks.length > 0 && (
            <BookGrid
              books={scifiPicks}
              title="🚀 Sci-Fi Corner"
              subtitle="Science, space, and the future"
            />
          )}

          {romancePicks.length > 0 && (
            <BookGrid
              books={romancePicks}
              title="💕 Romance"
              subtitle="Love stories that make your heart flutter"
            />
          )}

          {thrillerPicks.length > 0 && (
            <BookGrid
              books={thrillerPicks}
              title="🔪 Thrillers"
              subtitle="Edge-of-your-seat suspense"
            />
          )}
        </>
      )}

      {/* Tagline */}
      <div className="text-center py-12 mb-8">
        <p className="text-2xl font-bold gradient-text mb-2">Don't just rate it. Feel it.</p>
        <p className="text-sm text-gray-500">Where stories meet emotions.</p>
      </div>
    </div>
  );
}
