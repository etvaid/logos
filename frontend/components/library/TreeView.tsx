'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { formatNumber, getLanguageColor } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  type: 'language' | 'period' | 'author' | 'work' | 'book';
  count?: number;
  language?: string;
  children?: TreeNode[];
  href?: string;
}

interface TreeViewProps {
  nodes: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  onExpand?: (nodeId: string) => Promise<TreeNode[] | void>;
  expandedNodes?: Set<string>;
  selectedNodeId?: string;
  loading?: Set<string>;
}

function ChevronIcon({ expanded, className = '' }: { expanded: boolean; className?: string }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function NodeIcon({ type, language }: { type: TreeNode['type']; language?: string }) {
  const iconClass = 'w-4 h-4';

  switch (type) {
    case 'language':
      return (
        <span
          className={`${iconClass} rounded-sm`}
          style={{ backgroundColor: getLanguageColor(language || 'greek') }}
        />
      );
    case 'period':
      return <span className="text-sm">⏳</span>;
    case 'author':
      return <span className="text-sm">👤</span>;
    case 'work':
      return <span className="text-sm">📜</span>;
    case 'book':
      return <span className="text-sm">📖</span>;
    default:
      return null;
  }
}

function LoadingDots() {
  return (
    <div className="flex gap-1 py-2 pl-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-[#C9A962]/50 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function TreeNodeComponent({
  node,
  depth = 0,
  onNodeSelect,
  onExpand,
  expandedNodes = new Set(),
  selectedNodeId,
  loading = new Set(),
}: {
  node: TreeNode;
  depth?: number;
} & Omit<TreeViewProps, 'nodes'>) {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isLoading = loading.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const canExpand = node.type !== 'book' && node.type !== 'work';

  const handleClick = async () => {
    if (node.href) {
      return; // Let Link handle it
    }

    if (canExpand && onExpand) {
      await onExpand(node.id);
    }

    onNodeSelect?.(node);
  };

  const paddingLeft = depth * 16 + 8;

  const content = (
    <div
      className={`
        flex items-center gap-2 py-2 pr-3 rounded-lg cursor-pointer transition-all duration-150
        ${isSelected ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'hover:bg-[#C9A962]/10'}
        ${node.type === 'language' ? 'font-semibold' : ''}
        ${node.type === 'author' ? 'font-medium' : ''}
      `}
      style={{ paddingLeft }}
      onClick={handleClick}
    >
      {/* Expand indicator */}
      {canExpand && (
        <ChevronIcon
          expanded={isExpanded}
          className={`text-[#C9A962]/50 ${hasChildren || isLoading ? '' : 'opacity-0'}`}
        />
      )}

      {/* Icon */}
      <NodeIcon type={node.type} language={node.language} />

      {/* Name */}
      <span className="flex-1 truncate">{node.name}</span>

      {/* Count badge */}
      {node.count !== undefined && (
        <Badge size="sm" variant="default" className="text-xs">
          {formatNumber(node.count)}
        </Badge>
      )}

      {/* Language badge for authors */}
      {node.type === 'author' && node.language && (
        <Badge
          size="sm"
          variant={node.language === 'greek' ? 'greek' : node.language === 'latin' ? 'latin' : 'default'}
        >
          {node.language}
        </Badge>
      )}
    </div>
  );

  return (
    <div>
      {node.href ? (
        <Link href={node.href}>{content}</Link>
      ) : (
        content
      )}

      {/* Loading state */}
      {isLoading && <LoadingDots />}

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              onNodeSelect={onNodeSelect}
              onExpand={onExpand}
              expandedNodes={expandedNodes}
              selectedNodeId={selectedNodeId}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({
  nodes,
  onNodeSelect,
  onExpand,
  expandedNodes = new Set(),
  selectedNodeId,
  loading = new Set(),
}: TreeViewProps) {
  return (
    <div className="text-sm">
      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          onNodeSelect={onNodeSelect}
          onExpand={onExpand}
          expandedNodes={expandedNodes}
          selectedNodeId={selectedNodeId}
          loading={loading}
        />
      ))}
    </div>
  );
}
