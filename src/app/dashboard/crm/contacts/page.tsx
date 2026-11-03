'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/hooks/use-toast'
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, getInitials, capitalizeFirstLetter } from '@/lib/utils'

interface Contact {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  mobile: string | null
  company: string | null
  job_title: string | null
  status: 'lead' | 'contact' | 'customer' | 'inactive'
  lead_score: number | null
  created_at: string
  updated_at: string
  tags: string[]
  assigned_to: string | null
}

interface Column {
  key: string
  label: string
  sortable: boolean
  width?: string
}

const columns: Column[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lead_score', label: 'Lead Score', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false, width: '100px' },
]

function DataTable({
  contacts,
  onEdit,
  onDelete,
  onView,
  onSort,
  sortBy,
  sortOrder,
}: {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
  onView: (contact: Contact) => void
  onSort: (key: string) => void
  sortBy: string | null
  sortOrder: 'asc' | 'desc' | null
}) {
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortBy) return 0
    
    const aVal = a[sortBy as keyof Contact]
    const bVal = b[sortBy as keyof Contact]
    
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                style={{ width: column.width || 'auto' }}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && (
                    <button
                      onClick={() => onSort(column.key)}
                      className="ml-1 p-0.5 rounded hover:bg-gray-200"
                    >
                      {sortBy === column.key && (
                        <span className="text-gray-500">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">
                      {getInitials(`${contact.first_name} ${contact.last_name || ''}`)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-gray-900">{contact.email}</p>
              </td>
              <td className="px-4 py-3">
                {contact.company && (
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{contact.company}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                {contact.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{contact.phone}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                  {capitalizeFirstLetter(contact.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                {contact.lead_score !== null && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-900">{contact.lead_score}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-500">{formatDate(contact.created_at)}</span>
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === contact.id ? null : contact.id)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  {showMenu === contact.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          onView(contact)
                          setShowMenu(null)
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        <Eye className="h-4 w-4 inline mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          onEdit(contact)
                          setShowMenu(null)
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        <Edit className="h-4 w-4 inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(contact.id)
                          setShowMenu(null)
                        }}
                        className="w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 text-left"
                      >
                        <Trash2 className="h-4 w-4 inline mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default function ContactsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('desc')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchContacts()
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

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
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

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)

  const handleEdit = (contact: Contact) => {
    router.push(`/dashboard/crm/contacts/${contact.id}/edit`)
  }

  const handleView = (contact: Contact) => {
    router.push(`/dashboard/crm/contacts/${contact.id}`)
  }

  const handleNewContact = () => {
    router.push('/dashboard/crm/contacts/new')
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
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500">Manage your contacts</p>
        </div>
        <button
          onClick={handleNewContact}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
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
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Items per page</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value))
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        contacts={paginatedContacts}
        onEdit={handleEdit}
        onDelete={(id) => {
          setContactToDelete(id)
          setShowDeleteModal(true)
        }}
        onView={handleView}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {/* Pagination */}
      {filteredContacts.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Showing {paginatedContacts.length} of {filteredContacts.length} contacts
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery || selectedStatus ? 'No contacts match your filters' : 'Get started by adding your first contact'}
          </p>
          <button
            onClick={handleNewContact}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </button>
        </div>
      )}

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
