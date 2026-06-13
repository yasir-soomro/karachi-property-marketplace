import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, MapPin, X, Phone, Mail, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

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
  description: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
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
    images: [
      "https://picsum.photos/seed/prop1/800/600",
      "https://picsum.photos/seed/prop1a/800/600",
      "https://picsum.photos/seed/prop1b/800/600"
    ],
    description: "Welcome to your stunning new apartment in the heart of downtown! This modern unit features an open floor plan, floor-to-ceiling windows with breathtaking city views, and premium hardwood flooring throughout. The chef's kitchen comes fully equipped with stainless steel appliances and granite countertops. Enjoy access to building amenities including a rooftop pool, state-of-the-art fitness center, and 24/7 concierge service.",
    ownerName: "Sarah Jenkins",
    ownerPhone: "+1 (555) 123-4567",
    ownerEmail: "sarah.j@example.com"
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
    images: [
      "https://picsum.photos/seed/prop2/800/600",
      "https://picsum.photos/seed/prop2a/800/600",
      "https://picsum.photos/seed/prop2b/800/600"
    ],
    description: "An exceptional luxury villa situated in a quiet, prestigious suburban neighborhood. This expansive 5-bedroom home offers a grand foyer, formal dining room, and a spectacular great room with a fireplace. The backyard is an entertainer's dream, featuring a custom heated pool, spa, outdoor kitchen, and manicured landscaping. Main level master suite includes a spa-like bathroom and dual walk-in closets.",
    ownerName: "Michael Chang",
    ownerPhone: "+1 (555) 987-6543",
    ownerEmail: "m.chang@luxuryestates.com"
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
    images: [
      "https://picsum.photos/seed/prop3/800/600",
      "https://picsum.photos/seed/prop3a/800/600"
    ],
    description: "Perfect location for students or young professionals! This bright and efficient studio apartment is located just two blocks from the main university campus. Features include an updated kitchenette, a spacious walk-in closet, and in-building laundry facilities. Rent includes water, trash, and high-speed internet. Quick access to public transit, coffee shops, and local bookstores.",
    ownerName: "Campus Housing Corp",
    ownerPhone: "+1 (555) 333-2222",
    ownerEmail: "leasing@campushousing.example.com"
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
    images: [
      "https://picsum.photos/seed/prop4/800/600",
      "https://picsum.photos/seed/prop4a/800/600",
      "https://picsum.photos/seed/prop4b/800/600"
    ],
    description: "Beautifully maintained two-story family home nestled in the highly sought-after Westside community. This home boasts a newly renovated kitchen with a large island, a cozy family room overlooking the backyard, and a formal living area. Upstairs, you'll find four generously sized bedrooms including a master suite. The large, fenced-in backyard provides a safe space for children to play, complete with a mature garden and patio area.",
    ownerName: "David & Emma Smith",
    ownerPhone: "+1 (555) 444-5555",
    ownerEmail: "smithfamily@example.com"
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
    images: [
      "https://picsum.photos/seed/prop5/800/600",
      "https://picsum.photos/seed/prop5a/800/600"
    ],
    description: "Experience urban living at its finest in this chic minimalist loft located right in the vibrant Arts District. Boasting soaring 15-foot ceilings, exposed brick walls, and massive industrial windows, this space is flooded with natural light. The open-concept design allows for flexible living and workspace arrangements. Trendy cafes, art galleries, and boutique shops are right at your doorstep.",
    ownerName: "Urban Properties NYC",
    ownerPhone: "+1 (555) 777-8888",
    ownerEmail: "hello@urbanprops.example.com"
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
    images: [
      "https://picsum.photos/seed/prop6/800/600",
      "https://picsum.photos/seed/prop6a/800/600",
      "https://picsum.photos/seed/prop6b/800/600",
      "https://picsum.photos/seed/prop6c/800/600"
    ],
    description: "Charming 3-bedroom townhouse situated in the peaceful Heights development. This move-in ready home features an inviting front porch, an open living and dining area with hardwood floors, and a modern kitchen with ample storage. The master bedroom includes an en-suite bathroom and double closets. Attached 2-car garage and a low-maintenance private courtyard make this an ideal home for busy professionals or a growing family.",
    ownerName: "Elena Rodriguez",
    ownerPhone: "+1 (555) 666-9999",
    ownerEmail: "erodriguez@example.com"
  }
];

export function PropertyGrid({ properties = PLACEHOLDER_PROPERTIES }: { properties?: PropertyData[] }) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePropertyClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setActiveImageIndex(0);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <Card 
            key={property.id} 
            className="overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => handlePropertyClick(property)}
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

      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background">
          {selectedProperty && (
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh]">
              {/* Left Side: Images */}
              <div className="bg-muted flex flex-col items-center">
                <div className="w-full relative h-[300px] md:h-full min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={selectedProperty.images[activeImageIndex]} 
                    alt={selectedProperty.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 shadow-md bg-background/90 text-foreground capitalize">
                    For {selectedProperty.type}
                  </Badge>
                </div>
                
                {/* Image Thumbnails */}
                {selectedProperty.images.length > 1 && (
                  <div className="w-full pt-2 p-4 bg-background border-t flex gap-2 overflow-x-auto">
                    {selectedProperty.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative h-16 w-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImageIndex === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Details */}
              <ScrollArea className="h-[400px] md:h-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <DialogTitle className="text-2xl font-bold leading-tight">
                      {selectedProperty.title}
                    </DialogTitle>
                  </div>
                  
                  <DialogDescription className="text-muted-foreground flex items-center gap-1.5 mb-4">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{selectedProperty.address}</span>
                  </DialogDescription>
                  
                  <div className="text-3xl font-bold text-primary mb-6">
                    {selectedProperty.type === 'buy' ? 'Rs ' + selectedProperty.price.toLocaleString("en-PK") : 'Rs ' + selectedProperty.price.toLocaleString("en-PK") + '/mo'}
                  </div>

                  {/* Key Details Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {selectedProperty.bedrooms > 0 && (
                      <div className="bg-muted/50 border rounded-lg p-3 flex flex-col items-center justify-center text-center">
                        <Bed className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="font-semibold">{selectedProperty.bedrooms}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Beds</span>
                      </div>
                    )}
                    {selectedProperty.bathrooms > 0 && (
                      <div className="bg-muted/50 border rounded-lg p-3 flex flex-col items-center justify-center text-center">
                        <Bath className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="font-semibold">{selectedProperty.bathrooms}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Baths</span>
                      </div>
                    )}
                    <div className="bg-muted/50 border rounded-lg p-3 flex flex-col items-center justify-center text-center">
                      <Square className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="font-semibold">{selectedProperty.areaSqft}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Sqft</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-2">About this property</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                    <h4 className="font-semibold mb-4 text-primary">Contact Owner</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center border shadow-sm">
                          <User className="w-5 h-5 text-foreground/70" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium text-foreground">{selectedProperty.ownerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center border shadow-sm">
                          <Phone className="w-5 h-5 text-foreground/70" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{selectedProperty.ownerPhone}</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0">Call</Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center border shadow-sm">
                          <Mail className="w-5 h-5 text-foreground/70" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{selectedProperty.ownerEmail}</p>
                        </div>
                        <Button size="sm" className="shrink-0">Email</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
