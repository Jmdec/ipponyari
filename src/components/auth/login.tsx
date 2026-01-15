"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/store/authStore"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const login = useAuthStore((state) => state.login)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        const token = data.token || data.data?.token || data.access_token
        const user = data.user || data.data?.user || data.data

        if (token && user) {
          login({ ...user, token })

          toast.success("Login Successful!", {
            description: "Welcome back to Ipponyari!",
          })

          const userRole = user?.role?.toLowerCase?.() || user?.role || ""
          const isAdmin = userRole === "admin"
          const isCustomer = userRole === "customer" || userRole === "user"

          let redirectPath = "/"
          if (isAdmin) {
            redirectPath = "/admin/dashboard"
          } else if (isCustomer) {
            redirectPath = "/"
          }

          setTimeout(() => {
            router.push(redirectPath)
          }, 1500)
        }
      } else {
        toast.error("Login Failed", {
          description: data.message || "Login failed. Please try again.",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Connection Error", {
        description: "Unable to login. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen py-8 bg-gradient-to-br from-white via-gray-50 to-[#fff5f5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#dc143c]/30 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-2 border-[#dc143c]/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-[#dc143c]/30 rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 border-2 border-[#dc143c]/20 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md bg-white shadow-2xl border-2 border-[#dc143c]/20 !p-0">
            <CardHeader className="text-center bg-gradient-to-r from-[#dc143c] to-[#7f0020] rounded-t-lg !p-0 px-6 py-4 !m-0">
              <CardTitle className="text-3xl text-white mb-2 !mt-0">Ipponyari</CardTitle>
              <h2 className="text-2xl text-white font-bold">Login</h2>
              <p className="text-white/90 mt-2">Welcome back!</p>
            </CardHeader>
            <CardContent className="pt-6 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-[#dc143c]" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="border-2 border-[#dc143c]/30 bg-white text-gray-800 placeholder:text-gray-400 focus:border-[#dc143c] focus:ring-[#dc143c]/30 h-12 text-base"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-[#dc143c]" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-2 border-[#dc143c]/30 bg-white text-gray-800 placeholder:text-gray-400 focus:border-[#dc143c] focus:ring-[#dc143c]/30 h-12 text-base pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#dc143c] hover:text-[#7f0020] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#dc143c] to-[#7f0020] hover:from-[#e8324f] hover:to-[#a00028] text-white font-bold py-3 h-14 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      <span>Login</span>
                    </span>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="text-[#dc143c] hover:text-[#7f0020] font-semibold transition-colors"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </>
  )
}
