'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/hooks/use-toast'
import {
  Users,
  Building2,
  Handshake,
  Pipeline,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Tag,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, getInitials, capitalizeFirstLetter } from '@/lib/utils'

interface Contact {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  company: string | null
  status: 'lead' | 'contact' | 'customer' | 'inactive'
  lead_score: number | null
  created_at: string
  tags: string[]
}

interface Stats {
  total: number
  leads: number
  contacts: number
  customers: number
  newThisWeek: number
}

function StatCard({ label, value, icon: Icon, color, change }: { label: string; value: number; icon: React.ElementType; color: string; change?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs text-green-600 mt-1">+{change} this week</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

function ContactCard({ contact, onEdit, onDelete, onView }: { contact: Contact; onEdit: (contact: Contact) => void; onDelete: (id: string) => void; onView: (contact: Contact) => void }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-blue-600">{getInitials(`${contact.first_name} ${contact.last_name || ''}`)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {contact.first_name} {contact.last_name}
              </h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                {capitalizeFirstLetter(contact.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500">{contact.email}</p>
            {contact.company && <p className="text-sm text-gray-400">{contact.company}</p>}
            {contact.phone && <p className="text-sm text-gray-400">{contact.phone}</p>}
            {contact.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  onView(contact)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                View
              </button>
              <button
                onClick={() => {
                  onEdit(contact)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(contact.id)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 text-left"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'customer':
      return 'bg-green-100 text-green-800'
    case 'contact':
      return 'bg-blue-100 text-blue-800'
    case 'lead':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function QuickAction({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="p-3 rounded-lg bg-blue-100 mb-2">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  )
}

export default function CRMPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, leads: 0, contacts: 0, customers: 0, newThisWeek: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [supabase])

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error({
        title: 'Error',
        description: 'Failed to load contacts',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch all contacts
      const { data: allContacts, error } = await supabase
        .from('contacts')
        .select('*')

      if (error) throw error

      const total = allContacts?.length || 0
      const leads = allContacts?.filter(c => c.status === 'lead').length || 0
      const contactsCount = allContacts?.filter(c => c.status === 'contact').length || 0
      const customers = allContacts?.filter(c => c.status === 'customer').length || 0

      // Calculate new this week
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const newThisWeek = allContacts?.filter(c => new Date(c.created_at) >= oneWeekAgo).length || 0

      setStats({ total, leads, contacts: contactsCount, customers, newThisWeek })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success({
        title: 'Contact deleted',
        description: 'The contact has been successfully deleted',
      })
      fetchContacts()
      fetchStats()
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error({
        title: 'Error',
        description: 'Failed to delete contact',
      })
    } finally {
      setShowDeleteModal(false)
      setContactToDelete(null)
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = !searchQuery || 
      contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !selectedStatus || contact.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const handleEdit = (contact: Contact) => {
    router.push(`/dashboard/crm/contacts/${contact.id}/edit`)
  }

  const handleView = (contact: Contact) => {
    router.push(`/dashboard/crm/contacts/${contact.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-500">Manage your contacts, companies, and deals</p>
        </div>
        <Link
          href="/dashboard/crm/contacts/new"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Contact</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Contacts" value={stats.total} icon={Users} color="bg-blue-500" change={String(stats.newThisWeek)} />
        <StatCard label="Leads" value={stats.leads} icon={TrendingUp} color="bg-yellow-500" />
        <StatCard label="Contacts" value={stats.contacts} icon={Users} color="bg-blue-500" />
        <StatCard label="Customers" value={stats.customers} icon={Handshake} color="bg-green-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <QuickAction icon={Users} label="Add Contact" href="/dashboard/crm/contacts/new" />
        <QuickAction icon={Building2} label="Add Company" href="/dashboard/crm/companies/new" />
        <QuickAction icon={Handshake} label="Add Deal" href="/dashboard/crm/deals/new" />
        <QuickAction icon={Pipeline} label="Manage Pipelines" href="/dashboard/crm/pipelines" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search contacts..."
              />
            </div>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
          <Link href="/dashboard/crm/contacts" className="text-sm text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery || selectedStatus ? 'No contacts match your filters' : 'Get started by adding your first contact'}
            </p>
            <Link
              href="/dashboard/crm/contacts/new"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.slice(0, 6).map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEdit}
                onDelete={(id) => {
                  setContactToDelete(id)
                  setShowDeleteModal(true)
                }}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contact</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setContactToDelete(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => contactToDelete && handleDelete(contactToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
