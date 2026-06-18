import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Star, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Property } from "./Marketplace"

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  isCompared?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onToggleCompare?: (property: Property, e: React.MouseEvent) => void;
  onClick?: () => void;
  userRating?: number;
}

export function PropertyCard({
  property,
  isFavorite = false,
  isCompared = false,
  onToggleFavorite,
  onToggleCompare,
  onClick,
  userRating
}: PropertyCardProps) {
  return (
    <Card 
      className="overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
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
            className={`h-8 w-8 rounded-full shadow-sm backdrop-blur-sm bg-background/80 hover:bg-background/90 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(property.id, e);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button 
            variant={isCompared ? "default" : "secondary"}
            size="sm"
            className={`h-8 shadow-sm backdrop-blur-sm bg-background/80 hover:bg-background/90 font-medium ${isCompared ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare?.(property, e);
            }}
          >
            {isCompared ? "Added" : "Compare"}
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
        {property.propertyRating && (
          <div className="flex items-center gap-1 text-yellow-500 mt-2 text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            <span>{userRating ? ((property.propertyRating * (property.ratingCount || 1) + userRating) / ((property.ratingCount || 1) + 1)).toFixed(1) : property.propertyRating}</span>
            <span className="text-muted-foreground font-normal text-xs ml-1">
              ({(property.ratingCount || 0) + (userRating ? 1 : 0)})
            </span>
          </div>
        )}
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
  )
}
