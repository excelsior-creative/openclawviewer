'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Post } from '@/lib/api';

interface ActivityPulseProps {
  posts: Post[];
}

interface ActivityPoint {
  timestamp: Date;
  upvotes: number;
  submolt: string;
  title: string;
  author: string;
}

export default function ActivityPulse({ posts }: ActivityPulseProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: 300 });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !posts.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data: ActivityPoint[] = posts.map((post) => ({
      timestamp: new Date(post.created_at),
      upvotes: post.upvotes,
      submolt: post.submolt.name,
      title: post.title,
      author: post.author.name,
    }));

    // Group by time buckets (5 min intervals)
    const bucketSize = 5 * 60 * 1000;
    const now = new Date();
    const buckets = new Map<number, { count: number; totalUpvotes: number }>();
    
    data.forEach((d) => {
      const bucket = Math.floor(d.timestamp.getTime() / bucketSize) * bucketSize;
      const current = buckets.get(bucket) || { count: 0, totalUpvotes: 0 };
      buckets.set(bucket, {
        count: current.count + 1,
        totalUpvotes: current.totalUpvotes + d.upvotes,
      });
    });

    const bucketData = Array.from(buckets.entries())
      .map(([time, data]) => ({ time: new Date(time), ...data }))
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(bucketData, (d) => d.time) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bucketData, (d) => d.count) || 10])
      .range([innerHeight, 0]);

    // Add glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Gradient
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.8);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0);

    // Area
    const area = d3
      .area<(typeof bucketData)[0]>()
      .x((d) => xScale(d.time))
      .y0(innerHeight)
      .y1((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(bucketData)
      .attr('fill', 'url(#areaGradient)')
      .attr('d', area);

    // Line
    const line = d3
      .line<(typeof bucketData)[0]>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(bucketData)
      .attr('fill', 'none')
      .attr('stroke', '#a78bfa')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)')
      .attr('d', line);

    // Dots
    g.selectAll('.dot')
      .data(bucketData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.time))
      .attr('cy', (d) => yScale(d.count))
      .attr('r', 4)
      .attr('fill', '#c4b5fd')
      .attr('filter', 'url(#glow)')
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8).attr('fill', '#f472b6');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 4).attr('fill', '#c4b5fd');
      });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'axis')
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat((d) => d3.timeFormat('%H:%M')(d as Date))
      )
      .selectAll('text')
      .attr('fill', '#9ca3af');

    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', '#9ca3af');

    // Style axes
    svg.selectAll('.axis path').attr('stroke', '#4b5563');
    svg.selectAll('.axis line').attr('stroke', '#4b5563');
  }, [posts, dimensions]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
}
