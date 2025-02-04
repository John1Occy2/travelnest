import { useHotels } from "@/hooks/use-hotels";
import { HotelCard } from "@/components/hotels/hotel-card";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SearchPage() {
  const { data: hotels, isLoading } = useHotels();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHotels = hotels?.filter(hotel => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Hotel</h1>
        <Input
          type="search"
          placeholder="Search hotels by name, description, or location..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels?.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {(!filteredHotels || filteredHotels.length === 0) && (
            <div className="col-span-full text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Hotels Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
