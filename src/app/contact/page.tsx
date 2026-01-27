"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhoneChange = (value: string) => {
    // Only allow numbers and limit to 11 digits
    const numbersOnly = value.replace(/\D/g, "").slice(0, 11)
    setFormData((prev) => ({ ...prev, phone: numbersOnly }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate phone number if provided
    if (formData.phone && formData.phone.length !== 11) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 11 digits.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Message Sent!",
          description: data.message || "Thank you for contacting us. We'll get back to you within 24 hours.",
          action: <CheckCircle className="h-5 w-5 text-green-500" />,
        })

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send message. Please try again.",
          variant: "destructive",
          action: <AlertCircle className="h-5 w-5 text-red-500" />,
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast({
        title: "Connection Error",
        description: "Unable to send message. Please check your connection and try again.",
        variant: "destructive",
        action: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
            Contact <span className="text-[#ff6b6b]">Us</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Have questions about our menu or want to make a reservation? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="group hover:shadow-2xl transition-all duration-300 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 hover:border-white/50 animate-in fade-in zoom-in duration-500">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-[#ff6b6b] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Visit Us</h3>
                  <a
                    href="https://maps.app.goo.gl/5NYrsNXawKobjQCf9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-[#ff6b6b] hover:underline transition-colors"
                  >
                    Mitsukoshi Mall, Ground Floor, 8th Avenue, corner 36th St, Taguig, Metro Manila
                  </a>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 hover:border-white/50 animate-in fade-in zoom-in duration-500 delay-100">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-[#ff6b6b] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Call Us</h3>
                  <a
                    href="tel:+63495411635"
                    className="text-sm text-white hover:text-[#ff6b6b] hover:underline transition-colors"
                  >
                    (0949) 541 1635
                  </a>
                  <p className="text-sm text-white mt-1">
                    Available daily
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 hover:border-white/50 animate-in fade-in zoom-in duration-500 delay-200 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-[#ff6b6b] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Hours</h3>
                  <p className="text-sm text-white">
                    Monday-Thursday: 11AM-2AM
                    <br />
                    Friday-Sunday: 11AM-4AM
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#4B0000]/70 backdrop-blur-sm border-white/30 animate-in fade-in slide-in-from-left duration-700 delay-400">
              <CardHeader>
                <CardTitle className="text-xl text-white">Reservations & Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ff6b6b] mb-2">Table Reservations</h4>
                  <p className="text-sm text-white">
                    For parties of 6 or more, we recommend making a reservation. Call us at{" "}
                    <a
                      href="tel:+63495411635"
                      className="text-[#ff6b6b] hover:text-white hover:underline transition-colors"
                    >
                      (0949) 541 1635
                    </a>{" "}
                    or use our online booking system.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#ff6b6b] mb-2">Private Events</h4>
                  <p className="text-sm text-white">
                    We cater private events and parties! Call us at{" "}
                    <a
                      href="tel:+63495411635"
                      className="text-[#ff6b6b] hover:text-white hover:underline transition-colors"
                    >
                      (0949) 541 1635
                    </a>{" "}
                    for custom menu options and pricing for your special occasion.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#ff6b6b] mb-2">Delivery & Takeout</h4>
                  <p className="text-sm text-white">
                    Order online for delivery or pickup. Delivery available within a 5-mile radius with a ₱500.00
                    minimum order.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#4B0000]/70 backdrop-blur-sm border-white/30 shadow-2xl animate-in fade-in slide-in-from-right duration-700 delay-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your name"
                    required
                    className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30 h-12 text-base"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30 h-12 text-base"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="09XXXXXXXXX (11 digits)"
                    className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30 h-12 text-base"
                    disabled={isSubmitting}
                    maxLength={11}
                  />
                  {formData.phone && formData.phone.length > 0 && formData.phone.length !== 11 && (
                    <p className="text-xs text-[#ff6b6b] mt-1">Must be exactly 11 digits</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white">
                    Subject
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleInputChange("subject", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="border-white/30 bg-white/20 text-white focus:border-white focus:ring-white/30 h-12 text-base">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#4B0000]/95 backdrop-blur-sm border-white/30">
                      <SelectItem value="reservations" className="text-white focus:bg-white/20 focus:text-white">
                        Reservations & Dining
                      </SelectItem>
                      <SelectItem value="menu" className="text-white focus:bg-white/20 focus:text-white">
                        Menu & Food Information
                      </SelectItem>
                      <SelectItem value="orders" className="text-white focus:bg-white/20 focus:text-white">
                        Online Orders & Delivery
                      </SelectItem>
                      <SelectItem value="payment" className="text-white focus:bg-white/20 focus:text-white">
                        Payment & Promotions
                      </SelectItem>
                      <SelectItem value="events" className="text-white focus:bg-white/20 focus:text-white">
                        Events & Catering
                      </SelectItem>
                      <SelectItem value="customer-service" className="text-white focus:bg-white/20 focus:text-white">
                        Customer Service
                      </SelectItem>
                      <SelectItem value="technical" className="text-white focus:bg-white/20 focus:text-white">
                        Website & Technical Support
                      </SelectItem>
                      <SelectItem value="careers" className="text-white focus:bg-white/20 focus:text-white">
                        Careers & Partnerships
                      </SelectItem>
                      <SelectItem value="others" className="text-white focus:bg-white/20 focus:text-white">
                        Others
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-white">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                    className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30 resize-none text-base min-h-[200px]"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white hover:bg-white/90 text-[#8B0000] font-bold py-3 h-12 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#8B0000]/30 border-t-[#8B0000] rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">Find Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-white/30">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7723.425901825317!2d121.04758521035545!3d14.558400682116561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90031c24cbb%3A0xbb7819dc8f7f0c2f!2sIpponyari%20BGC!5e0!3m2!1sen!2sph!4v1769486096387!5m2!1sen!2sph" 
            width="700" 
            height="450" 
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}