"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, MessageCircle, Phone, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FloatingSocialMedia() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Hide on login and registration pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/ipponyarijapresto",
      bgColor: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#0d5dcc]",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/ipponyari/?hl=en",
      bgColor: "bg-[#E4405F]",
      hoverColor: "hover:bg-[#d62957]",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/(049)5411635",
      bgColor: "bg-[#25D366]",
      hoverColor: "hover:bg-[#1fb855]",
    },
    {
      name: "Call Us",
      icon: Phone,
      href: "tel:(049) 541 1635",
      bgColor: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
    },
  ]

  return (
    <div className="fixed right-4 bottom-24 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-30 flex flex-col gap-4">
      {/* Social Links - Show/Hide based on isOpen state */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto"}`}
      >
        {socialLinks.map((social, index) => (
          <a
            key={social.name}
            href={social.href}
            target={social.name !== "Call Us" ? "_blank" : undefined}
            rel={social.name !== "Call Us" ? "noopener noreferrer" : undefined}
            className="group"
            aria-label={social.name}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
            }}
          >
            <Button
              size="icon"
              className={`h-12 w-12 rounded-full ${social.bgColor} text-white shadow-lg transition-all duration-300 ${social.hoverColor} hover:scale-110 hover:shadow-xl`}
            >
              <social.icon className="h-5 w-5" />
            </Button>
          </a>
        ))}
      </div>

      {/* Toggle Button - Only visible on mobile */}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-[#dc143c] hover:bg-[#b01030] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl md:hidden"
        aria-label="Toggle social media links"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Share2 className="h-6 w-6" />}
      </Button>
    </div>
  )
}