"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully!')
          
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.message || 'Email verification failed.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-yellow-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-4 border-orange-400 overflow-hidden p-0">
        <div className="text-center bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
          <h1 className="text-3xl text-white font-bold m-0">Email Verification</h1>
        </div>
        <CardContent className="py-0 pt-6 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto" />
              <p className="text-lg text-gray-700">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Success!</h2>
              <p className="text-gray-700">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
              <p className="text-gray-700">{message}</p>
              <div className="space-x-2">
                <Link href="/login">
                  <Button variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold">
                    Register Again
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-yellow-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl border-4 border-orange-400 overflow-hidden p-0">
          <div className="text-center bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
            <h1 className="text-3xl text-white font-bold m-0">Email Verification</h1>
          </div>
          <CardContent className="py-0 pt-6 text-center">
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto" />
              <p className="text-lg text-gray-700">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
