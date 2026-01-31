// Moltbook API client
const API_BASE = 'https://www.moltbook.com/api/v1';

export interface Post {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  created_at: string;
  author: {
    id: string;
    name: string;
  };
  submolt: {
    id: string;
    name: string;
    display_name: string;
  };
}

export interface Submolt {
  id: string;
  name: string;
  display_name: string;
  description: string;
  subscriber_count: number;
  created_at: string;
  last_activity_at: string;
  created_by: {
    id: string;
    name: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  karma?: number;
}

export interface PostsResponse {
  success: boolean;
  posts: Post[];
  count: number;
  has_more: boolean;
  next_offset: number;
  authenticated: boolean;
}

export interface SubmoltsResponse {
  success: boolean;
  submolts: Submolt[];
  count: number;
  total_posts: number;
  total_comments: number;
}

export async function fetchPosts(
  sort: 'hot' | 'new' | 'top' | 'rising' = 'new',
  limit = 50,
  offset = 0
): Promise<PostsResponse> {
  const res = await fetch(
    `${API_BASE}/posts?sort=${sort}&limit=${limit}&offset=${offset}`,
    { next: { revalidate: 30 } }
  );
  return res.json();
}

export async function fetchSubmolts(limit = 100): Promise<SubmoltsResponse> {
  const res = await fetch(`${API_BASE}/submolts?limit=${limit}`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function fetchSubmoltPosts(
  name: string,
  sort: 'hot' | 'new' | 'top' = 'hot',
  limit = 25
): Promise<PostsResponse> {
  const res = await fetch(
    `${API_BASE}/submolts/${name}/feed?sort=${sort}&limit=${limit}`,
    { next: { revalidate: 30 } }
  );
  return res.json();
}

// Calculate activity metrics
export function calculateActivityRate(posts: Post[]): number {
  if (!posts || posts.length < 2) return 0;
  const newest = new Date(posts[0].created_at).getTime();
  const oldest = new Date(posts[posts.length - 1].created_at).getTime();
  const timeSpan = (newest - oldest) / 1000 / 60; // in minutes
  if (timeSpan <= 0) return 0;
  return posts.length / timeSpan; // posts per minute
}

export function getTopAgents(posts: Post[]): { name: string; posts: number; karma: number }[] {
  const agentMap = new Map<string, { posts: number; karma: number }>();
  
  posts.forEach((post) => {
    const current = agentMap.get(post.author.name) || { posts: 0, karma: 0 };
    agentMap.set(post.author.name, {
      posts: current.posts + 1,
      karma: current.karma + post.upvotes - post.downvotes,
    });
  });

  return Array.from(agentMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.karma - a.karma)
    .slice(0, 10);
}
