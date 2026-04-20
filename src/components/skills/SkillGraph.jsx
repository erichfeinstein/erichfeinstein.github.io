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

// Uniform size — hubs now read via color brightness instead.
function nodeRadius() {
  return 7;
}

function nodeColor(id, cat) {
  const { hue } = CATEGORIES[cat] || { hue: 0 };
  const deg = degreeMap.get(id) || 0;
  // Lightness scales with degree: leaves sit around 45%, hubs nudge toward 95%.
  const t = Math.min(deg, 8) / 8; // 0..1
  const lightness = 45 + t * 50; // 45..95
  const saturation = hue === 0 ? 0 : 30 - t * 15; // hubs desaturate toward white
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Category grid anchors — 5 cols × 4 rows
const CAT_KEYS = Object.keys(CATEGORIES); // 17 categories
const GRID_COLS = 5;

function getCategoryAnchors(width, height) {
  const pad = 100;
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

// Custom d3 force: pull nodes gently toward the cursor, with distance falloff.
function makeCursorForce(getPos, { radius = 180, strength = 0.08 } = {}) {
  let _nodes;
  function force(alpha) {
    const pos = getPos();
    if (!pos) return;
    const { x: px, y: py } = pos;
    for (const n of _nodes) {
      if (n.fx != null || n.fy != null) continue; // skip pinned
      const dx = px - n.x;
      const dy = py - n.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < radius) {
        const k = (1 - d / radius) * strength * alpha;
        n.vx += dx * k;
        n.vy += dy * k;
      }
    }
  }
  force.initialize = (n) => { _nodes = n; };
  return force;
}

// Soft boundary: linearly ramp up a push-inward force as a node approaches
// the edge. Runs BEFORE the hard clamp each tick, so collision has room to
// separate crowded nodes along the edge instead of them all piling at the
// clamp line.
function makeBoundaryForce(getSize, { pad = 80, strength = 0.18 } = {}) {
  let _nodes;
  function force(alpha) {
    const { w, h } = getSize();
    for (const n of _nodes) {
      if (n.fx != null || n.fy != null) continue;
      if (n.x < pad) n.vx += (pad - n.x) * strength * alpha;
      else if (n.x > w - pad) n.vx -= (n.x - (w - pad)) * strength * alpha;
      if (n.y < pad) n.vy += (pad - n.y) * strength * alpha;
      else if (n.y > h - pad) n.vy -= (n.y - (h - pad)) * strength * alpha;
    }
  }
  force.initialize = (n) => { _nodes = n; };
  return force;
}

export default function SkillGraph({ focusedId, onUnfocus }) {
  const containerRef = useRef(null);
  const simRef = useRef(null);
  // Track which node was pinned via external focusedId prop (vs user click)
  const focusPinnedRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 620 });
  // Tick callback closes over the initial size; this ref lets it see current size.
  const sizeRef = useRef({ w: 800, h: 620 });
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(initialNodes.map((n) => [n.id, { x: 400, y: 300 }]))
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(new Set());
  // Mirror pinned set in a ref so the collide force (closed over at setup) can read it live.
  const pinnedIdsRef = useRef(pinnedIds);
  useEffect(() => {
    pinnedIdsRef.current = pinnedIds;
    // Re-heat so the collide force re-evaluates with new pinned-radius boosts.
    simRef.current?.sim.alpha(0.25).restart();
  }, [pinnedIds]);

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
      .force('collide', forceCollide((d) => {
        const base = Math.max(30, d.label.length * 3.2);
        // Pinned nodes actively shove themselves apart so multi-pin doesn't overlap.
        return pinnedIdsRef.current.has(d.id) ? base * 1.7 : base;
      }))
      .force('clusterX', forceX((d) => anchors[d.cat]?.x ?? w / 2).strength(0.18))
      .force('clusterY', forceY((d) => anchors[d.cat]?.y ?? h / 2).strength(0.18))
      .force('cursor', makeCursorForce(() => mousePosRef.current, { radius: 180, strength: 0.05 }))
      .force('boundary', makeBoundaryForce(() => sizeRef.current, { pad: 80, strength: 0.22 }))
      .alphaDecay(0.05)
      .alphaTarget(0);

    sim.on('tick', () => {
      // Read current size from ref so the clamp follows resizes.
      const cw = sizeRef.current.w;
      const ch = sizeRef.current.h;
      nodes.forEach((n) => {
        n.x = Math.max(pad, Math.min(cw - pad, n.x));
        n.y = Math.max(pad, Math.min(ch - pad, n.y));
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
    sizeRef.current = size;
    if (!simRef.current) return;
    const { sim } = simRef.current;
    const w = size.w;
    const h = size.h;
    const anchors = getCategoryAnchors(w, h);
    sim.force('center', forceCenter(w / 2, h / 2));
    sim.force('clusterX', forceX((d) => anchors[d.cat]?.x ?? w / 2).strength(0.18));
    sim.force('clusterY', forceY((d) => anchors[d.cat]?.y ?? h / 2).strength(0.18));
    sim.alpha(0.4).restart();
  }, [size]);

  // ResizeObserver — track actual container width/height every time it changes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setSize({ w: width, h: height });
      }
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

  // Cursor position (SVG-local coords). Null when outside the graph container.
  const mousePosRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    // Gentle drift while cursor is over the graph so cursor-gravity can move nodes.
    simRef.current?.sim.alphaTarget(0.04).restart();
  }, []);
  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = null;
    simRef.current?.sim.alphaTarget(0);
    if (!focusedId) setHoveredId(null);
  }, [focusedId]);
  const handleContainerMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

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

  // "Active" set: union of hovered id, focused id, and every pinned id.
  // Each of these keeps itself + its direct neighbors lit; everything else dims.
  const activeSet = new Set();
  if (hoveredId) activeSet.add(hoveredId);
  if (focusedId) activeSet.add(focusedId);
  pinnedIds.forEach((id) => activeSet.add(id));

  const litSet = new Set();
  if (activeSet.size > 0) {
    activeSet.forEach((id) => {
      litSet.add(id);
      (adjacency.current.get(id) || new Set()).forEach((n) => litSet.add(n));
    });
  }

  function getNodeProps(id) {
    const baseR = nodeRadius();
    const cat = initialNodes.find((n) => n.id === id)?.cat;
    const color = nodeColor(id, cat);
    const isPinned = pinnedIds.has(id);
    const isActive = activeSet.has(id);
    const labelScale = isPinned ? 1.1 : 1;

    if (activeSet.size > 0) {
      if (litSet.has(id)) {
        return {
          r: baseR,
          fill: isActive ? '#ffffff' : color,
          opacity: 1,
          labelOpacity: 1,
          labelScale,
          isPinned,
        };
      }
      return { r: baseR, fill: color, opacity: 0.2, labelOpacity: 0, labelScale: 1, isPinned: false };
    }
    // Rest state: labels hidden — only dots visible.
    return { r: baseR, fill: color, opacity: 1, labelOpacity: 0, labelScale, isPinned };
  }

  function getEdgeOpacity(sourceId, targetId) {
    if (activeSet.size === 0) return 1;
    const sourceActive = activeSet.has(sourceId);
    const targetActive = activeSet.has(targetId);
    if (sourceActive || targetActive) return 0.7;
    return 0.04;
  }

  return (
    <div>
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '620px', cursor: 'default' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleContainerMouseMove}
      >
        <svg
          width={size.w}
          height={size.h}
          style={{ display: 'block' }}
          onClick={handleSvgClick}
        >
          {/* Label halo + hover-smoothing transitions + pinned pulse */}
          <defs>
            <radialGradient id="pin-glow">
              <stop offset="0%" stopColor="#ff2bd6" stopOpacity="0" />
              <stop offset="55%" stopColor="#ff2bd6" stopOpacity="0.25" />
              <stop offset="75%" stopColor="#00e5ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id="pin-text"
              x1="0"
              y1="0"
              x2="240"
              y2="0"
              gradientUnits="userSpaceOnUse"
              spreadMethod="repeat"
            >
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-240 0"
                to="240 0"
                dur="3s"
                repeatCount="indefinite"
              />
              <stop offset="0" stopColor="#ff2bd6" />
              <stop offset="0.33" stopColor="#00e5ff" />
              <stop offset="0.66" stopColor="#00ff88" />
              <stop offset="1" stopColor="#ff2bd6" />
            </linearGradient>
            <style>{`
              .skill-label { paint-order: stroke; stroke: var(--bg); stroke-width: 4px; stroke-linejoin: round; transition: opacity 180ms ease-out; }
              .skill-node-group { transition: opacity 180ms ease-out; }
              .skill-node-dot { transition: fill 180ms ease-out; }
              .skill-edge { transition: opacity 180ms ease-out; }
              @keyframes skill-pin-pulse {
                0%   { r: 12; opacity: 0.9; }
                50%  { r: 22; opacity: 0.35; }
                100% { r: 12; opacity: 0.9; }
              }
              .skill-pin-ring { animation: skill-pin-pulse 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
            `}</style>
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
                  className="skill-edge"
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
                  className="skill-node-group"
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
                  {/* Pinned: rainbow glow halo + pulsing ring */}
                  {isPinned && (
                    <>
                      <circle
                        r={22}
                        fill="url(#pin-glow)"
                        style={{ pointerEvents: 'none' }}
                      />
                      <circle
                        className="skill-pin-ring"
                        fill="none"
                        stroke="#ff2bd6"
                        strokeWidth="1.2"
                        style={{ pointerEvents: 'none' }}
                      />
                    </>
                  )}
                  {/* Visible dot */}
                  <circle
                    className="skill-node-dot"
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
                        fontFamily="var(--mono)"
                        textAnchor={leftHalf ? 'start' : 'end'}
                        className="skill-label"
                        fill={isPinned ? 'url(#pin-text)' : 'white'}
                        style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: isPinned ? 700 : 400 }}
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
