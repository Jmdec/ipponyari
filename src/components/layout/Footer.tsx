"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Mail, HelpCircle, Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SupportModal } from "@/components/support-modal"

const Footer = () => {
  const pathname = usePathname()
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <>
      <footer className="bg-gradient-to-b from-[#f5ebe0] to-[#ede0d4] text-gray-800 border-t border-[#dc143c]/20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo + Description */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/80 p-0.5 shadow-md border border-[#dc143c]/20">
                  <div className="w-full h-full bg-white/80 rounded-lg flex items-center justify-center">
                    <Image src="/logoippon.png" alt="Ipponyari Logo" fill className="object-contain p-1" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900 tracking-wide">IPPONYARI</span>
                  <p className="text-sm text-[#dc143c] tracking-widest font-medium">JAPANESE RESTAURANT</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Experience authentic Japanese cuisine crafted with precision and passion. Our master chefs bring the
                finest flavors of Japan to your table.
              </p>
              <div className="flex gap-3 pt-2">
                <Link
                  href="https://www.instagram.com/ipponyari/?hl=en"
                  className="w-10 h-10 rounded-full bg-white/60 hover:bg-[#dc143c] flex items-center justify-center transition-all duration-300 group border border-[#dc143c]/20 hover:border-[#dc143c]"
                >
                  <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white" />
                </Link>
                <Link
                  href="https://www.facebook.com/ipponyarijapresto"
                  className="w-10 h-10 rounded-full bg-white/60 hover:bg-[#dc143c] flex items-center justify-center transition-all duration-300 group border border-[#dc143c]/20 hover:border-[#dc143c]"
                >
                  <Facebook className="w-5 h-5 text-gray-700 group-hover:text-white" />
                </Link>
               
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-[#dc143c]/30 pb-3">Quick Links</h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-[#dc143c] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c]" />
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="text-gray-700 hover:text-[#dc143c] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c]" />
                  Menu
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-[#dc143c] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c]" />
                  About Us
                </Link>
                <Link
                  href="/reservations"
                  className="text-gray-700 hover:text-[#dc143c] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c]" />
                  Reservations
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-[#dc143c] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c]" />
                  Contact
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-[#dc143c]/30 pb-3">Contact Info</h3>
              <div className="space-y-4 text-sm">
                <Link
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 hover:text-[#dc143c] transition-colors text-gray-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dc143c]/20 transition-colors border border-[#dc143c]/10">
                    <MapPin className="h-4 w-4 text-[#dc143c]" />
                  </div>
                  <span className="pt-1.5">Santa Rosa-tagaytay Road, Santa Rosa, Philippines</span>
                </Link>

                <Link
                  href="tel:(049) 541 1635"
                  className="flex items-start space-x-3 hover:text-[#dc143c] transition-colors text-gray-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dc143c]/20 transition-colors border border-[#dc143c]/10">
                    <Phone className="h-4 w-4 text-[#dc143c]" />
                  </div>
                  <span className="pt-1.5">(049) 541 1635</span>
                </Link>

                <Link
                  href="mailto:info@ipponyari.jp"
                  className="flex items-start space-x-3 hover:text-[#dc143c] transition-colors text-gray-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dc143c]/20 transition-colors border border-[#dc143c]/10">
                    <Mail className="h-4 w-4 text-[#dc143c]" />
                  </div>
                  <span className="pt-1.5">info@ipponyari.jp</span>
                </Link>
              </div>
            </div>

            {/* Support Section */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-[#dc143c]/30 pb-3">Support</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Need help? Our support team is ready to assist you with reservations, orders, or any questions.
              </p>
              <Button 
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full bg-[#dc143c] hover:bg-[#b01030] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-300 py-5"
              >
                <HelpCircle className="h-5 w-5" />
                Get Support
              </Button>
              <div className="bg-white/50 rounded-xl p-4 border border-[#dc143c]/20">
                <p className="text-xs text-[#dc143c] font-semibold mb-2">OPENING HOURS</p>
                <p className="text-gray-800 text-sm">Mon - Sun: 11:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
         
        </div>
      </footer>

      <SupportModal open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen} />
    </>
  )
}

export default Footer