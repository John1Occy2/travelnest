import { useHotels } from "@/hooks/use-hotels";
import { HotelCard } from "@/components/hotels/hotel-card";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Hotel, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { data: hotels, isLoading } = useHotels();
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section with African-themed background */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"
            alt="African Landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Discover Africa's Finest Stays
            </h1>
            <p className="text-xl mb-8 text-white/90">
              From luxurious savannah lodges to beachfront resorts, experience the magic of African hospitality
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="default" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/search">
                  <Search className="h-5 w-5 mr-2" />
                  Search Hotels
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <Link href="/auth">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Hotels</h2>
            <p className="text-muted-foreground">
              Explore our curated selection of premium accommodations
            </p>
          </div>
          {user?.isHotelOwner && (
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <Hotel className="h-5 w-5 mr-2" />
                List Your Property
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels?.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
            {(!hotels || hotels.length === 0) && (
              <div className="col-span-full text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Hotels Found</h3>
                <p className="text-muted-foreground">
                  Be the first to list your property on TravelNest
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}