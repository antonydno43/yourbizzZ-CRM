'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/hooks/use-toast'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  ShoppingCart,
  Package,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  HelpCircle,
  User,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Sidebar from './sidebar'
import Header from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error({
        title: 'Logout failed',
        description: 'An error occurred while logging out',
      })
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard' || pathname === '/dashboard/' || pathname.startsWith('/dashboard/overview'),
    },
    {
      name: 'CRM',
      href: '/dashboard/crm',
      icon: Users,
      isActive: pathname.startsWith('/dashboard/crm'),
      children: [
        { name: 'Contacts', href: '/dashboard/crm/contacts' },
        { name: 'Companies', href: '/dashboard/crm/companies' },
        { name: 'Deals', href: '/dashboard/crm/deals' },
        { name: 'Pipelines', href: '/dashboard/crm/pipelines' },
      ],
    },
    {
      name: 'Website Builder',
      href: '/dashboard/builder',
      icon: FileText,
      isActive: pathname.startsWith('/dashboard/builder'),
    },
    {
      name: 'Booking',
      href: '/dashboard/booking',
      icon: Calendar,
      isActive: pathname.startsWith('/dashboard/booking'),
      children: [
        { name: 'Services', href: '/dashboard/booking/services' },
        { name: 'Staff', href: '/dashboard/booking/staff' },
        { name: 'Appointments', href: '/dashboard/booking/appointments' },
        { name: 'Availability', href: '/dashboard/booking/availability' },
      ],
    },
    {
      name: 'Forms',
      href: '/dashboard/forms',
      icon: FileText,
      isActive: pathname.startsWith('/dashboard/forms'),
    },
    {
      name: 'E-commerce',
      href: '/dashboard/ecommerce',
      icon: ShoppingCart,
      isActive: pathname.startsWith('/dashboard/ecommerce'),
      children: [
        { name: 'Products', href: '/dashboard/ecommerce/products' },
        { name: 'Categories', href: '/dashboard/ecommerce/categories' },
        { name: 'Orders', href: '/dashboard/ecommerce/orders' },
        { name: 'Discounts', href: '/dashboard/ecommerce/discounts' },
      ],
    },
    {
      name: 'Inventory',
      href: '/dashboard/inventory',
      icon: Package,
      isActive: pathname.startsWith('/dashboard/inventory'),
      children: [
        { name: 'Stock', href: '/dashboard/inventory/stock' },
        { name: 'Transactions', href: '/dashboard/inventory/transactions' },
        { name: 'Locations', href: '/dashboard/inventory/locations' },
        { name: 'Suppliers', href: '/dashboard/inventory/suppliers' },
      ],
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      isActive: pathname.startsWith('/dashboard/settings'),
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isMobileSidebarOpen ? 'block' : 'hidden'}`}
        onClick={toggleMobileSidebar}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: isSidebarOpen ? '260px' : '80px' }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          navigationItems={navigationItems}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 lg:ml-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[80px]'}`}
      >
        {/* Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onMenuClick={toggleMobileSidebar}
          user={user}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
