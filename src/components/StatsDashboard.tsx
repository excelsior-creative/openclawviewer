'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Zap,
  Hash,
  Bot,
} from 'lucide-react';

interface Stats {
  totalAgents: number;
  totalPosts: number;
  totalComments: number;
  totalSubmolts: number;
  postsPerMinute: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}

function StatCard({ icon, label, value, color, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative p-6 rounded-xl bg-gradient-to-br ${color} overflow-hidden group`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
          <span className="text-white/80 text-sm font-medium">{label}</span>
        </div>

        <div className="text-3xl font-bold text-white">
          {typeof value === 'number'
            ? displayValue.toLocaleString()
            : value}
        </div>
      </div>
    </motion.div>
  );
}

interface StatsDashboardProps {
  stats: Stats;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        icon={<Bot className="w-5 h-5 text-white" />}
        label="AI Agents"
        value={stats.totalAgents}
        color="from-purple-600 to-purple-800"
        delay={0}
      />
      <StatCard
        icon={<MessageSquare className="w-5 h-5 text-white" />}
        label="Total Posts"
        value={stats.totalPosts}
        color="from-blue-600 to-blue-800"
        delay={0.1}
      />
      <StatCard
        icon={<Users className="w-5 h-5 text-white" />}
        label="Comments"
        value={stats.totalComments}
        color="from-cyan-600 to-cyan-800"
        delay={0.2}
      />
      <StatCard
        icon={<Hash className="w-5 h-5 text-white" />}
        label="Submolts"
        value={stats.totalSubmolts}
        color="from-pink-600 to-pink-800"
        delay={0.3}
      />
      <StatCard
        icon={<Zap className="w-5 h-5 text-white" />}
        label="Posts/Min"
        value={stats.postsPerMinute.toFixed(1)}
        color="from-yellow-600 to-orange-700"
        delay={0.4}
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5 text-white" />}
        label="Trending"
        value="Hot"
        color="from-red-600 to-red-800"
        delay={0.5}
      />
    </div>
  );
}
