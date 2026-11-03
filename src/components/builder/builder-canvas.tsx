'use client'

import * as React from 'react'
import { forwardRef } from 'react'
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

interface BuilderCanvasProps {
  elements: ElementType[]
  selectedElement: ElementType | null
  mode: 'select' | 'add' | 'move'
  zoom: number
  onClick: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onElementClick: (id: string | null) => void
  onElementDragStart: (id: string, e: React.MouseEvent) => void
}

const BuilderCanvas = forwardRef<HTMLDivElement, BuilderCanvasProps>(
  (
    {
      elements,
      selectedElement,
      mode,
      zoom,
      onClick,
      onMouseMove,
      onMouseUp,
      onElementClick,
      onElementDragStart,
    },
    ref
  ) => {
    const renderElement = (element: ElementType) => {
      const { x, y, width, height, zIndex, isSelected, type, content, styles } = element

      const baseStyles: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        cursor: mode === 'select' ? 'move' : 'default',
      }

      const selectedStyles: React.CSSProperties = {
        outline: isSelected ? '2px solid #2563eb' : 'none',
        outlineOffset: isSelected ? '2px' : '0',
      }

      switch (type) {
        case 'heading':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <h2
                style={{
                  fontSize: styles.fontSize || '1.875rem',
                  fontWeight: styles.fontWeight || 'bold',
                  color: styles.color || '#1f2937',
                  textAlign: styles.textAlign || 'left',
                  margin: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: getJustifyContent(styles.textAlign),
                }}
              >
                {content.text || 'Heading'}
              </h2>
            </div>
          )

        case 'paragraph':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <p
                style={{
                  fontSize: styles.fontSize || '1rem',
                  color: styles.color || '#6b7280',
                  textAlign: styles.textAlign || 'left',
                  lineHeight: styles.lineHeight || '1.6',
                  margin: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: getJustifyContent(styles.textAlign),
                }}
              >
                {content.text || 'Paragraph'}
              </p>
            </div>
          )

        case 'button':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <button
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: styles.backgroundColor || '#2563eb',
                  color: styles.color || '#ffffff',
                  padding: styles.padding || '12px 24px',
                  borderRadius: styles.borderRadius || '8px',
                  fontSize: styles.fontSize || '1rem',
                  fontWeight: styles.fontWeight || 'medium',
                  border: styles.border || 'none',
                  cursor: 'pointer',
                }}
              >
                {content.text || 'Button'}
              </button>
            </div>
          )

        case 'image':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f3f4f6',
                  borderRadius: styles.borderRadius || '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                }}
              >
                {content.src ? 'Image' : 'Upload Image'}
              </div>
            </div>
          )

        case 'divider':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <hr
                style={{
                  width: '100%',
                  height: styles.height || '1px',
                  backgroundColor: styles.backgroundColor || '#e5e7eb',
                  border: 'none',
                }}
              />
            </div>
          )

        case 'container':
          return (
            <div
              key={element.id}
              style={{
                ...baseStyles,
                ...selectedStyles,
                backgroundColor: styles.backgroundColor || 'transparent',
                padding: styles.padding || '20px',
                border: styles.border || '1px dashed #e5e7eb',
                borderRadius: styles.borderRadius || '8px',
              }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Container
              </p>
            </div>
          )

        case 'link':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <a
                href={content.href || '#'}
                onClick={(e) => e.preventDefault()}
                style={{
                  color: styles.color || '#2563eb',
                  textDecoration: styles.textDecoration || 'underline',
                  fontSize: styles.fontSize || '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: getJustifyContent(styles.textAlign),
                  width: '100%',
                  height: '100%',
                }}
              >
                {content.text || 'Link'}
              </a>
            </div>
          )

        case 'list':
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <ul
                style={{
                  fontSize: styles.fontSize || '1rem',
                  color: styles.color || '#1f2937',
                  lineHeight: styles.lineHeight || '1.6',
                  margin: 0,
                  paddingLeft: '1.5rem',
                  width: '100%',
                }}
              >
                {(content.items || ['Item 1', 'Item 2', 'Item 3']).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )

        default:
          return (
            <div
              key={element.id}
              style={{ ...baseStyles, ...selectedStyles }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick(element.id)
              }}
              onMouseDown={(e) => {
                if (mode === 'select') {
                  e.stopPropagation()
                  onElementDragStart(element.id, e)
                }
              }}
            >
              <p style={{ margin: 0, padding: '8px' }}>{type}</p>
            </div>
          )
      }
    }

    function getJustifyContent(align?: string) {
      switch (align) {
        case 'left':
          return 'flex-start'
        case 'center':
          return 'center'
        case 'right':
          return 'flex-end'
        default:
          return 'flex-start'
      }
    }

    return (
      <div
        ref={ref}
        className="flex-1 bg-white border-r border-gray-200 overflow-hidden relative"
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{ cursor: mode === 'add' ? 'crosshair' : 'default' }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 bg-gray-50"
          style={{
            backgroundImage: `linear-gradient(to right, #f3f4f6 1px, transparent 1px), linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Canvas content */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(renderElement)}
        </div>

        {/* Add element indicator */}
        {mode === 'add' && selectedType && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-blue-50 opacity-50" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Click to add {selectedType}
            </div>
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm text-gray-600">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    )
  }
)

BuilderCanvas.displayName = 'BuilderCanvas'

export default BuilderCanvas
