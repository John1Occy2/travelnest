import { useHotels } from "@/hooks/use-hotels";
import { HotelCard } from "@/components/hotels/hotel-card";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: hotels, isLoading } = useHotels();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
        <p className="text-muted-foreground">
          Discover luxury accommodations with virtual tours and personalized recommendations
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels?.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
