'use client'

import * as React from 'react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Bell, Search, HelpCircle, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  isSidebarOpen: boolean
  onMenuClick: () => void
  user: any
  onLogout: () => void
}

export default function Header({
  isSidebarOpen,
  onMenuClick,
  user,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const getPageTitle = () => {
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length === 0) return 'Dashboard'
    
    const lastPart = pathParts[pathParts.length - 1]
    return lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const notifications = [
    { id: 1, title: 'New contact added', time: '5 min ago', unread: true },
    { id: 2, title: 'Appointment booked', time: '1 hour ago', unread: false },
    { id: 3, title: 'Order received', time: '2 hours ago', unread: true },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 transition-all duration-300">
      <div
        className={`flex items-center justify-between h-full px-4 lg:px-6 ${isSidebarOpen ? 'lg:pl-0' : 'lg:pl-20'}`}
        style={{ width: isSidebarOpen ? 'calc(100% - 260px)' : 'calc(100% - 80px)' }}
      >
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-gray-100 hidden md:block">
            <HelpCircle className="h-5 w-5 text-gray-500" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start">
                        {notification.unread && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                        )}
                        <div className={notification.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <Link
                    href="/dashboard/notifications"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.name || user?.email || 'User'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/settings/billing"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Billing
                  </Link>
                </div>
                <div className="border-t border-gray-200 pt-1">
                  <button
                    onClick={() => {
                      onLogout()
                      setIsProfileOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
