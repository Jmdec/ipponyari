"use client"

import {
  Home,
  Package,
  Megaphone,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChefHat,
  Calendar,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import Image from "next/image"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Products", url: "/admin/product", icon: Package },
  { title: "Orders", url: "/admin/order", icon: ShoppingCart },
  { title: "Reservations", url: "/admin/reservations", icon: Calendar },
  { title: "Customers", url: "/admin/users", icon: Users },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  {
    title: "Content Management",
    icon: Megaphone,
    items: [
      { title: "Announcements", url: "/admin/announcements" },
      { title: "Blog Posts", url: "/admin/blog" },
      { title: "Testimonials", url: "/admin/testimonials" },
    ],
  },
  {
    title: "Restaurant",
    icon: ChefHat,
    items: [{ title: "Chefs", url: "/admin/chefs" }],
  },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setOpen, isMobile } = useSidebar()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const handleNavigate = () => {
    if (isMobile) setOpen(false)
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-red-100">
      <SidebarContent className="bg-gradient-to-b from-red-50 via-amber-50 to-red-50">
        <SidebarGroup>
          {/* Header */}
          <div className="px-4 py-6 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg mx-3 mt-3 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden">
                <Image
                  src="/logoippon.png"
                  alt="Ipponyari Logo"
                  fill
                  className="object-contain bg-white rounded-full"
                />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Restaurant Admin</h2>
                <p className="text-red-100 text-xs">Management Portal</p>
              </div>
            </div>
          </div>

          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isParentActive =
                  item.items?.some((sub) => pathname.startsWith(sub.url)) ?? false

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      <Collapsible defaultOpen={isParentActive}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="mx-1 rounded-lg">
                            <item.icon className="h-5 w-5 text-red-700" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-6 mt-1">
                            {item.items.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === sub.url}
                                  onClick={handleNavigate}
                                >
                                  <Link href={sub.url} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    {sub.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        onClick={handleNavigate}
                        className="mx-1 rounded-lg"
                      >
                        <Link href={item.url!} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-red-700" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-red-200">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 text-red-500" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
