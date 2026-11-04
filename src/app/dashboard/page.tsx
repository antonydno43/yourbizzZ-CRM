'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/ssr'
import { useToast } from '@/hooks/use-toast'
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingCart,
  Package,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate, generateId } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  change?: string
  changeType?: 'increase' | 'decrease'
}

function StatCard({ title, value, icon: Icon, color, change, changeType }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  href: string
}

function QuickAction({ title, description, icon: Icon, color, href }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  )
}

interface RecentActivityProps {
  activities: {
    id: string
    title: string
    description: string
    time: string
    type: 'contact' | 'booking' | 'order' | 'form'
  }[]
}

function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return Users
      case 'booking':
        return Calendar
      case 'order':
        return ShoppingCart
      case 'form':
        return FileText
      default:
        return Activity
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <Link
          href="/dashboard/activity"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type)
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ChartProps {
  data: { name: string; value: number }[]
  title: string
}

function SimpleChart({ data, title }: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="flex items-end justify-between h-40 space-x-2">
        {data.map((d) => (
          <div key={d.name} className="flex-1 flex flex-col items-center">
            <div
              className="bg-blue-500 rounded-t-lg w-full"
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            />
            <p className="text-xs text-gray-500 mt-2 truncate w-full text-center">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    contacts: 0,
    appointments: 0,
    orders: 0,
    revenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch contacts count
        const { count: contactsCount } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })

        // Fetch appointments count
        const { count: appointmentsCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })

        // Fetch orders count
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })

        // Fetch revenue
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total')
          .eq('payment_status', 'paid')

        const revenue = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

        setStats({
          contacts: contactsCount || 0,
          appointments: appointmentsCount || 0,
          orders: ordersCount || 0,
          revenue,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error({
          title: 'Error',
          description: 'Failed to load dashboard data',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [supabase, toast])

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.contacts,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      title: 'Appointments',
      value: stats.appointments,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase' as const,
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'increase' as const,
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats.revenue),
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase' as const,
    },
  ]

  const quickActions = [
    {
      title: 'Add Contact',
      description: 'Add a new contact to your CRM',
      icon: Users,
      color: 'bg-blue-500',
      href: '/dashboard/crm/contacts/new',
    },
    {
      title: 'Create Booking',
      description: 'Schedule a new appointment',
      icon: Calendar,
      color: 'bg-green-500',
      href: '/dashboard/booking/appointments/new',
    },
    {
      title: 'Add Product',
      description: 'Add a new product to your store',
      icon: Package,
      color: 'bg-orange-500',
      href: '/dashboard/ecommerce/products/new',
    },
    {
      title: 'Create Form',
      description: 'Create a new form for your website',
      icon: FileText,
      color: 'bg-purple-500',
      href: '/dashboard/forms/new',
    },
  ]

  const recentActivities = [
    {
      id: generateId(),
      title: 'New contact added',
      description: 'John Doe has been added to your contacts',
      time: '5 min ago',
      type: 'contact' as const,
    },
    {
      id: generateId(),
      title: 'Appointment booked',
      description: 'Meeting with Jane Smith at 2:00 PM',
      time: '1 hour ago',
      type: 'booking' as const,
    },
    {
      id: generateId(),
      title: 'Order received',
      description: 'New order #1234 for $299.99',
      time: '2 hours ago',
      type: 'order' as const,
    },
    {
      id: generateId(),
      title: 'Form submitted',
      description: 'Contact form submitted by visitor',
      time: '3 hours ago',
      type: 'form' as const,
    },
  ]

  const chartData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 1500 },
    { name: 'Apr', value: 2100 },
    { name: 'May', value: 2500 },
    { name: 'Jun', value: 2800 },
    { name: 'Jul', value: 3200 },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100">Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Today
            </button>
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SimpleChart data={chartData} title="Revenue Overview" />
        <SimpleChart
          data={[
            { name: 'Contacts', value: 120 },
            { name: 'Appointments', value: 80 },
            { name: 'Orders', value: 60 },
            { name: 'Forms', value: 40 },
          ]}
          title="Activities"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  )
}
