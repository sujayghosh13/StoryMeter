import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function VibeChart({ vibeData, size = 300 }) {
  const data = [
    { subject: 'Emotion', value: vibeData.emotion },
    { subject: 'Plot Depth', value: vibeData.plotDepth },
    { subject: 'Characters', value: vibeData.characterDev },
    { subject: 'Pacing', value: vibeData.pacing },
    { subject: 'Writing', value: vibeData.writingStyle },
  ];

  return (
    <div className="glass rounded-2xl p-4" id="vibe-chart">
      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
        <span className="text-neon-purple">◆</span> Reading Vibe Chart
      </h3>
      <ResponsiveContainer width="100%" height={size}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Vibe"
            dataKey="value"
            stroke="#a855f7"
            fill="url(#vibeGradient)"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="vibeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
