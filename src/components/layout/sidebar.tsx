'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react'
import Image from 'next/image'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  isActive?: boolean
  children?: { name: string; href: string }[]
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  navigationItems: NavigationItem[]
  user: any
  onLogout: () => void
}

export default function Sidebar({
  isOpen,
  onToggle,
  navigationItems,
  user,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen ? (
          <>
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="YourBizz Logo"
                width={40}
                height={40}
                className="w-10 h-10"
                priority
              />
              <span className="font-bold text-xl text-gray-900">YourBizz</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
          </>
        ) : (
          <>
            <Image
              src="/logo.svg"
              alt="YourBizz Logo"
              width={40}
              height={40}
              className="w-10 h-10 mx-auto"
              priority
            />
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems[item.name]
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) || item.isActive

            return (
              <div key={item.name} className="mb-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault()
                      toggleExpand(item.name)
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 mr-3 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    )}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {hasChildren && (
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isExpanded && 'rotate-90'
                          )}
                        />
                      )}
                    </>
                  )}
                  {hasChildren && isOpen && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children?.map((child) => {
                        const childIsActive = pathname === child.href || pathname.startsWith(`${child.href}/`)
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'block px-3 py-1.5 rounded-lg text-sm transition-colors',
                              childIsActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                          >
                            <span className="ml-2">{child.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </Link>
              </div>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-2 border-t border-gray-200">
        {isOpen ? (
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg hover:bg-gray-200"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg hover:bg-gray-200"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
