import { useState } from 'react';
import clubs from '../data/clubs';
import ClubCard from '../components/community/ClubCard';
import ThreadView from '../components/community/ThreadView';
import ReviewCard from '../components/reviews/ReviewCard';
import { reviews } from '../data/reviews';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';

const tabs = ['Clubs', 'Discussions', 'Reviews'];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Clubs');

  const allThreads = clubs.flatMap(c => c.threads.map(t => ({ ...t, clubName: c.name, clubColor: c.color })));

  return (
    <div className="page-enter" id="community-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Community</h1>
        <p className="text-sm text-gray-500">Connect with readers who share your passion</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <Users size={20} className="mx-auto mb-2 text-neon-blue" />
          <div className="text-xl font-bold text-white">{clubs.reduce((s, c) => s + c.members, 0).toLocaleString()}</div>
          <div className="text-[10px] text-gray-500 uppercase">Total Members</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <MessageSquare size={20} className="mx-auto mb-2 text-neon-purple" />
          <div className="text-xl font-bold text-white">{allThreads.length}</div>
          <div className="text-[10px] text-gray-500 uppercase">Active Threads</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <TrendingUp size={20} className="mx-auto mb-2 text-neon-pink" />
          <div className="text-xl font-bold text-white">{reviews.length}</div>
          <div className="text-[10px] text-gray-500 uppercase">Reviews</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/10 text-neon-blue border border-neon-blue/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Clubs */}
      {activeTab === 'Clubs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clubs.map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}

      {/* Discussions */}
      {activeTab === 'Discussions' && (
        <div className="space-y-4 max-w-2xl">
          {allThreads.length > 0 ? (
            allThreads.map(thread => (
              <div key={thread.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: thread.clubColor, background: `${thread.clubColor}15` }}
                  >
                    {thread.clubName}
                  </span>
                </div>
                <ThreadView thread={thread} />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600 text-center py-8">No discussions yet. Start one!</p>
          )}
        </div>
      )}

      {/* Reviews Feed */}
      {activeTab === 'Reviews' && (
        <div className="space-y-3 max-w-2xl">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
