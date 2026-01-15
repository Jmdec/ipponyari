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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
    color: "text-green-600",
    bgColor: "hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50",
  },
  {
    title: "Products",
    icon: Package,
    color: "text-green-700",
    bgColor: "hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50",
    items: [
      {
        title: "All Products",
        url: "/admin/product",
      },
    ],
  },
  {
    title: "Orders",
    url: "/admin/order",
    icon: ShoppingCart,
    color: "text-amber-600",
    bgColor: "hover:bg-gradient-to-r hover:from-amber-50 hover:to-green-50",
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    color: "text-green-600",
    bgColor: "hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50",
  },
  {
    title: "Content Management",
    icon: Megaphone,
    color: "text-amber-600",
    bgColor: "hover:bg-gradient-to-r hover:from-amber-50 hover:to-green-50",
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
      {
        title: "Events",
        url: "/admin/events",
      },
    ],
  },
  {
    title: "Restaurant",
    icon: ChefHat,
    color: "text-green-700",
    bgColor: "hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50",
    items: [
      {
        title: "Chefs",
        url: "/admin/chefs",
      },
      {
        title: "Reservations",
        url: "/admin/reservations",
      },
    ],
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart3,
    color: "text-green-700",
    bgColor: "hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    color: "text-amber-600",
    bgColor: "hover:bg-gradient-to-r hover:from-amber-50 hover:to-green-50",
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
    <Sidebar className="border-r border-green-100">
      <SidebarContent className="bg-gradient-to-b from-green-50 via-amber-50 to-green-50">
        <SidebarGroup>
          <div className="px-4 py-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg mx-3 mt-3 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <SidebarGroupLabel className="text-white font-bold text-lg">Restaurant Admin</SidebarGroupLabel>
                <p className="text-green-100 text-xs">Management Portal</p>
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
                          className={`${item.bgColor} transition-all duration-200 rounded-lg mx-1 group hover:shadow-sm`}
                        >
                          <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
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
                                className="hover:bg-green-100 rounded-md transition-colors"
                              >
                                <Link href={subItem.url} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                      className={`${item.bgColor} transition-all duration-200 rounded-lg mx-1 group hover:shadow-sm ${
                        pathname === item.url
                          ? "bg-gradient-to-r from-green-100 to-amber-100 border-l-4 border-green-600"
                          : ""
                      }`}
                    >
                      <Link href={item.url || "#"} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="font-medium">{item.title}</span>
                        {pathname === item.url && <TrendingUp className="ml-auto h-4 w-4 text-green-600" />}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 bg-gradient-to-r from-green-50 to-amber-50 border-t border-green-200">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gradient-to-r hover:from-green-100 hover:to-amber-100 transition-all duration-200 rounded-lg group"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
