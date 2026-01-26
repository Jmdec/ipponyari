"use client"

import { useState, useEffect } from "react"
import { useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  LogOut,
  Download,
  User,
  Home,
  Calendar,
  ChefHat,
  ShoppingCart,
  Package,
  BookOpen,
  Gift,
  MessageSquare,
  FolderClock,
  Phone,
} from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ id?: string | number; name?: string; email?: string; token?: string } | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const { getItemCount } = useCartStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstallButton(false)
    }

    setDeferredPrompt(null)
  }

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user_data")
      const storedToken = localStorage.getItem("auth_token")

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        setUser({ ...parsedUser, token: storedToken })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("[Header] Error loading user from storage:", error)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadUserFromStorage()

    const handleUserUpdate = () => {
      loadUserFromStorage()
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" || e.key === "auth_token") {
        loadUserFromStorage()
      }
    }

    window.addEventListener("userDataUpdated", handleUserUpdate)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("userDataUpdated", handleUserUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadUserFromStorage])

  if (pathname.startsWith("/admin")) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
    window.dispatchEvent(new CustomEvent("userDataUpdated"))
    router.push("/login")
  }

  const allNav = [
    { name: "Home", href: "/", icon: Home },
    { name: "Menu", href: "/menu", icon: ChefHat },
    { name: "Reservations", href: "/reservations", icon: Calendar },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Promos", href: "/promos", icon: Gift },
    { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
    { name: "Contact Us", href: "/contact", icon: Phone },
  ]

  const isActivePage = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#dc143c]/20 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <Image src="/logoippon.png" alt="Ipponyari Logo" fill className="object-contain" />
            </div>
            <div className="flex-1">
              <span className="text-md lg:text-lg font-bold text-gray-900 tracking-wide">IPPONYARI</span>
              <p className="text-xs lg:text-xs text-[#dc143c] tracking-widest font-medium">JAPANESE RESTAURANT</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {allNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${isActivePage(item.href)
                  ? "bg-[#dc143c] text-white shadow-md"
                  : "text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c]"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install button - Desktop only */}
            {showInstallButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallApp}
                className="hidden lg:flex items-center space-x-1 border-[#dc143c]/50 text-[#dc143c] hover:bg-[#dc143c]/10 hover:border-[#dc143c] bg-transparent text-xs"
              >
                <Download className="h-3 w-3" />
                <span>Install</span>
              </Button>
            )}

            {user ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Link href="/cart" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative border-[#dc143c]/30 text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c] hover:border-[#dc143c] transition-all duration-300 p-2 h-10 w-10 bg-transparent"
                      title="Cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {itemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[18px] h-5 flex items-center justify-center text-xs bg-[#dc143c] text-white border-2 border-white shadow-md font-bold">
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative bg-[#dc143c] border-[#dc143c] text-white hover:bg-[#b01030] transition-all duration-300 shadow-md p-2 h-10 w-10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>

                <div
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200 ${isDropdownOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                    }`}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="block">
                    <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c] transition-colors cursor-pointer">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </div>
                  </Link>

                  <Link href="/orders" onClick={() => setIsDropdownOpen(false)} className="block">
                    <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c] transition-colors cursor-pointer">
                      <Package className="h-4 w-4" />
                      <span className="text-sm font-medium">Orders</span>
                    </div>
                  </Link>

                  <Link href="/events-history" onClick={() => setIsDropdownOpen(false)} className="block">
                    <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c] transition-colors cursor-pointer">
                      <FolderClock className="h-4 w-4" />
                      <span className="text-sm font-medium">Events</span>
                    </div>
                  </Link>

                  <Link href="/reservation-history" onClick={() => setIsDropdownOpen(false)} className="block">
                    <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c] transition-colors cursor-pointer">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Reservations</span>
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-[#dc143c] hover:bg-[#dc143c]/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#dc143c] hover:bg-[#b01030] text-white text-xs px-3 py-1.5 h-8 shadow-md"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu - Hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden bg-white border-[#dc143c]/30 text-gray-700 hover:bg-[#dc143c]/10 hover:border-[#dc143c] p-2 h-12 w-12"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white border-l border-gray-200 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center space-x-3 p-4 border-b border-gray-100 bg-gray-50">
                    <div className="relative w-12 h-12 overflow-hidden flex-shrink-0">
                      <Image src="/logoippon.png" alt="Ipponyari Logo" fill className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900 text-sm">Ipponyari</h2>
                      <p className="text-xs text-[#dc143c]">Japanese Restaurant</p>
                    </div>
                  </div>

                  {showInstallButton && (
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <Button
                        onClick={() => {
                          handleInstallApp()
                          setIsOpen(false)
                        }}
                        className="w-full flex items-center justify-center space-x-2 bg-[#dc143c] text-white hover:bg-[#b01030] py-3 rounded-lg transition-all duration-300 text-base font-semibold shadow-md"
                      >
                        <Download className="h-5 w-5" />
                        <span>Install App</span>
                      </Button>
                    </div>
                  )}

                  {/* Mobile Menu Content */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <nav className="py-2">
                      <div className="space-y-1 px-2">
                        {allNav.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 w-full text-left px-3 py-3 text-base font-medium rounded-lg transition-all duration-300 ${isActivePage(item.href)
                              ? "bg-[#dc143c] text-white shadow-md"
                              : "text-gray-700 hover:bg-[#dc143c]/10 hover:text-[#dc143c]"
                              }`}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
