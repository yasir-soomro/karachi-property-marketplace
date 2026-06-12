"use client"

import { useState } from "react"
import { Property } from "./Marketplace"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Star, MapPin, CheckCircle2, MessageSquare, X, Heart } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function PropertyList({ 
  properties, 
  onReset,
  favoriteIds = [],
  onToggleFavorite
}: { 
  properties: Property[], 
  onReset?: () => void,
  favoriteIds?: string[],
  onToggleFavorite?: (id: string) => void
}) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [compareProperties, setCompareProperties] = useState<Property[]>([])
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)

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
          We couldn't find any properties matching your current search and filter criteria.
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
        {properties.map(property => (
          <Card 
            key={property.id} 
            className="overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
            onClick={() => setSelectedProperty(property)}
          >
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 shadow-sm bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 border-0">
                {property.type === "buy" ? "For Sale" : "For Rent"}
              </Badge>
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                <Button 
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full shadow-sm backdrop-blur-sm bg-background/80 hover:bg-background/90 ${favoriteIds.includes(property.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(property.id);
                  }}
                >
                  <Heart className={`w-4 h-4 ${favoriteIds.includes(property.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button 
                  variant={compareProperties.find(p => p.id === property.id) ? "default" : "secondary"}
                  size="sm"
                  className={`h-8 shadow-sm backdrop-blur-sm bg-background/80 hover:bg-background/90 font-medium ${compareProperties.find(p => p.id === property.id) ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={(e) => toggleCompare(property, e)}
                >
                  {compareProperties.find(p => p.id === property.id) ? "Added" : "Compare"}
                </Button>
              </div>
            </div>
            
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-semibold text-lg line-clamp-1 flex-1">{property.title}</h3>
                <div className="font-bold text-primary shrink-0">
                  Rs {property.price.toLocaleString("en-PK")}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.address}
              </p>
            </CardHeader>

            <CardContent className="p-4 py-2 flex flex-col gap-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1.5" title="Bedrooms">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-1.5" title="Bathrooms">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5" title="Area sqft">
                  <Square className="w-4 h-4" />
                  <span>{property.areaSqft} sqft</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-2 border-t mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {property.ownerName.charAt(0)}
                </div>
                <span className="text-sm font-medium">{property.ownerName}</span>
                <div className="flex items-center gap-0.5 text-yellow-500 ml-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-medium text-muted-foreground">{property.ownerRating}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProperty} onOpenChange={(open) => {
        if (!open) {
          setSelectedProperty(null)
          setTimeout(() => setInquirySent(false), 300)
        }
      }}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-background">
          {selectedProperty && (
            <>
              <div className="relative h-64 w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedProperty.images[0]} 
                  alt={selectedProperty.title}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-4 left-4 shadow-md bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/95 border-0 text-sm py-1 px-3">
                  {selectedProperty.type === "buy" ? "For Sale" : "For Rent"}
                </Badge>
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button 
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full shadow-sm backdrop-blur-sm bg-background/90 hover:bg-background ${favoriteIds.includes(selectedProperty.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(selectedProperty.id);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${favoriteIds.includes(selectedProperty.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant={compareProperties.find(p => p.id === selectedProperty.id) ? "default" : "secondary"}
                    size="sm"
                    className={`h-9 px-4 shadow-sm backdrop-blur-sm bg-background/90 hover:bg-background font-medium ${compareProperties.find(p => p.id === selectedProperty.id) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                    onClick={(e) => toggleCompare(selectedProperty, e)}
                  >
                    {compareProperties.find(p => p.id === selectedProperty.id) ? "Added to Compare" : "Add to Compare"}
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <DialogTitle className="text-2xl font-bold font-sans">
                        {selectedProperty.title}
                      </DialogTitle>
                      <div className="text-2xl font-bold text-primary shrink-0">
                        Rs {selectedProperty.price.toLocaleString("en-PK")}
                      </div>
                    </div>
                    <DialogDescription className="text-base flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {selectedProperty.address}
                    </DialogDescription>
                  </div>

                  <div className="flex items-center gap-6 text-sm py-4 border-y">
                    {selectedProperty.bedrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{selectedProperty.bedrooms}</p>
                          <p className="text-muted-foreground text-xs uppercase tracking-wider">Bedrooms</p>
                        </div>
                      </div>
                    )}
                    {selectedProperty.bathrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{selectedProperty.bathrooms}</p>
                          <p className="text-muted-foreground text-xs uppercase tracking-wider">Bathrooms</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{selectedProperty.areaSqft}</p>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Square Feet</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-2">About this property</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Amenities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProperty.amenities.map(amenity => (
                          <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/30 rounded-xl p-6 border mt-6">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                        {selectedProperty.ownerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{selectedProperty.ownerName}</p>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-sm font-medium text-muted-foreground">{selectedProperty.ownerRating} verified rating</span>
                        </div>
                      </div>
                    </div>
                    
                    {inquirySent ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-bold text-lg">Inquiry Sent!</h4>
                        <p className="text-muted-foreground text-sm max-w-[250px] mt-1">
                          The property owner will get back to you shortly.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4" 
                          onClick={() => setInquirySent(false)}
                        >
                          Send another message
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-base mb-4">Send an Inquiry</h4>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setInquirySent(true) }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-foreground">Name *</label>
                              <Input placeholder="Your Name" required />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-foreground">Email *</label>
                              <Input type="email" placeholder="your@email.com" required />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Phone (Optional)</label>
                            <Input type="tel" placeholder="Your Phone Number" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Message *</label>
                            <Textarea 
                              placeholder="I am interested in this property..." 
                              className="min-h-[100px] resize-y" 
                              required 
                              defaultValue={`Hi ${selectedProperty.ownerName}, I'm interested in the property located at ${selectedProperty.address}. Please contact me as soon as possible.`}
                            />
                          </div>
                          <Button type="submit" className="w-full gap-2 mt-2" size="lg">
                            <MessageSquare className="w-4 h-4" />
                            Send Message
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

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
