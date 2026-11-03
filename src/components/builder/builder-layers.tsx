'use client'

import * as React from 'react'
import { useState } from 'react'
import { Eye, EyeOff, Trash2, Copy, MoveUp, MoveDown, Layers, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ElementType {
  id: string
  type: 'text' | 'image' | 'button' | 'divider' | 'container' | 'heading' | 'paragraph' | 'list' | 'link'
  content: any
  styles: Record<string, any>
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isSelected: boolean
}

interface BuilderLayersProps {
  elements: ElementType[]
  selectedElement: ElementType | null
  onSelect: (id: string | null) => void
  onDelete: (id: string) => void
  onDuplicate: () => void
}

export default function BuilderLayers({
  elements,
  selectedElement,
  onSelect,
  onDelete,
  onDuplicate,
}: BuilderLayersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleElements, setVisibleElements] = useState<Record<string, boolean>>({})

  const filteredElements = elements.filter((element) => {
    if (!searchQuery) return true
    return element.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (element.content.text && element.content.text.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  const toggleVisibility = (id: string) => {
    setVisibleElements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const moveToFront = (id: string) => {
    // Find the element and move it to the front
    const maxZIndex = Math.max(...elements.map((e) => e.zIndex), 0)
    onSelect(id)
    // This would be handled by the parent component
  }

  const moveToBack = (id: string) => {
    // Move the element to the back
    onSelect(id)
    // This would be handled by the parent component
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'heading':
        return 'H'
      case 'paragraph':
        return 'T'
      case 'button':
        return 'B'
      case 'image':
        return 'IMG'
      case 'divider':
        return '—'
      case 'container':
        return 'C'
      case 'list':
        return 'L'
      case 'link':
        return 'A'
      default:
        return '?'
    }
  }

  return (
    <div className="w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Layers className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Layers</h3>
            <p className="text-xs text-gray-500">{elements.length} elements</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search elements..."
          />
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {filteredElements
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((element) => {
              const isVisible = visibleElements[element.id] !== false
              const isSelected = element.id === selectedElement?.id

              return (
                <div
                  key={element.id}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors',
                    isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  )}
                  onClick={() => onSelect(element.id)}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 mr-3">
                    <span className="text-xs font-medium text-gray-600">{getIcon(element.type)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {element.content.text || element.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {element.type} • z:{element.zIndex}
                    </p>
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleVisibility(element.id)
                    }}
                    className="p-1 rounded hover:bg-gray-200 mr-1"
                    title={isVisible ? 'Hide' : 'Show'}
                  >
                    {isVisible ? (
                      <Eye className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Action Buttons */}
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicate()
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveToFront(element.id)
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                      title="Move to front"
                    >
                      <MoveUp className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveToBack(element.id)
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                      title="Move to back"
                    >
                      <MoveDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(element.id)
                      }}
                      className="p-1 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => onSelect(null)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
        >
          Deselect All
        </button>
      </div>
    </div>
  )
}
