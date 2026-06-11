"use client"

import { useState } from "react"
import { Property } from "./Marketplace"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Star, MapPin, CheckCircle2, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PropertyList({ properties }: { properties: Property[] }) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  if (properties.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground py-20">
        No properties found matching your criteria.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <Card 
            key={property.id} 
            className="overflow-hidden group hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
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

      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
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

                  <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                        {selectedProperty.ownerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedProperty.ownerName}</p>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium text-muted-foreground">{selectedProperty.ownerRating} verified rating</span>
                        </div>
                      </div>
                    </div>
                    <Button className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Contact Agent
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
