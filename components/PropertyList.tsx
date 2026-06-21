"use client"

import { useState } from "react"
import { Property } from "./Marketplace"
import { Badge } from "@/components/ui/badge"
import { MapPin, X, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PropertyCard } from "./PropertyCard"
import { PropertyDetailsPanel } from "./PropertyDetailsPanel"

export function PropertyList({ 
  properties, 
  onReset,
  favoriteIds = [],
  onToggleFavorite,
  userRatings = {},
  onRate,
  onMessageOwner
}: { 
  properties: Property[], 
  onReset?: () => void,
  favoriteIds?: string[],
  onToggleFavorite?: (id: string) => void,
  userRatings?: Record<string, number>,
  onRate?: (id: string, rating: number) => void,
  onMessageOwner?: (propertyId: string) => void
}) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [compareProperties, setCompareProperties] = useState<Property[]>([])
  const [showCompareDialog, setShowCompareDialog] = useState(false)

  const toggleCompare = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation()
    if (compareProperties.find(p => p.id === property.id)) {
      setCompareProperties(prev => prev.filter(p => p.id !== property.id))
    } else {
      if (compareProperties.length >= 3) return
      setCompareProperties(prev => [...prev, property])
    }
  }

  if (properties.length === 0) {
    return (
      <div className="h-full min-h-[400px] flex flex-col gap-4 items-center justify-center text-center">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-2">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No properties found</h3>
        <p className="text-muted-foreground max-w-sm">
          We couldn&apos;t find any properties matching your current search and filter criteria.
        </p>
        {onReset && (
          <Button variant="outline" onClick={onReset} className="mt-2">
            Clear Filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard 
            key={property.id}
            index={index}
            property={property}
            isFavorite={favoriteIds.includes(property.id)}
            isCompared={!!compareProperties.find(p => p.id === property.id)}
            onToggleFavorite={(id) => onToggleFavorite?.(id)}
            onToggleCompare={(property, e) => toggleCompare(property, e)}
            userRating={userRatings[property.id]}
            onClick={() => {
              setSelectedProperty(property)
            }}
          />
        ))}
      </div>

      <PropertyDetailsPanel
        property={selectedProperty}
        open={!!selectedProperty}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProperty(null)
          }
        }}
        isFavorite={selectedProperty ? favoriteIds.includes(selectedProperty.id) : false}
        onToggleFavorite={onToggleFavorite}
        isCompared={selectedProperty ? !!compareProperties.find(p => p.id === selectedProperty.id) : false}
        onToggleCompare={toggleCompare}
        userRating={selectedProperty ? userRatings[selectedProperty.id] : undefined}
        onRate={onRate}
        onMessageOwner={onMessageOwner}
      />

      {compareProperties.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/95 backdrop-blur-md shadow-2xl border rounded-full pl-6 pr-2 py-2 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 mr-2">
              {compareProperties.map((p, i) => (
                <div key={p.id} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden relative z-10" style={{ zIndex: 10 - i }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="font-semibold text-sm">{compareProperties.length}/3 selected</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={() => setShowCompareDialog(true)}
              className="rounded-full shadow-sm"
              disabled={compareProperties.length < 2}
            >
              Compare {compareProperties.length < 2 ? '(Need min 2)' : ''}
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" 
              onClick={() => setCompareProperties([])}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b">
            <DialogTitle className="text-2xl font-bold font-sans">Compare Properties</DialogTitle>
            <DialogDescription>
              Viewing {compareProperties.length} properties side-by-side
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6 pb-6">
            <table className="w-full text-sm text-left border-collapse mt-4">
              <thead>
                <tr>
                  <th className="w-[10%] pb-4"></th>
                  {compareProperties.map(p => (
                    <th key={p.id} className="w-[30%] pb-4 px-2 align-top font-normal">
                      <div className="relative h-40 rounded-xl overflow-hidden mb-3 border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-sm" 
                          onClick={() => {
                              setCompareProperties(prev => prev.filter(cp => cp.id !== p.id));
                              if (compareProperties.length <= 2) setShowCompareDialog(false);
                          }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="font-semibold text-base line-clamp-2 leading-tight">{p.title}</div>
                    </th>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => (
                    <th key={`empty-h-${i}`} className="w-[30%] pb-4 px-2 align-top">
                      <div className="h-40 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground bg-muted/30">
                        <span className="text-sm">Empty Slot</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top">Price</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 font-bold text-primary text-lg align-top">
                      Rs {p.price.toLocaleString("en-PK")}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-p-${i}`} className="py-4 px-2"></td>)}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top">Type</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 capitalize align-top">{p.type}</td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-t-${i}`} className="py-4 px-2"></td>)}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top">Location</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 align-top">
                      <span className="line-clamp-2">{p.address}</span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-l-${i}`} className="py-4 px-2"></td>)}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top flex items-center h-[53px]">Bedrooms</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 align-top">{p.bedrooms} Beds</td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-b-${i}`} className="py-4 px-2"></td>)}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top flex items-center h-[53px]">Bathrooms</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 align-top">{p.bathrooms} Baths</td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-bt-${i}`} className="py-4 px-2"></td>)}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top flex items-center h-[53px]">Area</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 align-top">{p.areaSqft} sqft</td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-a-${i}`} className="py-4 px-2"></td>)}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-muted-foreground align-top">Amenities</td>
                  {compareProperties.map(p => (
                    <td key={p.id} className="py-4 px-2 align-top">
                      {p.amenities && p.amenities.length > 0 ? (
                        <ul className="space-y-1">
                          {p.amenities.map(a => <li key={a} className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" /> <span className="leading-tight">{a}</span></li>)}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareProperties.length }).map((_, i) => <td key={`empty-am-${i}`} className="py-4 px-2"></td>)}
                </tr>
              </tbody>
            </table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
