import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jul', books: 3 },
  { month: 'Aug', books: 5 },
  { month: 'Sep', books: 4 },
  { month: 'Oct', books: 6 },
  { month: 'Nov', books: 3 },
  { month: 'Dec', books: 7 },
  { month: 'Jan', books: 4 },
  { month: 'Feb', books: 5 },
  { month: 'Mar', books: 8 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs">
        <p className="text-gray-400">{label}</p>
        <p className="text-neon-blue font-bold">{payload[0].value} books</p>
      </div>
    );
  }
  return null;
};

export default function ReadingChart() {
  return (
    <div className="glass rounded-2xl p-5" id="reading-chart">
      <h3 className="text-sm font-semibold text-white mb-4">📊 Reading Activity</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="books" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
