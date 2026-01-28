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
  Flame,
  TrendingUp,
  ChefHat,
  Calendar,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    icon: Package,
    url: "/admin/product",
  },
  {
    title: "Orders",
    url: "/admin/order",
    icon: ShoppingCart,
  },
  {
    title: "Reservations",
    url: "/admin/reservations",
    icon: Calendar,
  },
  {
    title: "Customers",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Content Management",
    icon: Megaphone,
    items: [
      {
        title: "Announcements",
        url: "/admin/announcements",
      },
      {
        title: "Blog Posts",
        url: "/admin/blog",
      },
      {
        title: "Testimonials",
        url: "/admin/testimonials",
      },
    ],
  },
  {
    title: "Restaurant",
    icon: ChefHat,
    items: [
      {
        title: "Chefs",
        url: "/admin/chefs",
      },
    ],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    router.push("/login")
  }

  return (
    <Sidebar className="border-r border-red-100">
      <SidebarContent className="bg-gradient-to-b from-red-50 via-amber-50 to-red-50">
        <SidebarGroup>
          <div className="px-4 py-6 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg mx-3 mt-3 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <Image src="/logoippon.png" alt="Ipponyari Logo" fill className="object-contain bg-white rounded-full" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Restaurant Admin</h2>
                <p className="text-red-100 text-xs">Management Portal</p>
              </div>
            </div>
          </div>

          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="transition-all duration-200 rounded-lg mx-1 group hover:shadow-sm"
                        >
                          <item.icon className={`h-5 w-5 text-red-700 group-hover:scale-110 transition-transform`} />
                          <span className="font-medium">{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 text-gray-400" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-6 mt-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                className="hover:bg-red-100 rounded-md transition-colors"
                              >
                                <Link href={subItem.url} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  {subItem.title}
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
                      className={`transition-all duration-200 rounded-lg mx-1 group hover:shadow-sm ${pathname === item.url
                        ? "bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-800"
                        : ""
                        }`}
                    >
                      <Link href={item.url || "#"} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 text-red-700`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 bg-gradient-to-r from-red-50 to-red-100 border-t border-red-200">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 transition-all duration-200 rounded-lg group"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
