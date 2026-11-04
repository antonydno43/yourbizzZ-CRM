'use client'

import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/ssr'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Save,
  Eye,
  Trash2,
  Copy,
  Undo,
  Redo,
  Layers,
  Settings,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Layout,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  X,
  MousePointer2,
  Move,
} from 'lucide-react'
import BuilderCanvas from '@/components/builder/builder-canvas'
import BuilderToolbar from '@/components/builder/builder-toolbar'
import BuilderPanel from '@/components/builder/builder-panel'
import BuilderProperties from '@/components/builder/builder-properties'
import BuilderLayers from '@/components/builder/builder-layers'
import { generateId } from '@/lib/utils'

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

interface WebsitePage {
  id: string
  name: string
  elements: ElementType[]
}

const initialElements: ElementType[] = [
  {
    id: generateId(),
    type: 'heading',
    content: { text: 'Welcome to YourBizz', level: 'h1' },
    styles: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
    },
    x: 50,
    y: 50,
    width: 400,
    height: 80,
    zIndex: 1,
    isSelected: false,
  },
  {
    id: generateId(),
    type: 'paragraph',
    content: { text: 'Build amazing websites with our drag and drop builder. No coding required.' },
    styles: {
      fontSize: '1rem',
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: '1.6',
    },
    x: 50,
    y: 150,
    width: 400,
    height: 60,
    zIndex: 1,
    isSelected: false,
  },
  {
    id: generateId(),
    type: 'button',
    content: { text: 'Get Started', href: '#' },
    styles: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 'medium',
      border: 'none',
      cursor: 'pointer',
    },
    x: 200,
    y: 250,
    width: 150,
    height: 50,
    zIndex: 1,
    isSelected: false,
  },
]

