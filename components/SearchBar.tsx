import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, Heart, Bed } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

const karachiAreas = [
  "DHA Phase 1", "DHA Phase 2", "DHA Phase 4", "DHA Phase 5", "DHA Phase 6", "DHA Phase 7", "DHA Phase 8",
  "Clifton", "Bahria Town", "Gulshan-e-Iqbal", "Gulistan-e-Johar", "North Nazimabad", "Nazimabad",
  "PECHS", "Malir Cantt", "Malir", "Tariq Road", "Korangi", "Saddar", "Defence View", "Askari IV", "Askari V",
  "Scheme 33", "Federal B Area", "Gadap Town", "Lyari"
];

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  typeFilter: "all" | "buy" | "rent"
  setTypeFilter: (val: "all" | "buy" | "rent") => void
  categoryFilter: "all" | "apartment" | "house" | "plot" | "commercial"
  setCategoryFilter: (val: "all" | "apartment" | "house" | "plot" | "commercial") => void
  priceRange: [number, number]
  setPriceRange: (val: [number, number]) => void
  bedroomsFilter: string
  setBedroomsFilter: (val: string) => void
  showFavoritesOnly: boolean
  setShowFavoritesOnly: (val: boolean) => void
  sortBy: "default" | "price-asc" | "price-desc" | "newest"
  setSortBy: (val: "default" | "price-asc" | "price-desc" | "newest") => void
  maxPriceByFilter: number
  formatPrice: (val: number) => string
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  bedroomsFilter,
  setBedroomsFilter,
  showFavoritesOnly,
  setShowFavoritesOnly,
  sortBy,
  setSortBy,
  maxPriceByFilter,
  formatPrice
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter areas based on search query
  const suggestions = karachiAreas.filter(area => 
    area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row gap-4 bg-muted/30 p-4 rounded-xl border shadow-sm relative z-20"
    >
      <div className="relative flex-1 min-w-[200px]" ref={wrapperRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <Input 
          placeholder="Search by Karachi area, DHA, Clifton..." 
          className="pl-9 bg-background focus-visible:ring-1 relative z-10"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <AnimatePresence>
          {showSuggestions && searchQuery.trim() !== "" && suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((area, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-muted cursor-pointer text-sm transition-colors"
                  onClick={() => {
                    setSearchQuery(area);
                    setShowSuggestions(false);
                  }}
                >
                  {area}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex gap-2 shrink-0 flex-wrap lg:flex-nowrap">
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          className={`gap-2 shrink-0 ${showFavoritesOnly ? "" : "bg-background"}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current text-red-500" : ""}`} />
          Favorites
        </Button>

        <Select value={bedroomsFilter} onValueChange={(val) => setBedroomsFilter(val || "all")}>
          <SelectTrigger className="w-[110px] bg-background gap-2">
             <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
               <Bed className="w-4 h-4 shrink-0" />
               <span className="truncate">{bedroomsFilter === "all" ? "Beds" : `${bedroomsFilter} Beds`}</span>
             </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Beds</SelectItem>
            <SelectItem value="1">1+ Beds</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
            <SelectItem value="5">5+ Beds</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger render={
            <Button variant="outline" className="gap-2 bg-background data-[state=open]:bg-muted whitespace-nowrap w-[180px] justify-start" />
          }>
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm leading-none">Price Range</h4>
                <p className="text-sm text-muted-foreground">Set your minimum and maximum budget.</p>
              </div>
              <div className="pt-4 px-2">
                <Slider 
                  min={0}
                  max={maxPriceByFilter}
                  step={typeFilter === "rent" ? 10000 : 1000000}
                  value={priceRange}
                  onValueChange={(val: any) => setPriceRange(val as [number, number])}
                />
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={typeFilter} onValueChange={(val: any) => setTypeFilter(val)}>
          <SelectTrigger className="w-[100px] bg-background">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Type</SelectItem>
            <SelectItem value="buy">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(val: any) => setCategoryFilter(val)}>
          <SelectTrigger className="w-[120px] bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
          <SelectTrigger className="w-[130px] bg-background">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price (Low)</SelectItem>
            <SelectItem value="price-desc">Price (High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}
