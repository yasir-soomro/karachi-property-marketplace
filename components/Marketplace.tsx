"use client"

import { useState, useEffect } from "react"
import { PropertyList } from "./PropertyList"
import { SearchBar } from "./SearchBar"
import { MessagesDialog } from "./MessagesDialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Map as MapIcon, MessagesSquare, Bell, User as UserIcon, SlidersHorizontal, Heart } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Property = {
  id: string
  title: string
  description: string
  type: "buy" | "rent"
  category: "apartment" | "house" | "plot" | "commercial"
  price: number
  bedrooms: number
  bathrooms: number
  areaSqft: number
  address: string
  images: string[]
  ownerName: string
  ownerRating: number
  propertyRating?: number
  ratingCount?: number
  status: "available" | "sold" | "rented"
  amenities?: string[]
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Apartment in Clifton",
    description: "Beautiful sea-facing apartment with modern amenities in Clifton, Karachi.",
    type: "buy",
    category: "apartment",
    price: 45000000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 2000,
    address: "Block 2, Clifton, Karachi",
    images: [
      "/luxury_apartment.jpg",
      "https://picsum.photos/seed/p1a/800/600",
      "https://picsum.photos/seed/p1b/800/600"
    ],
    ownerName: "Hasan Zaidi",
    ownerRating: 4.8,
    propertyRating: 4.5,
    ratingCount: 12,
    status: "available",
    amenities: ["Sea View", "Gym", "Swimming Pool", "24/7 Security", "Backup Generator"]
  },
  {
    id: "2",
    title: "Spacious House in DHA Phase 6",
    description: "Well-maintained 500 sq yards house in a peaceful neighborhood.",
    type: "buy",
    category: "house",
    price: 125000000,
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 4500,
    address: "Khayaban-e-Shahbaz, DHA Phase 6, Karachi",
    images: [
      "/spacious_house.jpg",
      "https://picsum.photos/seed/p2a/800/600",
      "https://picsum.photos/seed/p2b/800/600"
    ],
    ownerName: "Jimmy Gupta",
    ownerRating: 4.5,
    propertyRating: 4.9,
    ratingCount: 34,
    status: "available",
    amenities: ["Garden", "Servant Quarters", "Car Parking", "Balcony"]
  },
  {
    id: "3",
    title: "Commercial Office in Saddar",
    description: "Prime location office space perfect for startups and small businesses.",
    type: "rent",
    category: "commercial",
    price: 150000,
    bedrooms: 0,
    bathrooms: 2,
    areaSqft: 1200,
    address: "Saddar Town, Karachi",
    images: ["/commercial_office.jpg"],
    ownerName: "Hasan Zaidi",
    ownerRating: 4.8,
    propertyRating: 4.2,
    ratingCount: 8,
    status: "available",
    amenities: ["Elevator", "Central AC", "CCTV", "Conference Room"]
  },
  {
    id: "4",
    title: "Cozy Flat in Gulshan-e-Iqbal",
    description: "2-bedroom flat with convenient access to shopping malls and schools.",
    type: "buy",
    category: "apartment",
    price: 12000000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1000,
    address: "Block 13-A, Gulshan-e-Iqbal, Karachi",
    images: ["/cozy_flat.jpg"],
    ownerName: "Ali Khan",
    ownerRating: 3.9,
    propertyRating: 3.8,
    ratingCount: 5,
    status: "available",
    amenities: ["Park Facing", "Corner Apartment", "Mosque Nearby"]
  }
]

export function Marketplace() {
  const [properties] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "buy" | "rent">("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "apartment" | "house" | "plot" | "commercial">("all")
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("all")
  
  const maxPriceByFilter = typeFilter === "rent" ? 500000 : 200000000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000000])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})
  
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [messagesConvId, setMessagesConvId] = useState<string | null>(null)

  useEffect(() => {
    setPriceRange([0, typeFilter === "rent" ? 500000 : 200000000])
  }, [typeFilter])

  const resetFilters = () => {
    setSearchQuery("")
    setTypeFilter("all")
    setCategoryFilter("all")
    setBedroomsFilter("all")
    setPriceRange([0, maxPriceByFilter])
  }

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Crore`
    if (value >= 100000) return `${(value / 100000).toFixed(1)} Lac`
    return `Rs ${value.toLocaleString("en-PK")}`
  }

  const filteredProperties = properties.filter(p => {
    if (showFavoritesOnly && !favoriteIds.includes(p.id)) return false
    if (typeFilter !== "all" && p.type !== typeFilter) return false
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false
    if (bedroomsFilter !== "all" && p.bedrooms < parseInt(bedroomsFilter)) return false
    
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchAddress = p.address.toLowerCase().includes(q)
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchDesc = p.description.toLowerCase().includes(q)
      const matchAmenities = p.amenities?.some(a => a.toLowerCase().includes(q))
      
      if (!matchAddress && !matchTitle && !matchDesc && !matchAmenities) {
        return false
      }
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl mr-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
              <MapIcon className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">Karachi Estates</span>
            <span className="sm:hidden">KE</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <a href="#" className="text-primary border-b-2 border-primary py-5">Buy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-5 border-b-2 border-transparent hover:border-border">Rent</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-5 border-b-2 border-transparent hover:border-border">Agents</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-5 border-b-2 border-transparent hover:border-border">Projects</a>
          </nav>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={() => setIsMessagesOpen(true)}
            >
              <MessagesSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative hidden sm:flex">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>
            <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
            <Button variant="outline" size="sm" className="gap-2 rounded-full hidden sm:flex">
              <UserIcon className="w-4 h-4" /> Sign In
            </Button>
            <Button variant="default" size="sm" className="rounded-full hidden sm:flex">
              Post Property
            </Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          bedroomsFilter={bedroomsFilter}
          setBedroomsFilter={setBedroomsFilter}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          maxPriceByFilter={maxPriceByFilter}
          formatPrice={formatPrice}
        />

        <div className="flex-1 w-full relative">
          <PropertyList 
            properties={filteredProperties} 
            onReset={resetFilters} 
            favoriteIds={favoriteIds}
            onToggleFavorite={(id) => setFavoriteIds(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])}
            userRatings={userRatings}
            onRate={(id, rating) => setUserRatings(prev => ({ ...prev, [id]: rating }))}
            onMessageOwner={(propertyId) => {
              // Open default conversation depending on propertyId (simulated)
              const convId = propertyId === "1" ? "conv-1" : propertyId === "2" ? "conv-2" : null;
              setMessagesConvId(convId);
              setIsMessagesOpen(true);
            }}
          />
        </div>
      </main>

      <MessagesDialog 
        open={isMessagesOpen} 
        onOpenChange={setIsMessagesOpen} 
        defaultConversationId={messagesConvId}
      />
    </div>
  )
}
