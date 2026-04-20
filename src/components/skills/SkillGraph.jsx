import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
} from 'd3-force';
import { NODES, EDGES, CATEGORIES } from './data';

// Build node and edge objects once (outside component to avoid re-creation)
const nodeIds = new Set(NODES.map(([id]) => id));

const initialNodes = NODES.map(([id, label, cat]) => ({ id, label, cat }));

const initialEdges = EDGES
  .filter(([s, t]) => nodeIds.has(s) && nodeIds.has(t))
  .map(([source, target]) => ({ source, target }));

function nodeColor(cat) {
  const { hue } = CATEGORIES[cat] || { hue: 0 };
  if (hue === 0) return 'hsl(0, 0%, 90%)';
  return `hsl(${hue}, 35%, 90%)`;
}

export default function SkillGraph() {
  const containerRef = useRef(null);
  const simRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(initialNodes.map((n) => [n.id, { x: 400, y: 300 }]))
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(new Set());
  const [search, setSearch] = useState('');

  // Build adjacency set for hover highlight
  const adjacency = useRef(new Map());
  useEffect(() => {
    const adj = new Map();
    initialNodes.forEach((n) => adj.set(n.id, new Set()));
    initialEdges.forEach(({ source, target }) => {
      const s = typeof source === 'object' ? source.id : source;
      const t = typeof target === 'object' ? target.id : target;
      adj.get(s)?.add(t);
      adj.get(t)?.add(s);
    });
    adjacency.current = adj;
  }, []);

  // Setup simulation
  useEffect(() => {
    const nodes = initialNodes.map((n) => ({ ...n }));
    const edges = initialEdges.map((e) => ({ ...e }));

    const sim = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-120))
      .force('link', forceLink(edges).id((d) => d.id).distance(80).strength(0.4))
      .force('center', forceCenter(size.w / 2, size.h / 2))
      .force('collide', forceCollide(18))
      .alphaDecay(0.02)
      .alphaTarget(0);

    sim.on('tick', () => {
      const pos = {};
      nodes.forEach((n) => {
        pos[n.id] = { x: n.x, y: n.y, fx: n.fx, fy: n.fy };
      });
      setPositions(pos);
    });

    simRef.current = { sim, nodes, edges };

    return () => {
      sim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center force when size changes
  useEffect(() => {
    if (!simRef.current) return;
    const { sim } = simRef.current;
    sim.force('center', forceCenter(size.w / 2, size.h / 2));
    sim.alpha(0.3).restart();
  }, [size]);

  // ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setSize({ w: width, h: 600 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mouse over container: gentle drift
  const handleMouseEnter = useCallback(() => {
    simRef.current?.sim.alphaTarget(0.02).restart();
  }, []);
  const handleMouseLeave = useCallback(() => {
    simRef.current?.sim.alphaTarget(0);
    setHoveredId(null);
  }, []);

  // Pin/unpin on click
  const handleNodeClick = useCallback((id) => {
    if (!simRef.current) return;
    const { nodes, sim } = simRef.current;
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        // unpin
        node.fx = null;
        node.fy = null;
        next.delete(id);
      } else {
        // pin
        node.fx = node.x;
        node.fy = node.y;
        next.add(id);
      }
      return next;
    });
    sim.alpha(0.1).restart();
  }, []);

  // Search matching
  const searchTerm = search.trim().toLowerCase();
  const matchedIds = searchTerm
    ? new Set(initialNodes.filter((n) => n.label.toLowerCase().includes(searchTerm)).map((n) => n.id))
    : null;
  const noResults = searchTerm.length > 0 && matchedIds && matchedIds.size === 0;

  // Derive per-node visual properties
  function getNodeProps(id) {
    if (matchedIds) {
      // Search mode
      const matched = matchedIds.has(id);
      return {
        r: matched ? 7 : 3,
        fill: matched ? '#ffffff' : nodeColor(initialNodes.find((n) => n.id === id)?.cat),
        opacity: matched ? 1 : 0.15,
        labelOpacity: matched ? 1 : 0,
      };
    }
    if (hoveredId) {
      const neighbors = adjacency.current.get(hoveredId) || new Set();
      const isHovered = id === hoveredId;
      const isNeighbor = neighbors.has(id);
      if (isHovered || isNeighbor) {
        return { r: 5, fill: '#ffffff', opacity: 1, labelOpacity: 1 };
      }
      return { r: 5, fill: nodeColor(initialNodes.find((n) => n.id === id)?.cat), opacity: 0.2, labelOpacity: 0 };
    }
    const n = initialNodes.find((node) => node.id === id);
    return { r: 5, fill: nodeColor(n?.cat), opacity: 1, labelOpacity: 1 };
  }

  function getEdgeOpacity(sourceId, targetId) {
    if (matchedIds) return 0.05;
    if (hoveredId) {
      const neighbors = adjacency.current.get(hoveredId) || new Set();
      if (
        (sourceId === hoveredId && neighbors.has(targetId)) ||
        (targetId === hoveredId && neighbors.has(sourceId))
      ) {
        return 0.6;
      }
      return 0.03;
    }
    return 1;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="search skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          background: 'transparent',
          border: '1px solid var(--fg-faint)',
          borderRadius: 4,
          color: 'var(--fg)',
          fontFamily: 'var(--mono)',
          fontSize: 13,
          padding: '6px 12px',
          outline: 'none',
          marginBottom: '0.75rem',
          width: '100%',
          maxWidth: 320,
          boxSizing: 'border-box',
        }}
      />
      {noResults && (
        <div style={{ color: 'var(--fg-dim)', fontSize: 13, fontFamily: 'var(--mono)', marginBottom: '0.5rem' }}>
          {'// not yet'}
        </div>
      )}
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '600px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={size.w}
          height={size.h}
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Edges */}
          <g>
            {simRef.current?.edges.map((edge, i) => {
              const s = typeof edge.source === 'object' ? edge.source.id : edge.source;
              const t = typeof edge.target === 'object' ? edge.target.id : edge.target;
              const sp = positions[s];
              const tp = positions[t];
              if (!sp || !tp) return null;
              return (
                <line
                  key={i}
                  x1={sp.x}
                  y1={sp.y}
                  x2={tp.x}
                  y2={tp.y}
                  stroke="var(--fg-faint)"
                  strokeWidth={0.5}
                  opacity={getEdgeOpacity(s, t)}
                />
              );
            })}
          </g>
          {/* Nodes */}
          <g>
            {initialNodes.map((node) => {
              const pos = positions[node.id];
              if (!pos) return null;
              const { r, fill, opacity, labelOpacity } = getNodeProps(node.id);
              const isPinned = pinnedIds.has(node.id);
              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleNodeClick(node.id)}
                  opacity={opacity}
                >
                  <circle
                    r={r}
                    fill={fill}
                    stroke={isPinned ? 'var(--fg)' : 'none'}
                    strokeWidth={isPinned ? 1.5 : 0}
                  />
                  <text
                    dx={8}
                    dy={4}
                    fontSize={12}
                    fill="white"
                    fontFamily="var(--mono)"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                    opacity={labelOpacity}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
