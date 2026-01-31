'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Post } from '@/lib/api';

interface NetworkGraphProps {
  posts: Post[];
}

interface Node {
  id: string;
  name: string;
  type: 'agent' | 'submolt';
  size: number;
  x: number;
  y: number;
  z: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

function buildGraph(posts: Post[]): { nodes: Node[]; edges: Edge[] } {
  const nodeMap = new Map<string, Node>();
  const edgeMap = new Map<string, Edge>();

  // Create nodes for agents and submolts
  posts.forEach((post) => {
    // Agent node
    if (!nodeMap.has(post.author.id)) {
      nodeMap.set(post.author.id, {
        id: post.author.id,
        name: post.author.name,
        type: 'agent',
        size: 0,
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
      });
    }

    // Submolt node
    if (!nodeMap.has(post.submolt.id)) {
      nodeMap.set(post.submolt.id, {
        id: post.submolt.id,
        name: post.submolt.display_name,
        type: 'submolt',
        size: 0,
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
      });
    }

    // Increase sizes
    const agent = nodeMap.get(post.author.id)!;
    agent.size += post.upvotes + 1;

    const submolt = nodeMap.get(post.submolt.id)!;
    submolt.size += 1;

    // Create edge
    const edgeKey = `${post.author.id}-${post.submolt.id}`;
    if (!edgeMap.has(edgeKey)) {
      edgeMap.set(edgeKey, {
        source: post.author.id,
        target: post.submolt.id,
        weight: 0,
      });
    }
    edgeMap.get(edgeKey)!.weight += 1;
  });

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
  };
}

function NodeSphere({
  node,
  nodes,
}: {
  node: Node;
  nodes: Map<string, Node>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const size = Math.min(Math.log(node.size + 1) * 0.3 + 0.2, 1.5);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      // Gentle floating animation
      meshRef.current.position.y =
        node.y + Math.sin(state.clock.elapsedTime + node.x) * 0.1;
    }
  });

  const color = node.type === 'agent' ? '#8b5cf6' : '#f472b6';
  const emissive = node.type === 'agent' ? '#4c1d95' : '#9d174d';

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {node.name.length > 12 ? node.name.slice(0, 12) + '...' : node.name}
      </Text>
    </group>
  );
}

function EdgeLine({ edge, nodes }: { edge: Edge; nodes: Map<string, Node> }) {
  const source = nodes.get(edge.source);
  const target = nodes.get(edge.target);

  if (!source || !target) return null;

  const points = [
    new THREE.Vector3(source.x, source.y, source.z),
    new THREE.Vector3(target.x, target.y, target.z),
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial
        attach="material"
        color="#6366f1"
        opacity={Math.min(edge.weight * 0.3, 0.8)}
        transparent
      />
    </line>
  );
}

function Scene({ posts }: { posts: Post[] }) {
  const { nodes, edges } = useMemo(() => buildGraph(posts), [posts]);
  const nodeMap = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  // Only show top nodes for performance
  const topNodes = useMemo(
    () => nodes.sort((a, b) => b.size - a.size).slice(0, 50),
    [nodes]
  );

  const topEdges = useMemo(() => {
    const topNodeIds = new Set(topNodes.map((n) => n.id));
    return edges.filter(
      (e) => topNodeIds.has(e.source) && topNodeIds.has(e.target)
    );
  }, [edges, topNodes]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f472b6" />

      {topEdges.map((edge, i) => (
        <EdgeLine key={i} edge={edge} nodes={nodeMap} />
      ))}

      {topNodes.map((node) => (
        <NodeSphere key={node.id} node={node} nodes={nodeMap} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function NetworkGraph({ posts }: NetworkGraphProps) {
  return (
    <div className="w-full h-[500px] bg-black/20 rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <Scene posts={posts} />
      </Canvas>
    </div>
  );
}
