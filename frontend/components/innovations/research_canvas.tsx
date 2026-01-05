'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, ZoomIn, ZoomOut, Save, Trash2, Move } from 'lucide-react'

interface CanvasElement {
  id: string
  type: 'note' | 'passage' | 'connection'
  x: number
  y: number
  content: string
  color: string
}

interface ResearchCanvasProps {
  data?: any
  height?: number
  onNodeSelect?: (node: any) => void
  className?: string
  title?: string
  onInteraction?: () => void
  initialData?: any
  onNodeAdd?: (node: any) => void
  onConnectionCreate?: (connection: any) => void
  insights?: any[]
  concepts?: any[]
  sources?: any[]
  scale?: 'macro' | 'micro' | 'meso'
  nodes?: any[]
  connections?: any[]
  children?: React.ReactNode
  edges?: any[]
}

function ResearchCanvas({ data, height, onNodeSelect, className }: ResearchCanvasProps = {}) {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [zoom, setZoom] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNote = () => {
    const newElement: CanvasElement = {
      id: `note-${Date.now()}`,
      type: 'note',
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      content: 'New note...',
      color: '#fef3c7'
    }
    setElements([...elements, newElement])
  }

  const deleteSelected = () => {
    if (selectedId) {
      setElements(elements.filter(el => el.id !== selectedId))
      setSelectedId(null)
    }
  }

  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-50 flex gap-2 bg-slate-800 p-2 rounded-lg shadow-xl">
        <button onClick={addNote} className="p-2 bg-amber-600 hover:bg-amber-500 rounded text-white">
          <Plus size={20} />
        </button>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-white">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-white">
          <ZoomOut size={20} />
        </button>
        <button onClick={deleteSelected} className="p-2 bg-red-600 hover:bg-red-500 rounded text-white" disabled={!selectedId}>
          <Trash2 size={20} />
        </button>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {elements.map(element => (
          <motion.div
            key={element.id}
            drag
            dragMomentum={false}
            initial={{ x: element.x, y: element.y }}
            className={`absolute p-4 rounded-lg shadow-lg cursor-move min-w-[200px] ${
              selectedId === element.id ? 'ring-2 ring-amber-500' : ''
            }`}
            style={{ backgroundColor: element.color }}
            onClick={() => setSelectedId(element.id)}
            onDragEnd={(_, info) => {
              setElements(elements.map(el => 
                el.id === element.id 
                  ? { ...el, x: el.x + info.offset.x, y: el.y + info.offset.y }
                  : el
              ))
            }}
          >
            <textarea
              className="w-full bg-transparent resize-none outline-none text-slate-800"
              value={element.content}
              onChange={(e) => {
                setElements(elements.map(el =>
                  el.id === element.id ? { ...el, content: e.target.value } : el
                ))
              }}
              rows={3}
            />
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="absolute bottom-4 right-4 text-slate-500 text-sm">
        Zoom: {Math.round(zoom * 100)}% | Elements: {elements.length}
      </div>
    </div>
  )
}

// Named and default exports for compatibility
export { ResearchCanvas }
export default ResearchCanvas
