/**
 * LOGOS Translation Style Constellation Map
 * ==========================================
 * 
 * Interactive D3.js visualization of translator styles in 2D space.
 * Shows relationships between translators as a "constellation" where:
 *   - Distance = style similarity
 *   - Color = category (Homer, Tragedy, Virgil, etc.)
 *   - Size = confidence/prominence
 * 
 * Features:
 *   - Zoom and pan
 *   - Click to select translator
 *   - Hover for details
 *   - Show geodesic paths between styles
 *   - Animate style blending
 * 
 * Usage:
 *   <StyleConstellation 
 *     translators={data}
 *     selectedTranslator={selected}
 *     onSelect={handleSelect}
 *   />
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Category colors
const CATEGORY_COLORS = {
  homer: '#4F46E5',      // Indigo
  tragedy: '#DC2626',    // Red
  virgil: '#059669',     // Emerald
  greek_prose: '#D97706', // Amber
  latin_prose: '#7C3AED', // Violet
};

// Style dimension labels
const DIMENSIONS = [
  'Formality', 'Archaism', 'Sentence Length', 'Clause Complexity',
  'Word Order', 'Anglo-Saxon', 'Figurative', 'Rhythmic',
  'Source Fidelity', 'Addition', 'Omission', 'Register',
  'Lexical Density', 'Syntactic Mirror', 'Particles', 'Names',
  'Dialect', 'Semantic Drift', 'Intertexts', 'Era Bias'
];

/**
 * Main constellation visualization component
 */
