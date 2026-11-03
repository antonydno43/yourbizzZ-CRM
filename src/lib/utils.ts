import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date
import { format, parseISO, isValid } from 'date-fns'

export function formatDate(
  date: string | Date | null | undefined,
  dateFormat: string = 'MMM dd, yyyy'
): string {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(parsedDate)) {
    return ''
  }
  
  return format(parsedDate, dateFormat)
}

// Format currency
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount === null || amount === undefined) return ''
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numericAmount)) return ''
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(numericAmount)
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout> | null = null
  let lastRan = 0
  
  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args)
      lastRan = Date.now()
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc)
      }
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Check if value is empty
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get initials from name
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

// Capitalize first letter
export function capitalizeFirstLetter(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Capitalize all words
export function capitalizeWords(text: string): string {
  if (!text) return ''
  return text.split(' ').map(capitalizeFirstLetter).join(' ')
}

// Get time ago
export function timeAgo(date: string | Date): string {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return interval === 1 ? `${interval} ${unit} ago` : `${interval} ${unit}s ago`
    }
  }
  
  return 'just now'
}

// Get difference between two dates in days
export function dateDiffInDays(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  
  return (
    parsedDate.getDate() === today.getDate() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getFullYear() === today.getFullYear()
  )
}

// Check if date is in the future
export function isFuture(date: string | Date): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return parsedDate > new Date()
}

// Check if date is in the past
export function isPast(date: string | Date): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return parsedDate < new Date()
}

// Get start of day
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get end of day
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

// Get start of week
export function startOfWeek(date: Date = new Date(), weekStartsOn: number = 0): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get end of week
export function endOfWeek(date: Date = new Date(), weekStartsOn: number = 0): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)
  d.setDate(d.getDate() + diff)
  d.setHours(23, 59, 59, 999)
  return d
}

// Get start of month
export function startOfMonth(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get end of month
export function endOfMonth(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`
  }
  
  return phone
}

// Generate random color
export function getRandomColor(): string {
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
  ]
  
  return colors[Math.floor(Math.random() * colors.length)]
}

// Get color for status
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: '#10b981',
    inactive: '#6b7280',
    pending: '#f59e0b',
    completed: '#10b981',
    cancelled: '#ef4444',
    confirmed: '#3b82f6',
    draft: '#9ca3af',
    published: '#10b981',
    scheduled: '#3b82f6',
    won: '#10b981',
    lost: '#ef4444',
    open: '#3b82f6',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
    urgent: '#ef4444',
  }
  
  return statusColors[status.toLowerCase()] || '#6b7280'
}

// Get background color for status
export function getStatusBgColor(status: string): string {
  const statusBgColors: Record<string, string> = {
    active: 'bg-green-100',
    inactive: 'bg-gray-100',
    pending: 'bg-yellow-100',
    completed: 'bg-green-100',
    cancelled: 'bg-red-100',
    confirmed: 'bg-blue-100',
    draft: 'bg-gray-100',
    published: 'bg-green-100',
    scheduled: 'bg-blue-100',
    won: 'bg-green-100',
    lost: 'bg-red-100',
    open: 'bg-blue-100',
    high: 'bg-red-100',
    medium: 'bg-yellow-100',
    low: 'bg-green-100',
    urgent: 'bg-red-100',
  }
  
  return statusBgColors[status.toLowerCase()] || 'bg-gray-100'
}

// Get text color for status
export function getStatusTextColor(status: string): string {
  const statusTextColors: Record<string, string> = {
    active: 'text-green-800',
    inactive: 'text-gray-800',
    pending: 'text-yellow-800',
    completed: 'text-green-800',
    cancelled: 'text-red-800',
    confirmed: 'text-blue-800',
    draft: 'text-gray-800',
    published: 'text-green-800',
    scheduled: 'text-blue-800',
    won: 'text-green-800',
    lost: 'text-red-800',
    open: 'text-blue-800',
    high: 'text-red-800',
    medium: 'text-yellow-800',
    low: 'text-green-800',
    urgent: 'text-red-800',
  }
  
  return statusTextColors[status.toLowerCase()] || 'text-gray-800'
}

// Parse JSON safely
export function safeJsonParse(json: string, fallback: any = null): any {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// Stringify JSON safely
export function safeJsonStringify(obj: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj)
  } catch {
    return fallback
  }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any
  }
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

// Deep merge objects
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as T & U
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target.hasOwnProperty(key)
      ) {
        output[key] = deepMerge(target[key], source[key])
      } else {
        output[key] = source[key]
      }
    }
  }
  
  return output
}

// Get value from nested object using dot notation
export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current !== undefined ? current : defaultValue
}

// Set value in nested object using dot notation
export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current[key] === undefined) {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
  return obj
}

// Remove value from nested object using dot notation
export function removeNestedValue(obj: any, path: string): any {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current[key] === undefined) {
      return obj
    }
    current = current[key]
  }
  
  delete current[keys[keys.length - 1]]
  return obj
}

// Check if object has nested key
export function hasNestedKey(obj: any, path: string): boolean {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current === null || current === undefined || !current.hasOwnProperty(key)) {
      return false
    }
    current = current[key]
  }
  
  return true
}
