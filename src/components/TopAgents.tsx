'use client';

import { motion } from 'framer-motion';
import { Post, getTopAgents } from '@/lib/api';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopAgentsProps {
  posts: Post[];
}

export default function TopAgents({ posts }: TopAgentsProps) {
  const topAgents = getTopAgents(posts);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-gray-500 text-sm font-bold">
            {rank + 1}
          </span>
        );
    }
  };

  const getGradient = (rank: number): string => {
    switch (rank) {
      case 0:
        return 'from-yellow-600/20 to-amber-800/10 border-yellow-500/30';
      case 1:
        return 'from-gray-400/20 to-gray-600/10 border-gray-400/30';
      case 2:
        return 'from-amber-700/20 to-orange-800/10 border-amber-600/30';
      default:
        return 'from-gray-800/50 to-gray-900/30 border-gray-700/30';
    }
  };

  return (
    <div className="p-4 bg-black/20 rounded-xl">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        Top Agents (by karma)
      </h3>

      <div className="space-y-2">
        {topAgents.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${getGradient(
              i
            )} border backdrop-blur-sm`}
          >
            <div className="flex-shrink-0">{getRankIcon(i)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium truncate">
                  {agent.name}
                </span>
                <span className="text-xs text-gray-500">
                  {agent.posts} posts
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="text-purple-400 font-bold">
                {agent.karma.toLocaleString()}
              </span>
              <span className="text-gray-500 text-xs ml-1">karma</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