export default function BuilderPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [elements, setElements] = useState<ElementType[]>(initialElements)
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null)
  const [mode, setMode] = useState<'select' | 'add' | 'move'>('select')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showLayers, setShowLayers] = useState(true)
  const [showProperties, setShowProperties] = useState(true)
  const [history, setHistory] = useState<ElementType[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [pages, setPages] = useState<WebsitePage[]>([
    { id: generateId(), name: 'Home', elements: initialElements },
  ])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  // Save to history
  const saveToHistory = useCallback((currentElements: ElementType[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...currentElements])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Add element
  const addElement = useCallback((type: string, x: number, y: number) => {
    const newElement: ElementType = {
      id: generateId(),
      type: type as any,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      x,
      y,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      zIndex: Math.max(...elements.map((e) => e.zIndex), 0) + 1,
      isSelected: false,
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    setSelectedElement(newElement)
    saveToHistory(newElements)
  }, [elements, saveToHistory])

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<ElementType>) => {
    const newElements = elements.map((element) =>
      element.id === id ? { ...element, ...updates } : element
    )
    setElements(newElements)
    saveToHistory(newElements)
  }, [elements, saveToHistory])

  // Delete element
  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter((element) => element.id !== id)
    setElements(newElements)
    setSelectedElement(null)
    saveToHistory(newElements)
  }, [elements, saveToHistory])

  // Select element
  const selectElement = useCallback((id: string | null) => {
    const newElements = elements.map((element) => ({
      ...element,
      isSelected: element.id === id,
    }))
    setElements(newElements)
    setSelectedElement(newElements.find((e) => e.id === id) || null)
  }, [elements])

  // Duplicate element
  const duplicateElement = useCallback(() => {
    if (!selectedElement) return

    const newElement = {
      ...selectedElement,
      id: generateId(),
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      isSelected: false,
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    setSelectedElement(newElement)
    saveToHistory(newElements)
  }, [selectedElement, elements, saveToHistory])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
      setSelectedElement(null)
    }
  }, [history, historyIndex])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
      setSelectedElement(null)
    }
  }, [history, historyIndex])

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (mode === 'add' && selectedType) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom

      addElement(selectedType, x, y)
      setMode('select')
      setSelectedType(null)
    } else if (mode === 'select') {
      selectElement(null)
    }
  }, [mode, selectedType, zoom, addElement, selectElement])

  // Handle element drag
  const handleElementDragStart = useCallback((id: string, e: React.MouseEvent) => {
    if (mode !== 'select') return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsDragging(true)
    setStartPos({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    })
    setCurrentPos(startPos)
  }, [mode, zoom, startPos])

  const handleElementDrag = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedElement) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    setCurrentPos({ x, y })

    // Update element position in real-time
    const dx = x - startPos.x
    const dy = y - startPos.y

    updateElement(selectedElement.id, {
      x: selectedElement.x + dx,
      y: selectedElement.y + dy,
    })

    setStartPos({ x, y })
  }, [isDragging, selectedElement, zoom, startPos, updateElement])

  const handleElementDragEnd = useCallback(() => {
    setIsDragging(false)
    saveToHistory(elements)
  }, [elements, saveToHistory])

  // Handle canvas mouse move
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom

      setCurrentPos({ x, y })
    }
  }, [isDragging, zoom])

  // Handle canvas mouse up
  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false)
    if (selectedElement) {
      saveToHistory(elements)
    }
  }, [elements, selectedElement, saveToHistory])

  // Handle zoom
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
      // Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          e.preventDefault()
          deleteElement(selectedElement.id)
        }
      }
      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        duplicateElement()
      }
      // Escape
      if (e.key === 'Escape') {
        selectElement(null)
        setMode('select')
        setSelectedType(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElement, undo, redo, deleteElement, duplicateElement, selectElement])

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleElementDrag)
      document.addEventListener('mouseup', handleElementDragEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleElementDrag)
      document.removeEventListener('mouseup', handleElementDragEnd)
    }
  }, [isDragging, handleElementDrag, handleElementDragEnd])

  // Save page
  const savePage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get or create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (workspaceError && !workspace) {
        // Create workspace if it doesn't exist
        const { data: newWorkspace, error: createError } = await supabase
          .from('workspaces')
          .insert({
            name: 'My Workspace',
            owner_id: user.id,
          })
          .select()
          .single()

        if (createError) throw createError
      }

      // Save page
      const pageData = {
        name: pages[currentPageIndex].name,
        content: { elements },
        layout: { zoom },
      }

      toast.success({
        title: 'Page saved',
        description: 'Your page has been saved successfully',
      })
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error({
        title: 'Error',
        description: 'Failed to save page',
      })
    }
  }

  // Load page
  const loadPage = async () => {
    // Load logic would go here
  }

  // Helper functions for default element properties
  function getDefaultContent(type: string) {
    switch (type) {
      case 'heading':
        return { text: 'Heading', level: 'h2' }
      case 'paragraph':
        return { text: 'Paragraph text' }
      case 'button':
        return { text: 'Button', href: '#' }
      case 'image':
        return { src: '', alt: 'Image' }
      case 'divider':
        return { style: 'solid', thickness: 1, color: '#e5e7eb' }
      case 'container':
        return { elements: [] }
      case 'link':
        return { text: 'Link', href: '#' }
      case 'list':
        return { items: ['Item 1', 'Item 2', 'Item 3'], style: 'unordered' }
      default:
        return { text: type }
    }
  }

  function getDefaultStyles(type: string) {
    switch (type) {
      case 'heading':
        return {
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'left',
        }
      case 'paragraph':
        return {
          fontSize: '1rem',
          color: '#6b7280',
          textAlign: 'left',
          lineHeight: '1.6',
        }
      case 'button':
        return {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'medium',
          border: 'none',
          cursor: 'pointer',
        }
      case 'image':
        return {
          width: '100%',
          height: 'auto',
          borderRadius: '0',
        }
      case 'divider':
        return {
          width: '100%',
          height: '1px',
          backgroundColor: '#e5e7eb',
        }
      case 'container':
        return {
          backgroundColor: 'transparent',
          padding: '20px',
          border: '1px dashed #e5e7eb',
          borderRadius: '8px',
        }
      case 'link':
        return {
          color: '#2563eb',
          textDecoration: 'underline',
          fontSize: '1rem',
        }
      case 'list':
        return {
          fontSize: '1rem',
          color: '#1f2937',
          lineHeight: '1.6',
        }
      default:
        return {}
    }
  }

  function getDefaultWidth(type: string) {
    switch (type) {
      case 'heading':
        return 300
      case 'paragraph':
        return 400
      case 'button':
        return 150
      case 'image':
        return 300
      case 'divider':
        return 400
      case 'container':
        return 500
      case 'link':
        return 200
      case 'list':
        return 400
      default:
        return 200
    }
  }

  function getDefaultHeight(type: string) {
    switch (type) {
      case 'heading':
        return 50
      case 'paragraph':
        return 80
      case 'button':
        return 50
      case 'image':
        return 200
      case 'divider':
        return 1
      case 'container':
        return 300
      case 'link':
        return 30
      case 'list':
        return 100
      default:
        return 50
    }
  }

  const toolbarItems = [
    { type: 'select', icon: MousePointer2, label: 'Select', mode: 'select' },
    { type: 'move', icon: Move, label: 'Move', mode: 'move' },
    { type: 'divider', label: 'Divider' },
    { type: 'heading', icon: Type, label: 'Heading' },
    { type: 'paragraph', icon: AlignLeft, label: 'Paragraph' },
    { type: 'button', icon: Square, label: 'Button' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'container', icon: Layout, label: 'Container' },
    { type: 'divider', label: 'Divider' },
    { type: 'link', icon: LinkIcon, label: 'Link' },
    { type: 'list', icon: Grid3X3, label: 'List' },
  ]

  const formatTextItems = [
    { icon: Bold, label: 'Bold', action: 'bold' },
    { icon: Italic, label: 'Italic', action: 'italic' },
    { icon: Underline, label: 'Underline', action: 'underline' },
    { icon: LinkIcon, label: 'Link', action: 'link' },
    { icon: AlignLeft, label: 'Left', action: 'left' },
    { icon: AlignCenter, label: 'Center', action: 'center' },
    { icon: AlignRight, label: 'Right', action: 'right' },
  ]

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Toolbar */}
      <BuilderToolbar
        items={toolbarItems}
        selectedType={selectedType}
        mode={mode}
        onSelectType={(type) => {
          setSelectedType(type)
          setMode(type ? 'add' : 'select')
        }}
        onSelectMode={setMode}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Canvas */}
      <BuilderCanvas
        ref={canvasRef}
        elements={elements}
        selectedElement={selectedElement}
        mode={mode}
        zoom={zoom}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onElementClick={(id) => selectElement(id)}
        onElementDragStart={handleElementDragStart}
      />

      {/* Right Panels */}
      <div className="flex flex-col border-l border-gray-200 bg-white">
        {/* Format Text Toolbar */}
        {selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'paragraph') && (
          <div className="p-2 border-b border-gray-200">
            <div className="flex space-x-1">
              {formatTextItems.map((item) => (
                <button
                  key={item.action}
                  className="p-2 rounded hover:bg-gray-100"
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs for Properties/Layers */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${showProperties ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setShowProperties(true)}
          >
            Properties
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${!showProperties ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setShowProperties(false)}
          >
            Layers
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {showProperties ? (
            <BuilderProperties
              element={selectedElement}
              onUpdate={(updates) => {
                if (selectedElement) {
                  updateElement(selectedElement.id, updates)
                }
              }}
            />
          ) : (
            <BuilderLayers
              elements={elements}
              selectedElement={selectedElement}
              onSelect={selectElement}
              onDelete={deleteElement}
              onDuplicate={duplicateElement}
            />
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => addElement('button', 100, 100)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add Element
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={savePage}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              <Save className="h-4 w-4 inline mr-1" />
              Save
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
              <Eye className="h-4 w-4 inline mr-1" />
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
