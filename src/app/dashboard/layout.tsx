import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/dashboard-layout'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'YourBizz Dashboard - Manage your business',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
