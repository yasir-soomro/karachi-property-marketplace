import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, MapPin } from "lucide-react"

export interface PropertyData {
  id: string;
  title: string;
  type: "buy" | "rent";
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  images: string[];
}

const PLACEHOLDER_PROPERTIES: PropertyData[] = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    type: "buy",
    price: 15000000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    address: "123 Main St, Downtown",
    images: ["https://picsum.photos/seed/prop1/800/600"],
  },
  {
    id: "2",
    title: "Luxury Villa with Pool",
    type: "buy",
    price: 45000000,
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 4000,
    address: "456 Oak Avenue, Suburbs",
    images: ["https://picsum.photos/seed/prop2/800/600"],
  },
  {
    id: "3",
    title: "Cozy Studio Near University",
    type: "rent",
    price: 50000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 500,
    address: "789 College Rd, Campus Area",
    images: ["https://picsum.photos/seed/prop3/800/600"],
  },
  {
    id: "4",
    title: "Spacious Family Home",
    type: "buy",
    price: 25000000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2500,
    address: "321 Pine Lane, Westside",
    images: ["https://picsum.photos/seed/prop4/800/600"],
  },
  {
    id: "5",
    title: "Minimalist Loft",
    type: "rent",
    price: 80000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 800,
    address: "654 Arts District",
    images: ["https://picsum.photos/seed/prop5/800/600"],
  },
  {
    id: "6",
    title: "Suburban Townhouse",
    type: "buy",
    price: 18000000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1800,
    address: "987 Maple Drive, Heights",
    images: ["https://picsum.photos/seed/prop6/800/600"],
  }
];

export function PropertyGrid({ properties = PLACEHOLDER_PROPERTIES }: { properties?: PropertyData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <Card 
          key={property.id} 
          className="overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-3 left-3 shadow-sm bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 border-0 capitalize">
              For {property.type}
            </Badge>
          </div>
          
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-semibold text-lg line-clamp-1 flex-1">{property.title}</h3>
              <div className="font-bold text-primary shrink-0">
                {property.type === 'buy' ? 'Rs ' + property.price.toLocaleString("en-PK") : 'Rs ' + property.price.toLocaleString("en-PK") + '/mo'}
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
        </Card>
      ))}
    </div>
  )
}
