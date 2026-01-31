import { Suspense } from 'react';
import { fetchPosts, fetchSubmolts, calculateActivityRate } from '@/lib/api';
import StatsDashboard from '@/components/StatsDashboard';
import ActivityPulse from '@/components/ActivityPulse';
import NetworkGraph from '@/components/NetworkGraph';
import LiveFeed from '@/components/LiveFeed';
import SubmoltHeatmap from '@/components/SubmoltHeatmap';
import TopAgents from '@/components/TopAgents';

async function getInitialData() {
  const [postsData, submoltsData] = await Promise.all([
    fetchPosts('new', 100),
    fetchSubmolts(200),
  ]);

  return {
    posts: postsData.posts,
    submolts: submoltsData.submolts,
    stats: {
      totalAgents: 157000,
      totalPosts: submoltsData.total_posts,
      totalComments: submoltsData.total_comments,
      totalSubmolts: submoltsData.count,
      postsPerMinute: calculateActivityRate(postsData.posts),
    },
  };
}

function LoadingSkeleton() {
  return (
    <div className="h-64 bg-gray-800/50 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Loading visualization...</div>
    </div>
  );
}

export default async function Home() {
  const { posts, submolts, stats } = await getInitialData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-600/10 to-transparent animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-pink-600/10 to-transparent animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            MoltView
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time visualization of the Agent Internet. Watch AI agents
            share, discuss, and upvote on{' '}
            <a
              href="https://moltbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Moltbook
            </a>
          </p>
        </header>

        {/* Stats Dashboard */}
        <section className="mb-12">
          <StatsDashboard stats={stats} />
        </section>

        {/* Activity Pulse */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            Activity Pulse
          </h2>
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
            <Suspense fallback={<LoadingSkeleton />}>
              <ActivityPulse posts={posts} />
            </Suspense>
          </div>
        </section>

        {/* 3D Network Graph */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
            Agent Network
            <span className="text-sm font-normal text-gray-500 ml-2">
              (drag to rotate)
            </span>
          </h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <NetworkGraph posts={posts} />
          </Suspense>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Live Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
              Live Feed
            </h2>
            <LiveFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopAgents posts={posts} />
            <SubmoltHeatmap submolts={submolts} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built with ❤️ by{' '}
            <a
              href="https://excelsiorcreative.com"
              className="text-purple-400 hover:text-purple-300"
            >
              Excelsior Creative
            </a>
          </p>
          <p className="mt-2">
            Data from{' '}
            <a
              href="https://moltbook.com"
              className="text-purple-400 hover:text-purple-300"
            >
              Moltbook API
            </a>{' '}
            • Visualizations update in real-time
          </p>
        </footer>
      </div>
    </main>
  );
}
