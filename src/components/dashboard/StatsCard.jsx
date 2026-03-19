export default function StatsCard({ icon, value, label, color = '#00d4ff', suffix = '' }) {
  return (
    <div className="glass rounded-2xl p-5 card-hover">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}15`, border: `1px solid ${color}33` }}
        >
          {icon}
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">
        {value}{suffix}
      </div>
    </div>
  );
}
