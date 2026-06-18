import { useState, useEffect } from "react"
import { Property } from "./Marketplace"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Star, MapPin, CheckCircle2, MessageSquare, Heart, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export interface PropertyDetailsPanelProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (property: Property, e: React.MouseEvent) => void;
  userRating?: number;
  onRate?: (id: string, rating: number) => void;
  onMessageOwner?: (propertyId: string) => void;
}

export function PropertyDetailsPanel({
  property,
  open,
  onOpenChange,
  isFavorite = false,
  onToggleFavorite,
  isCompared = false,
  onToggleCompare,
  userRating,
  onRate,
  onMessageOwner
}: PropertyDetailsPanelProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (open && property) {
      setActiveImageIndex(0);
      setInquirySent(false);
    }
  }, [open, property]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property && activeImageIndex < property.images.length - 1) {
      setActiveImageIndex(prev => prev + 1);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property && activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
    }
  };

  if (!property) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 gap-0 overflow-hidden bg-background border-l shadow-2xl z-50">
        <ScrollArea className="h-full relative">
          <div className="relative h-72 md:h-80 w-full bg-muted flex flex-col group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={property.images[activeImageIndex]} 
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  disabled={activeImageIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden hover:bg-background z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  disabled={activeImageIndex === property.images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden hover:bg-background z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Badge className="shadow-md bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/95 border-0 text-sm py-1 px-3">
                {property.type === "buy" ? "For Sale" : "For Rent"}
              </Badge>
              <Badge className="shadow-md bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 text-sm py-1 px-3 capitalize">
                {property.category}
              </Badge>
            </div>
            
            <div className="absolute top-4 right-12 z-10 flex gap-2">
              <Button 
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full shadow-sm backdrop-blur-sm bg-background/90 hover:bg-background ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(property.id);
                }}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button 
                variant={isCompared ? "default" : "secondary"}
                size="sm"
                className={`h-9 px-4 shadow-sm backdrop-blur-sm bg-background/90 hover:bg-background font-medium ${isCompared ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                onClick={(e) => onToggleCompare?.(property, e)}
              >
                {isCompared ? "Added to Compare" : "Compare"}
              </Button>
            </div>

            {/* Thumbnail Navigation */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/60 backdrop-blur-md px-3 py-2 rounded-full z-10">
                {property.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === i ? 'bg-primary w-4' : 'bg-foreground/50 hover:bg-foreground/80'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-6 lg:p-8">
            <SheetHeader className="text-left">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-2">
                <SheetTitle className="text-2xl md:text-3xl font-bold font-sans">
                  {property.title}
                </SheetTitle>
                <div className="text-2xl md:text-3xl font-bold text-primary shrink-0">
                  Rs {property.price.toLocaleString("en-PK")}
                </div>
              </div>
              <SheetDescription className="text-base flex items-center gap-1.5 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                {property.address}
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`p-0.5 transition-colors ${
                      (userRating || 0) >= star
                        ? "text-yellow-500"
                        : "text-muted-foreground hover:text-yellow-500/70"
                    }`}
                    onClick={() => onRate?.(property.id, star)}
                  >
                    <Star className={`w-5 h-5 ${
                      (userRating || 0) >= star ? "fill-current" : ""
                    }`} />
                  </button>
                ))}
              </div>
              <div className="text-sm">
                {userRating ? (
                  <span className="text-muted-foreground">You rated this {userRating} stars</span>
                ) : (
                  <span className="text-muted-foreground">Rate this property</span>
                )}
              </div>
              {property.propertyRating && (
                <div className="flex items-center gap-1.5 text-sm border-l pl-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">
                    {userRating ? ((property.propertyRating * (property.ratingCount || 1) + userRating) / ((property.ratingCount || 1) + 1)).toFixed(1) : property.propertyRating}
                  </span>
                  <span className="text-muted-foreground">
                    ({(property.ratingCount || 0) + (userRating ? 1 : 0)} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm py-5 border-y bg-muted/20 px-4 rounded-xl">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background shadow-sm border flex items-center justify-center text-muted-foreground">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg leading-none">{property.bedrooms}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">Bedrooms</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background shadow-sm border flex items-center justify-center text-muted-foreground">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg leading-none">{property.bathrooms}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">Bathrooms</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background shadow-sm border flex items-center justify-center text-muted-foreground">
                  <Square className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg leading-none">{property.areaSqft}</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">Square Feet</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xl mb-3">About this property</h4>
              <p className="text-muted-foreground leading-relaxed text-[15px] whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h4 className="font-semibold text-xl mb-4">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2.5 text-[15px] text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted/40 rounded-2xl p-6 border mt-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shadow-inner">
                  {property.ownerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{property.ownerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{property.ownerRating} verified rating</span>
                  </p>
                </div>
              </div>
              
              {inquirySent ? (
                <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Inquiry Sent!</h4>
                  <p className="text-muted-foreground max-w-[280px]">
                    The property owner will get back to you shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 font-medium" 
                    onClick={() => setInquirySent(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <h4 className="font-semibold text-lg mb-5">Contact Owner</h4>
                  <div className="flex gap-4 mb-6">
                    <Button 
                      className="flex-1 gap-2 rounded-xl h-12 text-base shadow-md hover:shadow-lg transition-all" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (onMessageOwner) onMessageOwner(property.id);
                        onOpenChange(false);
                      }}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Live Chat
                    </Button>
                  </div>
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-medium">
                      <span className="bg-[#f0f0f1] dark:bg-[#1a1a1a] px-3 text-muted-foreground rounded-full">
                        Or drop an email
                      </span>
                    </div>
                  </div>
                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setInquirySent(true) }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Name *</label>
                        <Input placeholder="Your Name" required className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email *</label>
                        <Input type="email" placeholder="your@email.com" required className="bg-background" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone (Optional)</label>
                      <Input type="tel" placeholder="Your Phone Number" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Message *</label>
                      <Textarea 
                        placeholder="I am interested in this property..." 
                        className="min-h-[120px] resize-y bg-background" 
                        required 
                        defaultValue={`Hi ${property.ownerName}, I'm interested in the property located at ${property.address}. Please contact me as soon as possible.`}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2 mt-2" size="lg">
                      Send Email
                    </Button>
                  </form>
                </>
              )}
            </div>
            
            {/* Added spacing at the bottom of inner content to not cut off easily */}
            <div className="h-6"></div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
