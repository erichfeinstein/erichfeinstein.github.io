import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force';
import { NODES, EDGES, CATEGORIES } from './data';

// Build node and edge objects once (outside component to avoid re-creation)
const nodeIds = new Set(NODES.map(([id]) => id));

const initialNodes = NODES.map(([id, label, cat]) => ({ id, label, cat }));

const initialEdges = EDGES
  .filter(([s, t]) => nodeIds.has(s) && nodeIds.has(t))
  .map(([source, target]) => ({ source, target }));

// Degree map: count edges per node
const degreeMap = new Map();
initialNodes.forEach((n) => degreeMap.set(n.id, 0));
initialEdges.forEach(({ source, target }) => {
  degreeMap.set(source, (degreeMap.get(source) || 0) + 1);
  degreeMap.set(target, (degreeMap.get(target) || 0) + 1);
});

function nodeRadius(id) {
  const deg = degreeMap.get(id) || 0;
  return 5 + Math.min(deg, 7) * 1.2;
}

function nodeColor(cat) {
  const { hue } = CATEGORIES[cat] || { hue: 0 };
  if (hue === 0) return 'hsl(0, 0%, 90%)';
  return `hsl(${hue}, 35%, 90%)`;
}

// Category grid anchors — 5 cols × 4 rows
const CAT_KEYS = Object.keys(CATEGORIES); // 17 categories
const GRID_COLS = 5;

function getCategoryAnchors(width, height) {
  const pad = 60;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const numRows = Math.ceil(CAT_KEYS.length / GRID_COLS);
  const anchors = {};
  CAT_KEYS.forEach((cat, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    anchors[cat] = {
      x: pad + (col / (GRID_COLS - 1)) * innerW,
      y: pad + (row / (numRows - 1)) * innerH,
    };
  });
  return anchors;
}

