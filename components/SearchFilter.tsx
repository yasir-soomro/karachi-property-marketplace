import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, Heart, Bed } from "lucide-react"

interface SearchFilterProps {
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
  maxPriceByFilter: number
  formatPrice: (val: number) => string
}

export function SearchFilter({
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
  maxPriceByFilter,
  formatPrice
}: SearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by neighborhood, DHA, Clifton..." 
          className="pl-9 bg-background focus-visible:ring-1"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 shrink-0 flex-wrap md:flex-nowrap mt-4 md:mt-0">
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          className={`gap-2 shrink-0 ${showFavoritesOnly ? "" : "bg-background"}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current text-red-500" : ""}`} />
          Favorites
        </Button>

        <Select value={bedroomsFilter} onValueChange={(val) => setBedroomsFilter(val || "all")}>
          <SelectTrigger className="w-[120px] bg-background gap-2">
             <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
               <Bed className="w-4 h-4 shrink-0" />
               <span className="truncate">{bedroomsFilter === "all" ? "Beds (Any)" : `${bedroomsFilter} Beds`}</span>
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
            <Button variant="outline" className="gap-2 bg-background data-[state=open]:bg-muted whitespace-nowrap" />
          }>
            <SlidersHorizontal className="w-4 h-4" />
            Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm leading-none">Price Range</h4>
                <p className="text-sm text-muted-foreground">Set your minimum and maximum budget.</p>
              </div>
              <div className="pt-4">
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
          <SelectTrigger className="w-[120px] bg-background">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Type</SelectItem>
            <SelectItem value="buy">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(val: any) => setCategoryFilter(val)}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
