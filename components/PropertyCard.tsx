import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Star, MapPin, Heart, MessagesSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Property } from "./Marketplace"
import { motion } from "motion/react"
import { StarRating } from "./StarRating"

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  isCompared?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onToggleCompare?: (property: Property, e: React.MouseEvent) => void;
  onClick?: () => void;
  userRating?: number;
  onRate?: (rating: number) => void;
  onMessageOwner?: (propertyId: string) => void;
  index?: number;
}

export function PropertyCard({
  property,
  isFavorite = false,
  isCompared = false,
  onToggleFavorite,
  onToggleCompare,
  onClick,
  userRating,
  onRate,
  onMessageOwner,
  index = 0
}: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Card 
        className="overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl h-full flex flex-col"
        onClick={onClick}
      >
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-3 left-3 shadow-md bg-background/90 backdrop-blur-sm text-foreground hover:bg-background border-0">
            {property.type === "buy" ? "For Sale" : "For Rent"}
          </Badge>
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
            <Button 
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-full shadow-md backdrop-blur-sm bg-background/90 hover:bg-background ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
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
              className={`h-8 shadow-md backdrop-blur-sm bg-background/90 hover:bg-background font-medium transition-colors ${isCompared ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
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
            <MapPin className="w-3.5 h-3.5" />
            {property.address}
          </p>
        </CardHeader>

        <CardContent className="p-4 py-2 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5 font-medium" title="Bedrooms">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5 font-medium" title="Bathrooms">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 font-medium" title="Area sqft">
              <Square className="w-4 h-4" />
              <span>{property.areaSqft} sqft</span>
            </div>
          </div>
          {property.propertyRating && (
            <div className="flex items-center gap-2 mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
              <StarRating 
                initialRating={userRating || Math.round(property.propertyRating)} 
                onRate={onRate}
                size={16}
              />
              <div className="flex items-center text-sm font-medium">
                <span>{userRating ? ((property.propertyRating * (property.ratingCount || 1) + userRating) / ((property.ratingCount || 1) + 1)).toFixed(1) : property.propertyRating}</span>
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  ({(property.ratingCount || 0) + (userRating ? 1 : 0)})
                </span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-4 border-t mt-auto flex items-center justify-between bg-muted/20 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              {property.ownerName.charAt(0)}
            </div>
            <span className="text-sm font-medium">{property.ownerName}</span>
            <div className="flex items-center gap-0.5 text-yellow-500 border-l pl-2 ml-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-medium text-foreground">{property.ownerRating}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1.5 ml-auto text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onMessageOwner?.(property.id);
            }}
          >
            <MessagesSquare className="w-3.5 h-3.5" />
            Contact
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
