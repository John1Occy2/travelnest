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
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover luxury accommodations with virtual tours and personalized recommendations
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/search">
                  <Search className="h-5 w-5 mr-2" />
                  Search Hotels
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild>
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
              Explore our top-rated accommodations
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