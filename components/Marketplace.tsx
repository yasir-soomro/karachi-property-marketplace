"use client"

import { useState } from "react"
import { PropertyList } from "./PropertyList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Map as MapIcon, MessagesSquare, Bell, User as UserIcon } from "lucide-react"

export type Property = {
  id: string
  title: string
  description: string
  type: "buy" | "rent"
  price: number
  bedrooms: number
  bathrooms: number
  areaSqft: number
  address: string
  images: string[]
  ownerName: string
  ownerRating: number
  status: "available" | "sold" | "rented"
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Apartment in Clifton",
    description: "Beautiful sea-facing apartment with modern amenities in Clifton, Karachi.",
    type: "buy",
    price: 45000000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 2000,
    address: "Block 2, Clifton, Karachi",
    images: ["https://picsum.photos/seed/karachi1/800/600"],
    ownerName: "Hasan Zaidi",
    ownerRating: 4.8,
    status: "available"
  },
  {
    id: "2",
    title: "Spacious House in DHA Phase 6",
    description: "Well-maintained 500 sq yards house in a peaceful neighborhood.",
    type: "buy",
    price: 125000000,
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 4500,
    address: "Khayaban-e-Shahbaz, DHA Phase 6, Karachi",
    images: ["https://picsum.photos/seed/karachi2/800/600"],
    ownerName: "Jimmy Gupta",
    ownerRating: 4.5,
    status: "available"
  },
  {
    id: "3",
    title: "Commercial Office in Saddar",
    description: "Prime location office space perfect for startups and small businesses.",
    type: "rent",
    price: 150000,
    bedrooms: 0,
    bathrooms: 2,
    areaSqft: 1200,
    address: "Saddar Town, Karachi",
    images: ["https://picsum.photos/seed/karachi3/800/600"],
    ownerName: "Hasan Zaidi",
    ownerRating: 4.8,
    status: "available"
  },
  {
    id: "4",
    title: "Cozy Flat in Gulshan-e-Iqbal",
    description: "2-bedroom flat with convenient access to shopping malls and schools.",
    type: "buy",
    price: 12000000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1000,
    address: "Block 13-A, Gulshan-e-Iqbal, Karachi",
    images: ["https://picsum.photos/seed/karachi4/800/600"],
    ownerName: "Ali Khan",
    ownerRating: 3.9,
    status: "available"
  }
]

export function Marketplace() {
  const [properties] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "buy" | "rent">("all")

  const filteredProperties = properties.filter(p => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false
    if (searchQuery && !p.address.toLowerCase().includes(searchQuery.toLowerCase()) && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-primary">Karachi Estates</h1>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <MessagesSquare className="w-4 h-4" /> Messages
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="w-4 h-4" /> Alerts
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <UserIcon className="w-4 h-4" /> Sign In
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by neighborhood, DHA, Clifton..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Select value={typeFilter} onValueChange={(val: any) => setTypeFilter(val)}>
              <SelectTrigger className="w-[120px] bg-background">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Type</SelectItem>
                <SelectItem value="buy">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <PropertyList properties={filteredProperties} />
        </div>
      </main>
    </div>
  )
}
