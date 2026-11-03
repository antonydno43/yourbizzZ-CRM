'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { MousePointer2, Move, Type, AlignLeft, Square, Image as ImageIcon, Layout, Grid3X3, Link as LinkIcon, Search, Undo, Redo, ZoomIn, ZoomOut } from 'lucide-react'

interface ToolbarItem {
  type?: string
  icon?: React.ElementType
  label: string
  mode?: 'select' | 'add' | 'move'
}

interface BuilderToolbarProps {
  items: ToolbarItem[]
  selectedType: string | null
  mode: 'select' | 'add' | 'move'
  onSelectType: (type: string | null) => void
  onSelectMode: (mode: 'select' | 'add' | 'move') => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export default function BuilderToolbar({
  items,
  selectedType,
  mode,
  onSelectType,
  onSelectMode,
  zoom,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: BuilderToolbarProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    return item.label.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getIcon = (item: ToolbarItem) => {
    if (item.icon) return item.icon
    
    switch (item.type) {
      case 'select':
        return MousePointer2
      case 'move':
        return Move
      case 'heading':
        return Type
      case 'paragraph':
        return AlignLeft
      case 'button':
        return Square
      case 'image':
        return ImageIcon
      case 'container':
        return Layout
      case 'list':
        return Grid3X3
      case 'link':
        return LinkIcon
      default:
        return Square
    }
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col py-4">
      {/* Mode Selector */}
      <div className="px-2 mb-4">
        <button
          onClick={() => onSelectMode('select')}
          className={cn(
            'w-full p-2 rounded-lg mb-1 transition-colors',
            mode === 'select' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          )}
          title="Select"
        >
          <MousePointer2 className="h-5 w-5 mx-auto" />
        </button>
        <button
          onClick={() => onSelectMode('move')}
          className={cn(
            'w-full p-2 rounded-lg mb-4 transition-colors',
            mode === 'move' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          )}
          title="Move"
        >
          <Move className="h-5 w-5 mx-auto" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2 mx-2" />

      {/* Element Types */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 px-1">
          {filteredItems.map((item) => {
            const Icon = getIcon(item)
            const isSelected = selectedType === item.type

            return (
              <button
                key={item.type || item.label}
                onClick={() => {
                  onSelectType(isSelected ? null : item.type || null)
                  if (item.mode) {
                    onSelectMode(item.mode)
                  }
                }}
                className={cn(
                  'w-full p-2 rounded-lg transition-colors',
                  isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5 mx-auto" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2 mx-2" />

      {/* Zoom Controls */}
      <div className="px-2 space-y-1">
        <div className="flex items-center justify-between px-1 mb-2">
          <button
            onClick={onZoomOut}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={zoom <= 0.5}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4 text-gray-600" />
          </button>
          <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
          <button
            onClick={onZoomIn}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={zoom >= 2}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        {/* Undo/Redo */}
        <div className="flex space-x-1">
          <button
            onClick={onUndo}
            className="flex-1 p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={!canUndo}
            title="Undo"
          >
            <Undo className="h-4 w-4 text-gray-600 mx-auto" />
          </button>
          <button
            onClick={onRedo}
            className="flex-1 p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={!canRedo}
            title="Redo"
          >
            <Redo className="h-4 w-4 text-gray-600 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  )
}
