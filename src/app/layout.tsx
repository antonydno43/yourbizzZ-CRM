import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'YourBizz - SaaS CRM & Website Builder',
    template: '%s | YourBizz',
  },
  description: 'Build custom websites with drag-and-drop, manage CRM, bookings, forms, e-commerce, and inventory - all in one platform',
  keywords: ['CRM', 'Website Builder', 'Drag and Drop', 'Booking', 'Forms', 'E-commerce', 'Inventory', 'SaaS'],
  authors: [{ name: 'YourBizz' }],
  creator: 'YourBizz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourbizz.com',
    siteName: 'YourBizz',
    title: 'YourBizz - SaaS CRM & Website Builder',
    description: 'Build custom websites with drag-and-drop, manage CRM, bookings, forms, e-commerce, and inventory - all in one platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourBizz - SaaS CRM & Website Builder',
    description: 'Build custom websites with drag-and-drop, manage CRM, bookings, forms, e-commerce, and inventory - all in one platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen">
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
