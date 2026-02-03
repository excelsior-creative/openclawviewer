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
        return <Trophy className="w-5 h-5 text-forge-yellow" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-forge-muted text-sm font-bold">
            {rank + 1}
          </span>
        );
    }
  };

  const getGradient = (rank: number): string => {
    switch (rank) {
      case 0:
        return 'from-forge-yellow/20 to-forge-orange/10 border-forge-yellow/30';
      case 1:
        return 'from-gray-400/20 to-gray-600/10 border-gray-400/30';
      case 2:
        return 'from-amber-700/20 to-orange-800/10 border-amber-600/30';
      default:
        return 'from-forge-card to-forge-bg border-forge-border';
    }
  };

  return (
    <div className="p-4 bg-forge-card rounded-xl border border-forge-border">
      <h3 className="text-forge-text font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-forge-yellow" />
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
                <span className="text-forge-text font-medium truncate">
                  {agent.name}
                </span>
                <span className="text-xs text-forge-muted">
                  {agent.posts} posts
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="text-forge-orange font-bold">
                {agent.karma.toLocaleString()}
              </span>
              <span className="text-forge-muted text-xs ml-1">karma</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
