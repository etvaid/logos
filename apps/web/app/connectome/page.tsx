'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ZoomIn, ZoomOut, Download } from 'lucide-react';
import * as d3 from 'd3';

export default function Connectome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/connectome')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const zoomIn = () => setZoom(zoom + 0.1);
  const zoomOut = () => setZoom(zoom - 0.1);

  const downloadSvg = () => {
    const svgElement = document.getElementById('connectome-svg');
    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgElement)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'connectome.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderGraph = () => {
    const width = 800;
    const height = 600;

    const svg = d3.select('#connectome-svg')
      .attr('width', width)
      .attr('height', height)
      .style('backgroundColor', '#0D0D0F')
      .style('border', '1px solid rgba(201,169,98,0.15)');

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll('.link')
      .data(data.links.filter(link => filter === 'all' || link.type === filter))
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', '#C9A962')
      .style('stroke-width', 2);

    const node = svg.selectAll('.node')
      .data(data.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', d => {
        switch (d.era) {
          case 'Archaic': return '#8B4513';
          case 'Classical': return '#C9A962';
          case 'Hellenistic': return '#4A90A4';
          case 'Roman': return '#9B2335';
          case 'Late Antique': return '#6B4C8A';
          case 'Byzantine': return '#2E5A3E';
          default: return '#F5F3EF';
        }
      })
      .on('click', d => setSelectedNode(d))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    simulation
      .nodes(data.nodes)
      .on('tick', ticked);

    simulation.force('link')
      .links(data.links);

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  useEffect(() => {
    if (data) {
      renderGraph();
    }
  }, [data, filter, zoom]);

  if (loading) {
    return <div style={{ color: '#F5F3EF' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: '#DC2626' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0D0D0F' }}>
      <h1 style={{ color: '#F5F3EF', marginBottom: '20px' }}>Connectome</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <button onClick={() => setFilter('all')} style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', border: 'none', marginRight: '10px' }}>All</button>
          <button onClick={() => setFilter('type1')} style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', border: 'none', marginRight: '10px' }}>Type 1</button>
          <button onClick={() => setFilter('type2')} style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', border: 'none' }}>Type 2</button>
        </div>
        <div>
          <button onClick={zoomIn} style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', border: 'none', marginRight: '10px' }}><ZoomIn size={16} /></button>
          <button onClick={zoomOut} style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', border: 'none', marginRight: '10px' }}><ZoomOut size={16} /></button>
          <button onClick={downloadSvg} style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', border: 'none' }}><Download size={16} /></button>
        </div>
      </div>
      <svg id="connectome-svg" style={{ width: '100%', height: '600px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)' }}></svg>
      {selectedNode && (
        <div style={{ color: '#F5F3EF', marginTop: '20px' }}>
          <h3>Node Details</h3>
          <p>ID: {selectedNode.id}</p>
          <p>Era: {selectedNode.era}</p>
        </div>
      )}
    </div>
  );
}