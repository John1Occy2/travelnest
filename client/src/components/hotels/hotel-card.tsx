import { Hotel } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [_, setLocation] = useLocation();

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <img 
          src={hotel.images?.[0] || "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa"}
          alt={hotel.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <CardTitle className="mt-4">{hotel.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
        <div className="flex gap-2 mt-2">
          {hotel.amenities?.slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-xs bg-accent px-2 py-1 rounded-full">
              {amenity}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => setLocation(`/hotels/${hotel.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}