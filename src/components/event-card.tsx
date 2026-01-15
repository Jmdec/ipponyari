"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  capacity: number
  price: number
  image_url: string
  status: string
}

interface EventCardProps {
  event: Event
  onBook: () => void
}

export default function EventCard({ event, onBook }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
      {/* Event Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {event.image_url ? (
          <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {!isUpcoming && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Event Passed</span>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-xl font-bold text-foreground line-clamp-2">{event.title}</h3>
          <span
            className={`ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              event.status === "upcoming"
                ? "bg-primary/20 text-primary"
                : event.status === "ongoing"
                  ? "bg-accent/20 text-accent"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {event.status}
          </span>
        </div>

        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{event.description}</p>

        {/* Event Meta */}
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center text-foreground">
            <span className="font-medium">📅</span>
            <span className="ml-2">{eventDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-foreground">
            <span className="font-medium">🕐</span>
            <span className="ml-2">{event.time}</span>
          </div>
          <div className="flex items-center text-foreground">
            <span className="font-medium">👥</span>
            <span className="ml-2">{event.capacity} seats available</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Price per person</p>
            <p className="text-2xl font-bold text-primary">${event.price.toFixed(2)}</p>
          </div>
          <Button
            onClick={onBook}
            disabled={!isUpcoming}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isUpcoming ? "Book Now" : "Unavailable"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
