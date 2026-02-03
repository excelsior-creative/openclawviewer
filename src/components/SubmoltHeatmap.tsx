'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Submolt } from '@/lib/api';

interface SubmoltHeatmapProps {
  submolts: Submolt[];
}

function getHeatColor(activity: number, max: number): string {
  const ratio = Math.min(activity / max, 1);
  
  if (ratio < 0.2) return 'bg-amber-900/40';
  if (ratio < 0.4) return 'bg-amber-700/50';
  if (ratio < 0.6) return 'bg-orange-600/60';
  if (ratio < 0.8) return 'bg-orange-500/70';
  return 'bg-yellow-500/80';
}

function SubmoltTile({ submolt, maxSubs }: { submolt: Submolt; maxSubs: number }) {
  const size = Math.max(Math.min(Math.log(submolt.subscriber_count + 1) * 15, 80), 40);
  const heatColor = getHeatColor(submolt.subscriber_count, maxSubs);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`${heatColor} rounded-lg p-2 cursor-pointer backdrop-blur-sm border border-white/10 transition-colors hover:border-forge-orange/50`}
      style={{
        width: size,
        height: size,
        minWidth: 40,
        minHeight: 40,
      }}
      title={`${submolt.display_name}: ${submolt.subscriber_count} subscribers`}
    >
      <div className="w-full h-full flex flex-col justify-center items-center overflow-hidden">
        <span className="text-[10px] text-white/90 font-medium text-center leading-tight line-clamp-2">
          {submolt.name.length > 8
            ? submolt.name.slice(0, 8)
            : submolt.name}
        </span>
        {size > 50 && (
          <span className="text-[9px] text-white/60 mt-0.5">
            {submolt.subscriber_count}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function SubmoltHeatmap({ submolts }: SubmoltHeatmapProps) {
  const sortedSubmolts = useMemo(
    () =>
      [...submolts]
        .sort((a, b) => b.subscriber_count - a.subscriber_count)
        .slice(0, 60),
    [submolts]
  );

  const maxSubs = sortedSubmolts[0]?.subscriber_count || 1;

  return (
    <div className="p-4 bg-forge-card rounded-xl border border-forge-border">
      <h3 className="text-forge-text font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-forge-orange rounded-full animate-pulse" />
        Community Heatmap
      </h3>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {sortedSubmolts.map((submolt, i) => (
          <motion.div
            key={submolt.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
          >
            <SubmoltTile submolt={submolt} maxSubs={maxSubs} />
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-forge-muted">
        <span>Low activity</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-amber-900/40" />
          <div className="w-4 h-4 rounded bg-amber-700/50" />
          <div className="w-4 h-4 rounded bg-orange-600/60" />
          <div className="w-4 h-4 rounded bg-orange-500/70" />
          <div className="w-4 h-4 rounded bg-yellow-500/80" />
        </div>
        <span>High activity</span>
      </div>
    </div>
  );
}
