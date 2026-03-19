import { moods } from '../../data/books';
import { useApp } from '../../context/AppContext';

export default function MoodSelector() {
  const { selectedMood, setSelectedMood } = useApp();

  return (
    <section className="mb-8" id="mood-selector">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">How are you feeling?</h2>
          <p className="text-xs text-gray-500">Pick your mood, get the perfect book</p>
        </div>
        {selectedMood && (
          <button
            onClick={() => setSelectedMood(null)}
            className="text-xs text-gray-400 hover:text-neon-blue transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {moods.map(mood => {
          const isActive = selectedMood === mood.name;
          return (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(isActive ? null : mood.name)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-300 flex items-center gap-2
                ${isActive
                  ? 'scale-105 shadow-lg'
                  : 'glass hover:bg-white/10'
                }
              `}
              style={isActive ? {
                background: `linear-gradient(135deg, ${mood.color}33, ${mood.color}11)`,
                border: `1px solid ${mood.color}66`,
                color: mood.color,
                boxShadow: `0 0 20px ${mood.color}33`,
              } : { color: '#94a3b8' }}
              id={`mood-${mood.name.toLowerCase()}`}
            >
              <span className="text-lg">{mood.emoji}</span>
              {mood.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