export default function SkillGraph({ focusedId, onUnfocus }) {
  const containerRef = useRef(null);
  const simRef = useRef(null);
  // Track which node was pinned via external focusedId prop (vs user click)
  const focusPinnedRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(initialNodes.map((n) => [n.id, { x: 400, y: 300 }]))
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(new Set());

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
    const pad = 40;
    const w = size.w;
    const h = size.h;
    const anchors = getCategoryAnchors(w, h);

    const sim = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-140))
      .force('link', forceLink(edges).id((d) => d.id).distance(70).strength(0.5))
      .force('center', forceCenter(w / 2, h / 2))
      .force('collide', forceCollide(32))
      .force('clusterX', forceX((d) => anchors[d.cat]?.x ?? w / 2).strength(0.18))
      .force('clusterY', forceY((d) => anchors[d.cat]?.y ?? h / 2).strength(0.18))
      .alphaDecay(0.05)
      .alphaTarget(0);

    sim.on('tick', () => {
      // Clamp nodes to container bounds
      nodes.forEach((n) => {
        n.x = Math.max(pad, Math.min(w - pad, n.x));
        n.y = Math.max(pad, Math.min(h - pad, n.y));
      });
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

  // Update center + cluster forces when size changes
  useEffect(() => {
    if (!simRef.current) return;
    const { sim } = simRef.current;
    const w = size.w;
    const h = size.h;
    const anchors = getCategoryAnchors(w, h);
    sim.force('center', forceCenter(w / 2, h / 2));
    sim.force('clusterX', forceX((d) => anchors[d.cat]?.x ?? w / 2).strength(0.18));
    sim.force('clusterY', forceY((d) => anchors[d.cat]?.y ?? h / 2).strength(0.18));
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

  // React to external focusedId prop
  useEffect(() => {
    if (!simRef.current) return;
    const { sim, nodes } = simRef.current;

    // Unpin previously focus-pinned node
    if (focusPinnedRef.current && focusPinnedRef.current !== focusedId) {
      const prev = nodes.find((n) => n.id === focusPinnedRef.current);
      if (prev) {
        prev.fx = null;
        prev.fy = null;
      }
      setPinnedIds((p) => {
        const next = new Set(p);
        next.delete(focusPinnedRef.current);
        return next;
      });
      focusPinnedRef.current = null;
    }

    if (focusedId) {
      const node = nodes.find((n) => n.id === focusedId);
      if (node) {
        // Snap the focused node to the center of the viewport so it's always easy to read
        node.fx = size.w / 2;
        node.fy = size.h / 2;
        focusPinnedRef.current = focusedId;
        setPinnedIds((p) => new Set([...p, focusedId]));
        setHoveredId(focusedId);
        sim.alpha(0.5).restart();
      }
    } else {
      setHoveredId(null);
    }
  }, [focusedId, size.w, size.h]);

  // No idle drift — simulation only runs when nudged by an explicit action
  // (focus change, pin/unpin, background click, resize).
  const handleMouseEnter = useCallback(() => {}, []);
  const handleMouseLeave = useCallback(() => {
    if (!focusedId) setHoveredId(null);
  }, [focusedId]);

  // Click on SVG background: unfocus
  const handleSvgClick = useCallback((e) => {
    // Only trigger if the click target is the SVG itself or the background rect
    if (e.target === e.currentTarget || e.target.dataset.background) {
      onUnfocus?.();
      setPinnedIds(new Set());
      if (simRef.current) {
        simRef.current.nodes.forEach((n) => {
          n.fx = null;
          n.fy = null;
        });
        simRef.current.sim.alpha(0.1).restart();
      }
    }
  }, [onUnfocus]);

  // Pin/unpin on click
  const handleNodeClick = useCallback((id, e) => {
    e.stopPropagation();
    if (!simRef.current) return;
    const { nodes, sim } = simRef.current;
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    // If this node is the focus-pinned one, clicking it triggers unfocus
    if (focusPinnedRef.current === id) {
      onUnfocus?.();
      node.fx = null;
      node.fy = null;
      focusPinnedRef.current = null;
      setPinnedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      sim.alpha(0.1).restart();
      return;
    }

    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        node.fx = null;
        node.fy = null;
        next.delete(id);
      } else {
        node.fx = node.x;
        node.fy = node.y;
        next.add(id);
      }
      return next;
    });
    sim.alpha(0.1).restart();
  }, [onUnfocus]);

  // Active highlight id: focusedId takes priority over hover for highlight
  const activeId = hoveredId || focusedId || null;

  // Derive per-node visual properties
  function getNodeProps(id) {
    const baseR = nodeRadius(id);
    const cat = initialNodes.find((n) => n.id === id)?.cat;
    const color = nodeColor(cat);
    const isPinned = pinnedIds.has(id);
    const labelScale = isPinned ? 1.05 : 1;

    if (activeId) {
      const neighbors = adjacency.current.get(activeId) || new Set();
      const isActive = id === activeId;
      const isNeighbor = neighbors.has(id);
      if (isActive || isNeighbor) {
        return { r: Math.max(baseR, 5), fill: '#ffffff', opacity: 1, labelOpacity: 1, labelScale };
      }
      return { r: baseR, fill: color, opacity: 0.2, labelOpacity: 0, labelScale: 1 };
    }
    return { r: baseR, fill: color, opacity: 1, labelOpacity: 1, labelScale };
  }

  function getEdgeOpacity(sourceId, targetId) {
    if (activeId) {
      const neighbors = adjacency.current.get(activeId) || new Set();
      if (
        (sourceId === activeId && neighbors.has(targetId)) ||
        (targetId === activeId && neighbors.has(sourceId))
      ) {
        return 0.6;
      }
      return 0.03;
    }
    return 1;
  }

  return (
    <div>
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '620px', cursor: 'default' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={size.w}
          height={size.h}
          style={{ display: 'block' }}
          onClick={handleSvgClick}
        >
          {/* Label halo for readability over edges/other labels */}
          <defs>
            <style>{`.skill-label { paint-order: stroke; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; }`}</style>
          </defs>
          {/* Invisible background to capture clicks */}
          <rect
            width={size.w}
            height={size.h}
            fill="transparent"
            data-background="true"
          />
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
              const { r, fill, opacity, labelOpacity, labelScale } = getNodeProps(node.id);
              const isPinned = pinnedIds.has(node.id);
              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => !focusedId && setHoveredId(null)}
                  onClick={(e) => handleNodeClick(node.id, e)}
                  opacity={opacity}
                >
                  {/* Invisible hit halo — always present, never filtered */}
                  <circle
                    r={20}
                    fill="transparent"
                    style={{ pointerEvents: 'all' }}
                  />
                  {/* Pin ring (behind the dot) */}
                  {isPinned && (
                    <circle
                      r={r + 3}
                      fill="none"
                      stroke="var(--fg)"
                      strokeWidth="1"
                      opacity="0.8"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {/* Visible dot */}
                  <circle
                    r={r}
                    fill={fill}
                    style={{ pointerEvents: 'none' }}
                  />
                  {(() => {
                    const leftHalf = pos.x < size.w / 2;
                    return (
                      <text
                        dx={leftHalf ? r + 4 : -(r + 4)}
                        dy={4}
                        fontSize={12 * labelScale}
                        fill="white"
                        fontFamily="var(--mono)"
                        textAnchor={leftHalf ? 'start' : 'end'}
                        className="skill-label"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                        opacity={labelOpacity}
                      >
                        {node.label}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