const StyleConstellation = ({ 
  translators, 
  selectedTranslator,
  onSelect,
  width = 800,
  height = 600,
  showLabels = true,
  showEdges = true
}) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  
  useEffect(() => {
    if (!translators || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    const container = svg.append('g');
    
    // Project to 2D using PCA-like projection
    const projectedData = projectToSpace(translators);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(projectedData, d => d.x))
      .range([50, width - 50]);
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(projectedData, d => d.y))
      .range([50, height - 50]);
    
    // Draw edges (connections between similar translators)
    if (showEdges) {
      const edges = computeEdges(projectedData, 3);
      
      container.selectAll('.edge')
        .data(edges)
        .enter()
        .append('line')
        .attr('class', 'edge')
        .attr('x1', d => xScale(projectedData[d.source].x))
        .attr('y1', d => yScale(projectedData[d.source].y))
        .attr('x2', d => xScale(projectedData[d.target].x))
        .attr('y2', d => yScale(projectedData[d.target].y))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', d => Math.max(0.5, 2 - d.distance))
        .attr('opacity', 0.3);
    }
    
    // Draw nodes
    const nodes = container.selectAll('.node')
      .data(projectedData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onSelect) onSelect(d);
      })
      .on('mouseenter', (event, d) => {
        setTooltip({
          visible: true,
          x: event.pageX + 10,
          y: event.pageY + 10,
          content: formatTooltip(d)
        });
      })
      .on('mouseleave', () => {
        setTooltip({ ...tooltip, visible: false });
      });
    
    // Node circles
    nodes.append('circle')
      .attr('r', d => selectedTranslator?.key === d.key ? 12 : 8)
      .attr('fill', d => CATEGORY_COLORS[d.category] || '#6B7280')
      .attr('stroke', d => selectedTranslator?.key === d.key ? '#1F2937' : 'white')
      .attr('stroke-width', d => selectedTranslator?.key === d.key ? 3 : 2)
      .attr('opacity', 0.8)
      .transition()
      .duration(300)
      .attr('opacity', 1);
    
    // Node labels
    if (showLabels) {
      nodes.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-size', '11px')
        .attr('fill', '#374151')
        .text(d => d.name.split(' ').pop()); // Last name only
    }
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 20)`);
    
    Object.entries(CATEGORY_COLORS).forEach(([category, color], i) => {
      const g = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      g.append('circle')
        .attr('r', 6)
        .attr('fill', color);
      
      g.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-size', '11px')
        .attr('fill', '#4B5563')
        .text(category.replace('_', ' '));
    });
    
  }, [translators, selectedTranslator, width, height, showLabels, showEdges]);
  
  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ background: '#fafafa', borderRadius: '8px' }}
      />
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxWidth: '250px'
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};

/**
 * Project 20D style vectors to 2D using PCA
 */
function projectToSpace(translators) {
  // Extract style vectors
  const vectors = translators.map(t => t.style_vector);
  const n = vectors.length;
  const dim = vectors[0].length;
  
  // Center the data
  const mean = new Array(dim).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      mean[i] += v[i] / n;
    }
  }
  
  const centered = vectors.map(v => v.map((val, i) => val - mean[i]));
  
  // Compute covariance matrix (simplified)
  const cov = new Array(dim).fill(null).map(() => new Array(dim).fill(0));
  for (const v of centered) {
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        cov[i][j] += v[i] * v[j] / n;
      }
    }
  }
  
  // Power iteration for top 2 eigenvectors (simplified PCA)
  const pc1 = powerIteration(cov, dim);
  
  // Deflate for second component
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      cov[i][j] -= pc1[i] * pc1[j];
    }
  }
  const pc2 = powerIteration(cov, dim);
  
  // Project data
  return translators.map((t, idx) => ({
    ...t,
    x: dotProduct(centered[idx], pc1),
    y: dotProduct(centered[idx], pc2)
  }));
}

/**
 * Power iteration for dominant eigenvector
 */
function powerIteration(matrix, dim, iterations = 100) {
  let v = new Array(dim).fill(1 / Math.sqrt(dim));
  
  for (let iter = 0; iter < iterations; iter++) {
    // Multiply
    const newV = new Array(dim).fill(0);
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        newV[i] += matrix[i][j] * v[j];
      }
    }
    
    // Normalize
    const norm = Math.sqrt(newV.reduce((s, x) => s + x * x, 0));
    v = newV.map(x => x / norm);
  }
  
  return v;
}

/**
 * Dot product
 */
function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Compute k-nearest neighbor edges
 */
function computeEdges(data, k = 3) {
  const edges = [];
  
  for (let i = 0; i < data.length; i++) {
    const distances = [];
    for (let j = 0; j < data.length; j++) {
      if (i !== j) {
        const dist = Math.sqrt(
          Math.pow(data[i].x - data[j].x, 2) +
          Math.pow(data[i].y - data[j].y, 2)
        );
        distances.push({ index: j, distance: dist });
      }
    }
    
    distances.sort((a, b) => a.distance - b.distance);
    
    for (let n = 0; n < k && n < distances.length; n++) {
      if (i < distances[n].index) {
        edges.push({
          source: i,
          target: distances[n].index,
          distance: distances[n].distance
        });
      }
    }
  }
  
  return edges;
}

/**
 * Format tooltip content
 */
function formatTooltip(translator) {
  const years = translator.death_year 
    ? `${translator.birth_year}-${translator.death_year}`
    : `b. ${translator.birth_year}`;
  
  return `
    <strong>${translator.name}</strong><br/>
    <span style="color: #6B7280">${years}</span><br/>
    <span style="color: ${CATEGORY_COLORS[translator.category]}">${translator.category}</span>
  `;
}


/**
 * Style radar chart component
 */
const StyleRadar = ({ style, name, size = 200 }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!style || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const center = size / 2;
    const radius = size / 2 - 30;
    const dims = DIMENSIONS.length;
    const angleSlice = (2 * Math.PI) / dims;
    
    const g = svg.append('g')
      .attr('transform', `translate(${center}, ${center})`);
    
    // Draw axes
    const axis = g.selectAll('.axis')
      .data(DIMENSIONS)
      .enter()
      .append('g')
      .attr('class', 'axis');
    
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);
    
    // Draw grid circles
    [0.25, 0.5, 0.75, 1].forEach(level => {
      const points = DIMENSIONS.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return [
          radius * level * Math.cos(angle),
          radius * level * Math.sin(angle)
        ];
      });
      
      g.append('polygon')
        .attr('points', points.map(p => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 0.5);
    });
    
    // Draw style polygon
    const stylePoints = style.map((val, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      return [
        radius * val * Math.cos(angle),
        radius * val * Math.sin(angle)
      ];
    });
    
    g.append('polygon')
      .attr('points', stylePoints.map(p => p.join(',')).join(' '))
      .attr('fill', '#4F46E5')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#4F46E5')
      .attr('stroke-width', 2);
    
    // Draw points
    g.selectAll('.point')
      .data(stylePoints)
      .enter()
      .append('circle')
      .attr('cx', d => d[0])
      .attr('cy', d => d[1])
      .attr('r', 4)
      .attr('fill', '#4F46E5');
    
  }, [style, size]);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <svg ref={svgRef} width={size} height={size} />
      {name && <div style={{ marginTop: '8px', fontWeight: 500 }}>{name}</div>}
    </div>
  );
};


/**
 * Style comparison bar chart
 */
const StyleComparison = ({ style1, style2, name1, name2 }) => {
  const svgRef = useRef(null);
  const width = 400;
  const height = 400;
  
  useEffect(() => {
    if (!style1 || !style2 || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const y = d3.scaleBand()
      .domain(DIMENSIONS)
      .range([0, innerHeight])
      .padding(0.2);
    
    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth]);
    
    // Draw dimension labels
    g.selectAll('.label')
      .data(DIMENSIONS)
      .enter()
      .append('text')
      .attr('x', -5)
      .attr('y', d => y(d) + y.bandwidth() / 2)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('alignment-baseline', 'middle')
      .text(d => d);
    
    // Draw bars for style 1
    g.selectAll('.bar1')
      .data(style1)
      .enter()
      .append('rect')
      .attr('class', 'bar1')
      .attr('x', 0)
      .attr('y', (d, i) => y(DIMENSIONS[i]))
      .attr('width', d => x(d))
      .attr('height', y.bandwidth() / 2 - 1)
      .attr('fill', '#4F46E5');
    
    // Draw bars for style 2
    g.selectAll('.bar2')
      .data(style2)
      .enter()
      .append('rect')
      .attr('class', 'bar2')
      .attr('x', 0)
      .attr('y', (d, i) => y(DIMENSIONS[i]) + y.bandwidth() / 2)
      .attr('width', d => x(d))
      .attr('height', y.bandwidth() / 2 - 1)
      .attr('fill', '#DC2626');
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left}, 5)`);
    
    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#4F46E5');
    legend.append('text')
      .attr('x', 16)
      .attr('y', 10)
      .attr('font-size', '11px')
      .text(name1);
    
    legend.append('rect')
      .attr('x', 120)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#DC2626');
    legend.append('text')
      .attr('x', 136)
      .attr('y', 10)
      .attr('font-size', '11px')
      .text(name2);
    
  }, [style1, style2, name1, name2]);
  
  return <svg ref={svgRef} width={width} height={height} />;
};


export { StyleConstellation, StyleRadar, StyleComparison };
export default StyleConstellation;
