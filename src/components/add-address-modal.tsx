"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface AddAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: AddressFormData) => Promise<void>
  isEditing?: boolean
  initialData?: AddressFormData
}

export interface AddressFormData {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export function AddAddressModal({ isOpen, onClose, onSubmit, isEditing = false, initialData }: AddAddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      setFormData({ street: "", city: "", state: "", postal_code: "", country: "" })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ street: "", city: "", state: "", postal_code: "", country: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Address" : "Add New Address"}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <Input
              placeholder="e.g., 123 Main Street"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <Input
                placeholder="e.g., Manila"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <Input
                placeholder="e.g., NCR"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <Input
                placeholder="e.g., 1230"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                required
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <Input
                placeholder="e.g., Philippines"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-md disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Address" : "Add Address"}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
