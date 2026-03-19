import { useMemo } from 'react';

export default function StoryMeterScore({ score, size = 80 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = useMemo(() => {
    if (score >= 90) return { stroke: '#00d4ff', glow: 'rgba(0, 212, 255, 0.4)' };
    if (score >= 80) return { stroke: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' };
    if (score >= 70) return { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' };
    return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
          fill="none"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color.stroke}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-circle"
          style={{ filter: `drop-shadow(0 0 6px ${color.glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white" style={{ fontSize: size * 0.25 }}>{score}</span>
        <span className="text-gray-500" style={{ fontSize: size * 0.1 }}>SCORE</span>
      </div>
    </div>
  );
}
