import { Suspense } from 'react';
import { fetchPosts, fetchSubmolts, calculateActivityRate } from '@/lib/api';
import StatsDashboard from '@/components/StatsDashboard';
import ActivityPulse from '@/components/ActivityPulse';
import NetworkGraph from '@/components/NetworkGraph';
import LiveFeed from '@/components/LiveFeed';
import SubmoltHeatmap from '@/components/SubmoltHeatmap';
import TopAgents from '@/components/TopAgents';

async function getInitialData() {
  try {
    const [postsData, submoltsData] = await Promise.all([
      fetchPosts('new', 100),
      fetchSubmolts(200),
    ]);

    const posts = postsData?.posts || [];
    const submolts = submoltsData?.submolts || [];

    return {
      posts,
      submolts,
      stats: {
        totalAgents: 1500000,
        totalPosts: submoltsData?.total_posts || 0,
        totalComments: submoltsData?.total_comments || 0,
        totalSubmolts: submoltsData?.count || 0,
        postsPerMinute: calculateActivityRate(posts),
      },
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      posts: [],
      submolts: [],
      stats: {
        totalAgents: 1500000,
        totalPosts: 0,
        totalComments: 0,
        totalSubmolts: 0,
        postsPerMinute: 0,
      },
    };
  }
}

function LoadingSkeleton() {
  return (
    <div className="h-64 bg-forge-card border border-forge-border rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-forge-muted">Loading visualization...</div>
    </div>
  );
}

export default async function Home() {
  const { posts, submolts, stats } = await getInitialData();

  return (
    <main className="min-h-screen bg-forge-bg bg-grid-pattern">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-forge-orange/10 to-transparent animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-forge-yellow/10 to-transparent animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          {/* Forge AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-card border border-forge-orange/30 text-forge-orange text-sm font-medium mb-6">
            <span className="text-lg">🔥</span>
            <span>Forge AI Labs</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #f97316 70%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              OpenClaw Viewer
            </span>
          </h1>
          <p className="text-forge-muted text-lg max-w-2xl mx-auto">
            Real-time visualization of the Agent Internet. Watch AI agents
            share, discuss, and upvote on{' '}
            <a
              href="https://moltbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forge-orange hover:text-forge-yellow underline transition-colors"
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
          <h2 className="text-2xl font-bold text-forge-text mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            Activity Pulse
          </h2>
          <div className="bg-forge-card rounded-xl p-6 backdrop-blur-sm border border-forge-border">
            <Suspense fallback={<LoadingSkeleton />}>
              <ActivityPulse posts={posts} />
            </Suspense>
          </div>
        </section>

        {/* 3D Network Graph */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-forge-text mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-forge-orange rounded-full animate-pulse" />
            Agent Network
            <span className="text-sm font-normal text-forge-muted ml-2">
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
            <h2 className="text-2xl font-bold text-forge-text mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-forge-yellow rounded-full animate-pulse" />
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
      </div>
    </main>
  );
}
