'use client'

import * as React from 'react'
import { useState } from 'react'
import { cn, formatCurrency, getRandomColor } from '@/lib/utils'
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Square, Palette, Text, Layout, List, Trash2, Copy, Eye, EyeOff } from 'lucide-react'

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

interface BuilderPropertiesProps {
  element: ElementType | null
  onUpdate: (updates: Partial<ElementType>) => void
}

export default function BuilderProperties({ element, onUpdate }: BuilderPropertiesProps) {
  const [activeTab, setActiveTab] = useState('content')

  if (!element) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select an element to edit its properties</p>
      </div>
    )
  }

  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      styles: {
        ...element.styles,
        [key]: value,
      },
    })
  }

  const handleContentChange = (key: string, value: any) => {
    onUpdate({
      content: {
        ...element.content,
        [key]: value,
      },
    })
  }

  const handlePositionChange = (key: 'x' | 'y' | 'width' | 'height', value: number) => {
    onUpdate({ [key]: value })
  }

  const getIcon = () => {
    switch (element.type) {
      case 'heading':
        return Type
      case 'paragraph':
        return Text
      case 'button':
        return Square
      case 'image':
        return ImageIcon
      case 'divider':
        return Layout
      case 'container':
        return Layout
      case 'list':
        return List
      case 'link':
        return LinkIcon
      default:
        return Square
    }
  }

  const Icon = getIcon()

  return (
    <div className="w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{element.type}</h3>
            <p className="text-xs text-gray-500">Element ID: {element.id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'content' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'styles' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('styles')}
        >
          Styles
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'layout' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('layout')}
        >
          Layout
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="p-4 space-y-4">
          {element.type === 'heading' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <input
                type="text"
                value={element.content.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter heading text"
              />
              <select
                value={element.content.level || 'h2'}
                onChange={(e) => handleContentChange('level', e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
              </select>
            </div>
          )}

          {element.type === 'paragraph' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <textarea
                value={element.content.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Enter paragraph text"
              />
            </div>
          )}

          {element.type === 'button' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  value={element.content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={element.content.href || ''}
                  onChange={(e) => handleContentChange('href', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link URL"
                />
              </div>
            </div>
          )}

          {element.type === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Source</label>
                <input
                  type="text"
                  value={element.content.src || ''}
                  onChange={(e) => handleContentChange('src', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={element.content.alt || ''}
                  onChange={(e) => handleContentChange('alt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter alt text"
                />
              </div>
              <button className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Upload Image
              </button>
            </div>
          )}

          {element.type === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  value={element.content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={element.content.href || ''}
                  onChange={(e) => handleContentChange('href', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter URL"
                />
              </div>
            </div>
          )}

          {element.type === 'list' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">List Style</label>
                <select
                  value={element.content.style || 'unordered'}
                  onChange={(e) => handleContentChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unordered">Bullet List</option>
                  <option value="ordered">Numbered List</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                {(element.content.items || []).map((item: string, index: number) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(element.content.items || [])]
                        newItems[index] = e.target.value
                        handleContentChange('items', newItems)
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const newItems = [...(element.content.items || [])]
                        newItems.splice(index, 1)
                        handleContentChange('items', newItems)
                      }}
                      className="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...(element.content.items || []), `Item ${(element.content.items || []).length + 1}`]
                    handleContentChange('items', newItems)
                  }}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Add Item
                </button>
              </div>
            </div>
          )}

          {element.type === 'divider' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={element.content.style || 'solid'}
                  onChange={(e) => handleContentChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thickness</label>
                <input
                  type="number"
                  value={element.content.thickness || 1}
                  onChange={(e) => handleContentChange('thickness', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={element.content.color || '#e5e7eb'}
                    onChange={(e) => handleContentChange('color', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">{element.content.color || '#e5e7eb'}</span>
                </div>
              </div>
            </div>
          )}

          {element.type === 'container' && (
            <div>
              <p className="text-sm text-gray-500">Container elements can hold other elements</p>
            </div>
          )}
        </div>
      )}

      {/* Styles Tab */}
      {activeTab === 'styles' && (
        <div className="p-4 space-y-4">
          {/* Typography */}
          {(element.type === 'heading' || element.type === 'paragraph' || element.type === 'button' || element.type === 'link' || element.type === 'list') && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Typography</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <select
                  value={element.styles.fontSize || ''}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0.875rem">Small</option>
                  <option value="1rem">Medium</option>
                  <option value="1.25rem">Large</option>
                  <option value="1.875rem">X-Large</option>
                  <option value="2.5rem">XX-Large</option>
                  <option value="">Custom</option>
                </select>
                {(!element.styles.fontSize || ['0.875rem', '1rem', '1.25rem', '1.875rem', '2.5rem'].includes(element.styles.fontSize)) && (
                  <input
                    type="text"
                    value={element.styles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter custom size (e.g., 16px, 1rem)"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                <select
                  value={element.styles.fontWeight || ''}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="medium">Medium</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={element.styles.color || '#1f2937'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">{element.styles.color || '#1f2937'}</span>
                </div>
              </div>

              {(element.type === 'heading' || element.type === 'paragraph' || element.type === 'link' || element.type === 'list') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                  <div className="flex space-x-1">
                    {[
                      { value: 'left', icon: AlignLeft, label: 'Left' },
                      { value: 'center', icon: AlignCenter, label: 'Center' },
                      { value: 'right', icon: AlignRight, label: 'Right' },
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => handleStyleChange('textAlign', value)}
                        className={cn(
                          'p-2 rounded-lg hover:bg-gray-100',
                          element.styles.textAlign === value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        )}
                        title={label}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(element.type === 'paragraph' || element.type === 'list') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
                  <select
                    value={element.styles.lineHeight || ''}
                    onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Default</option>
                    <option value="1.2">Tight</option>
                    <option value="1.5">Normal</option>
                    <option value="1.6">Relaxed</option>
                    <option value="2">Loose</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Background & Borders */}
          {(element.type === 'button' || element.type === 'container' || element.type === 'divider' || element.type === 'image') && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Background & Borders</h4>
              
              {(element.type === 'button' || element.type === 'container') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={element.styles.backgroundColor || (element.type === 'button' ? '#2563eb' : 'transparent')}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">{element.styles.backgroundColor || (element.type === 'button' ? '#2563eb' : 'transparent')}</span>
                  </div>
                </div>
              )}

              {(element.type === 'button' || element.type === 'container') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                  <select
                    value={element.styles.borderRadius || ''}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    <option value="4px">Small</option>
                    <option value="8px">Medium</option>
                    <option value="12px">Large</option>
                    <option value="50%">Circle</option>
                  </select>
                </div>
              )}

              {element.type === 'button' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Border</label>
                  <select
                    value={element.styles.border || ''}
                    onChange={(e) => handleStyleChange('border', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    <option value="1px solid #e5e7eb">Thin</option>
                    <option value="2px solid #e5e7eb">Medium</option>
                    <option value="3px solid #e5e7eb">Thick</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Layout */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Layout</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display</label>
              <select
                value={element.styles.display || ''}
                onChange={(e) => handleStyleChange('display', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="block">Block</option>
                <option value="inline-block">Inline Block</option>
              </select>
            </div>

            {element.styles.display === 'flex' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flex Direction</label>
                <select
                  value={element.styles.flexDirection || ''}
                  onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Default</option>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                  <option value="row-reverse">Row Reverse</option>
                  <option value="column-reverse">Column Reverse</option>
                </select>
              </div>
            )}

            {(element.styles.display === 'flex' || element.styles.display === 'grid') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justify Content</label>
                <select
                  value={element.styles.justifyContent || ''}
                  onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Default</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                </select>
              </div>
            )}

            {(element.styles.display === 'flex' || element.styles.display === 'grid') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Align Items</label>
                <select
                  value={element.styles.alignItems || ''}
                  onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Default</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="stretch">Stretch</option>
                </select>
              </div>
            )}
          </div>

          {/* Spacing */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Spacing</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
                <input
                  type="text"
                  value={element.styles.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
                <input
                  type="text"
                  value={element.styles.margin || ''}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  value={element.x}
                  onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  value={element.y}
                  onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <input
                  type="number"
                  value={element.width}
                  onChange={(e) => handlePositionChange('width', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <input
                  type="number"
                  value={element.height}
                  onChange={(e) => handlePositionChange('height', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
            <input
              type="number"
              value={element.zIndex}
              onChange={(e) => handlePositionChange('zIndex', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
