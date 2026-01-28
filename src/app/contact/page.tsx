"use client"

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
    const numbersOnly = value.replace(/\D/g, "").slice(0, 11)
    setFormData((prev) => ({ ...prev, phone: numbersOnly }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }
    if (formData.phone && formData.phone.length !== 11) {
      toast({ title: "Invalid Phone Number", description: "Phone number must be exactly 11 digits.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Message Sent!", description: data.message || "Thank you for contacting us. We'll get back to you within 24 hours.", action: <CheckCircle className="h-5 w-5 text-green-500" /> })
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        toast({ title: "Error", description: data.message || "Failed to send message.", variant: "destructive", action: <AlertCircle className="h-5 w-5 text-red-500" /> })
      }
    } catch (err) {
      toast({ title: "Connection Error", description: "Unable to send message. Check your connection.", variant: "destructive", action: <AlertCircle className="h-5 w-5 text-red-500" /> })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            Contact <span className="text-[#ff6b6b]">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            Have questions or want to make a reservation? We'd love to hear from you!
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info Cards */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-[#4B0000]/70 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all">
                <CardContent className="text-center p-3">
                  <MapPin className="w-8 h-8 text-[#ff6b6b] mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                  <a href="https://maps.app.goo.gl/5NYrsNXawKobjQCf9" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-[#ff6b6b] hover:underline">
                    Mitsukoshi Mall, Ground Floor, 8th Ave, Taguig, Metro Manila
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-[#4B0000]/70 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all">
                <CardContent className="text-center p-3">
                  <Phone className="w-8 h-8 text-[#ff6b6b] mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Call Us</h3>
                  <a href="tel:+63495411635" className="text-sm text-white hover:text-[#ff6b6b] hover:underline">
                    (0949) 541 1635
                  </a>
                  <p className="text-sm text-white mt-1">Available daily</p>
                </CardContent>
              </Card>

              <Card className="bg-[#4B0000]/70 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all">
                <CardContent className="text-center p-3">
                  <Clock className="w-8 h-8 text-[#ff6b6b] mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Hours</h3>
                  <p className="text-sm text-white">
                    Mon-Thu: 11AM-2AM <br /> Fri-Sun: 11AM-4AM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Reservations & Events Info */}
            <Card className="bg-[#4B0000]/70 backdrop-blur-sm border border-white/20 p-6 hover:shadow-2xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl text-white">Reservations & Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ff6b6b] mb-1">Table Reservations</h4>
                  <p className="text-sm text-white">
                    For parties of 6+, call <a href="tel:+63495411635" className="text-[#ff6b6b] hover:underline">0949 541 1635</a> or use our online booking.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#ff6b6b] mb-1">Private Events</h4>
                  <p className="text-sm text-white">
                    Custom menu & pricing available. Call <a href="tel:+63495411635" className="text-[#ff6b6b] hover:underline">0949 541 1635</a>.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#ff6b6b] mb-1">Delivery & Takeout</h4>
                  <p className="text-sm text-white">
                    Delivery within 5-mile radius. Minimum ₱500 order.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-[#4B0000]/70 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your Name"
                      required
                      className="h-12 text-white bg-white/20 placeholder:text-white/60 border-white/30 focus:ring-white/30"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="h-12 text-white bg-white/20 placeholder:text-white/60 border-white/30 focus:ring-white/30"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Phone (Optional)</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="09XXXXXXXXX"
                      className="h-12 text-white bg-white/20 placeholder:text-white/60 border-white/30 focus:ring-white/30"
                      maxLength={11}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => handleInputChange("subject", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12 text-white bg-white/20 border-white/30 focus:ring-white/30">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#4B0000]/95 backdrop-blur-sm border border-white/20">
                        {["Reservations & Dining","Menu & Food","Orders & Delivery","Payment & Promotions","Events & Catering","Customer Service","Technical Support","Careers","Others"].map((topic) => (
                          <SelectItem key={topic} value={topic} className="text-white hover:bg-white/20">{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Message *</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className="text-white bg-white/20 placeholder:text-white/60 border-white/30 focus:ring-white/30 resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-white text-[#8B0000] font-bold hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : <span className="flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send Message</span>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="mt-12 bg-[#4B0000]/70 backdrop-blur-sm border border-white/20 p-4 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">Find Us at</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-lg h-80 sm:h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7723.425901825317!2d121.04758521035545!3d14.558400682116561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90031c24cbb%3A0xbb7819dc8f7f0c2f!2sIpponyari%20BGC!5e0!3m2!1sen!2sph!4v1769486096387!5m2!1sen!2sph"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
