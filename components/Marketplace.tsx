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
import { motion } from "motion/react"

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

const generateMockProperties = (): Property[] => {
  const properties: Property[] = [];
  const locations = [
    "Clifton, Karachi", "DHA Phase 6, Karachi", "Gulshan-e-Iqbal, Karachi", 
    "Saddar Town, Karachi", "PECHS, Karachi", "Bahria Town, Karachi", 
    "Malir Cantt, Karachi", "North Nazimabad, Karachi"
  ];
  const types: ("buy" | "rent")[] = ["buy", "rent"];
  const categories: ("apartment" | "house" | "plot" | "commercial")[] = ["apartment", "house", "commercial", "plot"];
  const amenitiesList = [
    "Sea View", "Gym", "Swimming Pool", "24/7 Security", 
    "Backup Generator", "Garden", "Servant Quarters", "Car Parking", 
    "Balcony", "Elevator", "Central AC", "CCTV", "Corner", "Park Facing"
  ];
  const ownerNames = ["Hasan Zaidi", "Jimmy Gupta", "Ali Khan", "Sarah Ahmed", "Omar Farooq", "Zainab Raza"];

  let seed = 1234567;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 1; i <= 24; i++) {
    const type = types[Math.floor(pseudoRandom() * types.length)];
    const category = categories[Math.floor(pseudoRandom() * categories.length)];
    const location = locations[Math.floor(pseudoRandom() * locations.length)];
    
    // Generate realistic prices
    let price = 0;
    if (type === "buy") {
      price = Math.floor(pseudoRandom() * 200000000) + 15000000; // 1.5Cr to 21.5Cr
    } else {
      price = Math.floor(pseudoRandom() * 400000) + 50000; // 50k to 4.5lakh
    }

    const bedrooms = category === "plot" || category === "commercial" ? 0 : Math.floor(pseudoRandom() * 5) + 1;
    const bathrooms = category === "plot" ? 0 : category === "commercial" ? Math.floor(pseudoRandom() * 2) + 1 : bedrooms + (Math.floor(pseudoRandom() * 2));
    const areaSqft = category === "plot" ? (Math.floor(pseudoRandom() * 9) + 2) * 100 : Math.floor(pseudoRandom() * 4000) + 800; // 800 to 4800 sqft
    
    const amenitiesCount = Math.floor(pseudoRandom() * 5) + 2;
    const shuffledAmenities = [...amenitiesList].sort(() => 0.5 - pseudoRandom());
    const amenities = shuffledAmenities.slice(0, amenitiesCount);

    properties.push({
      id: i.toString(),
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} in ${location.split(',')[0]}`,
      description: `A beautiful ${category} available for ${type} in the prime location of ${location}. It offers great value and basic necessities for comfortable living.`,
      type,
      category,
      price,
      bedrooms,
      bathrooms,
      areaSqft,
      address: location,
      images: [
        `https://picsum.photos/seed/prop${i}a/800/600`,
        `https://picsum.photos/seed/prop${i}b/800/600`,
        `https://picsum.photos/seed/prop${i}c/800/600`
      ],
      ownerName: ownerNames[Math.floor(pseudoRandom() * ownerNames.length)],
      ownerRating: parseFloat((pseudoRandom() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
      propertyRating: parseFloat((pseudoRandom() * 2 + 3.0).toFixed(1)), // 3.0 to 5.0
      ratingCount: Math.floor(pseudoRandom() * 50),
      status: "available",
      amenities
    });
  }
  
  return properties;
};

const mockProperties: Property[] = generateMockProperties();

export function Marketplace() {
  const [properties] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "buy" | "rent">("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "apartment" | "house" | "plot" | "commercial">("all")
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"default" | "newest" | "price-asc" | "price-desc">("default")
  
  const maxPriceByFilter = typeFilter === "rent" ? 500000 : 200000000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000000])
  
  // We can derive default price range correctly when typeFilter changes
  const handleTypeFilterChange = (val: "all" | "buy" | "rent") => {
    setTypeFilter(val)
    setPriceRange([0, val === "rent" ? 500000 : 200000000])
  }

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})
  
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [messagesConvId, setMessagesConvId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const init = () => {
      setMounted(true)
      try {
        const storedFavorites = localStorage.getItem("ke-favorite-properties")
        if (storedFavorites) {
          setFavoriteIds(JSON.parse(storedFavorites))
        }
      } catch (e) {
        console.warn("Failed to load favorites", e)
      }
    };
    // Defer to avoid synchronous layout cascading during mount
    setTimeout(init, 0);
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("ke-favorite-properties", JSON.stringify(favoriteIds))
      } catch (e) {
        console.warn("Failed to save favorites to local storage", e)
      }
    }
  }, [favoriteIds, mounted])

  const resetFilters = () => {
    setSearchQuery("")
    setTypeFilter("all")
    setCategoryFilter("all")
    setBedroomsFilter("all")
    setSortBy("default")
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
  }).sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    } else if (sortBy === "price-desc") {
      return b.price - a.price;
    } else if (sortBy === "newest") {
      return parseInt(b.id) - parseInt(a.id);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40"
      >
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
      </motion.header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={handleTypeFilterChange}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          bedroomsFilter={bedroomsFilter}
          setBedroomsFilter={setBedroomsFilter}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
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
