'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/reset-password`,
      })

      if (error) {
        toast.error({
          title: 'Reset failed',
          description: error.message,
        })
      } else {
        setIsSuccess(true)
      }
    } catch (err: any) {
      toast.error({
        title: 'Reset failed',
        description: err.message || 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.svg"
            alt="YourBizz Logo"
            width={60}
            height={60}
            className="w-16 h-16"
            priority
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">YourBizz</h1>
        <p className="text-gray-500 mt-2">Reset your password</p>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Check your email
          </h2>
          <p className="text-green-700 text-sm">
            We&apos;ve sent a password reset link to {email}. 
            Please check your inbox and follow the instructions.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.svg"
            alt="YourBizz Logo"
            width={60}
            height={60}
            className="w-16 h-16"
            priority
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">YourBizz</h1>
        <p className="text-gray-500 mt-2">Reset your password</p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
