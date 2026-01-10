'use client';

import { useRef, useEffect, useState } from 'react';

interface Node {
  id: string;
  name: string;
  group?: string;
  size?: number;
  color?: string;
}

interface Link {
  source: string;
  target: string;
  value?: number;
  type?: string;
}

interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
  onNodeClick?: (node: Node) => void;
  selectedNodeId?: string;
  nodeColors?: Record<string, string>;
  linkColors?: Record<string, string>;
}

const DEFAULT_NODE_COLORS: Record<string, string> = {
  Greek: '#87CEEB',
  Latin: '#DDA0DD',
  default: '#C9A962',
};

const DEFAULT_LINK_COLORS: Record<string, string> = {
  model: '#C9A962',
  allusion: '#6B8E23',
  response: '#4169E1',
  default: 'rgba(201, 169, 98, 0.3)',
};

export default function ForceGraph({
  nodes,
  links,
  width = 800,
  height = 600,
  onNodeClick,
  selectedNodeId,
  nodeColors = DEFAULT_NODE_COLORS,
  linkColors = DEFAULT_LINK_COLORS,
}: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Simple force simulation using CSS animations and initial positions
  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};
    const nodeCount = nodes.length;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Position nodes in a circle initially
    nodes.forEach((node, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      newPositions[node.id] = { x, y };
    });

    // Simple spring simulation
    const simulate = () => {
      const linkMap: Record<string, string[]> = {};
      links.forEach((link) => {
        if (!linkMap[link.source]) linkMap[link.source] = [];
        if (!linkMap[link.target]) linkMap[link.target] = [];
        linkMap[link.source].push(link.target);
        linkMap[link.target].push(link.source);
      });

      // Move connected nodes closer
      for (let iteration = 0; iteration < 50; iteration++) {
        nodes.forEach((node) => {
          const pos = newPositions[node.id];
          const connected = linkMap[node.id] || [];

          connected.forEach((connectedId) => {
            const connectedPos = newPositions[connectedId];
            if (!connectedPos) return;

            const dx = connectedPos.x - pos.x;
            const dy = connectedPos.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 100) {
              pos.x += dx * 0.01;
              pos.y += dy * 0.01;
            } else if (distance < 50) {
              pos.x -= dx * 0.01;
              pos.y -= dy * 0.01;
            }
          });

          // Repel from other nodes
          nodes.forEach((other) => {
            if (other.id === node.id) return;
            const otherPos = newPositions[other.id];
            const dx = otherPos.x - pos.x;
            const dy = otherPos.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80 && distance > 0) {
              pos.x -= (dx / distance) * 2;
              pos.y -= (dy / distance) * 2;
            }
          });

          // Keep within bounds
          pos.x = Math.max(50, Math.min(width - 50, pos.x));
          pos.y = Math.max(50, Math.min(height - 50, pos.y));
        });
      }
    };

    simulate();
    setPositions(newPositions);
  }, [nodes, links, width, height]);

  const getNodeColor = (node: Node) => {
    if (node.color) return node.color;
    return nodeColors[node.group || 'default'] || nodeColors.default;
  };

  const getLinkColor = (link: Link) => {
    return linkColors[link.type || 'default'] || linkColors.default;
  };

  const getNodeSize = (node: Node) => {
    const baseSize = node.size || 10;
    return Math.max(8, Math.min(30, baseSize));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-[#0D0D0F] rounded-lg"
      >
        {/* Links */}
        <g>
          {links.map((link, i) => {
            const sourcePos = positions[link.source];
            const targetPos = positions[link.target];
            if (!sourcePos || !targetPos) return null;

            const isHighlighted =
              selectedNodeId === link.source ||
              selectedNodeId === link.target ||
              hoveredNode?.id === link.source ||
              hoveredNode?.id === link.target;

            return (
              <line
                key={`link-${i}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={getLinkColor(link)}
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={isHighlighted ? 0.8 : 0.3}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;

            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const size = getNodeSize(node);

            return (
              <g key={node.id} className="cursor-pointer">
                {/* Glow effect for selected/hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size + 8}
                    fill="none"
                    stroke={getNodeColor(node)}
                    strokeWidth={2}
                    opacity={0.5}
                    className="animate-pulse"
                  />
                )}

                {/* Main node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill={getNodeColor(node)}
                  stroke={isSelected ? '#F5F3EF' : 'transparent'}
                  strokeWidth={2}
                  className="transition-all duration-300 hover:opacity-90"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onNodeClick?.(node)}
                />

                {/* Label */}
                {(isSelected || isHovered || size > 15) && (
                  <text
                    x={pos.x}
                    y={pos.y + size + 14}
                    textAnchor="middle"
                    fill="#F5F3EF"
                    fontSize={11}
                    className="pointer-events-none"
                  >
                    {node.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip for hovered node */}
      {hoveredNode && positions[hoveredNode.id] && (
        <div
          className="absolute z-10 bg-[#1A1A1D] border border-[#C9A962]/30 rounded-lg p-3 shadow-xl pointer-events-none"
          style={{
            left: positions[hoveredNode.id].x,
            top: positions[hoveredNode.id].y - 60,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-[#C9A962]">{hoveredNode.name}</div>
          {hoveredNode.group && (
            <div className="text-xs text-[#F5F3EF]/50">{hoveredNode.group}</div>
          )}
        </div>
      )}
    </div>
  );
}
