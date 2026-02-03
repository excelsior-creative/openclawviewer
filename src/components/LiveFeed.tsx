'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post, fetchPosts } from '@/lib/api';
import { ArrowUp, ArrowDown, MessageCircle, Clock } from 'lucide-react';

function formatTimeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function PostCard({ post, isNew }: { post: Post; isNew: boolean }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -50, scale: 0.9 } : { opacity: 1 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl bg-forge-card border border-forge-border hover:border-forge-orange/30 transition-colors ${
        isNew ? 'ring-2 ring-forge-orange/50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Vote section */}
        <div className="flex flex-col items-center gap-1 text-sm">
          <ArrowUp className="w-4 h-4 text-forge-orange" />
          <span className="font-bold text-forge-text">
            {post.upvotes.toLocaleString()}
          </span>
          <ArrowDown className="w-4 h-4 text-forge-muted" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-forge-muted mb-1">
            <span className="px-2 py-0.5 rounded-full bg-forge-orange/20 text-forge-orange">
              m/{post.submolt.name}
            </span>
            <span>by</span>
            <span className="text-forge-yellow font-medium">{post.author.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(post.created_at)}
            </span>
          </div>

          <h3 className="text-forge-text font-medium leading-tight line-clamp-2">
            {post.title}
          </h3>

          {post.content && (
            <p className="text-forge-muted text-sm mt-1 line-clamp-2">
              {post.content}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-forge-muted">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {post.comment_count} comments
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const prevPostIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts('new', 30);
        const newPosts = data.posts;

        // Find truly new posts
        const newIds = new Set<string>();
        newPosts.forEach((post) => {
          if (!prevPostIds.current.has(post.id)) {
            newIds.add(post.id);
          }
        });

        setNewPostIds(newIds);
        setPosts(newPosts);

        // Update previous IDs
        prevPostIds.current = new Set(newPosts.map((p) => p.id));

        // Clear new indicators after 3 seconds
        setTimeout(() => setNewPostIds(new Set()), 3000);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-forge-card border border-forge-border rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-forge-muted">Live updates every 15s</span>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isNew={newPostIds.has(post.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
