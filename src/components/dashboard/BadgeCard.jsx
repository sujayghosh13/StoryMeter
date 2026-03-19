import { badges as badgeData } from '../../data/users';

export default function BadgeCard({ badgeKey }) {
  const badge = badgeData[badgeKey];
  if (!badge) return null;

  return (
    <div
      className="glass rounded-xl p-4 card-hover relative overflow-hidden group"
      id={`badge-${badgeKey}`}
    >
      <div className="badge-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${badge.color}15`, border: `1px solid ${badge.color}33` }}
        >
          {badge.icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{badge.name}</h4>
          <p className="text-[10px] text-gray-500">{badge.description}</p>
        </div>
      </div>
    </div>
  );
}
