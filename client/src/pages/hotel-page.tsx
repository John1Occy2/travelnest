import { useParams } from "wouter";
import { useHotel, useHotelRooms } from "@/hooks/use-hotels";
import { VirtualTour } from "@/components/hotels/virtual-tour";
import { PaymentForm } from "@/components/payments/payment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { createPaymentIntent } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Wifi, 
  Pool, 
  Utensils, 
  Car, 
  Dumbbell, 
  Coffee, 
  Landmark, 
  Dog, 
  Plane 
} from "lucide-react";
import { DateRange } from "react-day-picker";

const AMENITY_ICONS: Record<string, any> = {
  "WiFi": Wifi,
  "Pool": Pool,
  "Restaurant": Utensils,
  "Parking": Car,
  "Gym": Dumbbell,
  "Room Service": Coffee,
  "Spa": Landmark,
  "Pet Friendly": Dog,
  "Airport Shuttle": Plane
};

export default function HotelPage() {
  const params = useParams();
  const hotelId = params.id ? parseInt(params.id) : 0;
  const { data: hotel, isLoading: isLoadingHotel } = useHotel(hotelId);
  const { data: rooms, isLoading: isLoadingRooms } = useHotelRooms(hotelId);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [clientSecret, setClientSecret] = useState<string>();
  const [selectedRoomId, setSelectedRoomId] = useState<number>();
  const { toast } = useToast();

  if (isLoadingHotel || isLoadingRooms) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hotel || !rooms) {
    return <div>Hotel not found</div>;
  }

  const handleBookRoom = async (roomId: number, pricePerNight: number | string) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Select dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const nights = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Convert string price to number if needed
    const numericPrice = typeof pricePerNight === 'string' ? parseFloat(pricePerNight) : pricePerNight;
    const amount = nights * numericPrice * 100; // Convert to cents

    try {
      const { clientSecret } = await createPaymentIntent(amount);
      setClientSecret(clientSecret);
      setSelectedRoomId(roomId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {hotel.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{hotel.description}</p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Virtual Tours</h2>
              <VirtualTour tours={hotel.virtualTours || []} />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities?.map((amenity, i) => {
                  const Icon = AMENITY_ICONS[amenity] || Landmark;
                  return (
                    <Card key={i} className="bg-primary/5 hover:bg-primary/10 transition-colors">
                      <CardContent className="flex items-center p-4 gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{amenity}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Book Your Stay</h2>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="rounded-md border mb-6"
                />

                <div className="space-y-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg">{room.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Capacity: {room.capacity} guests
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary mb-2">
                              ${room.pricePerNight}
                              <span className="text-sm font-normal text-muted-foreground">/night</span>
                            </div>
                            <Button
                              onClick={() => handleBookRoom(room.id, room.pricePerNight)}
                              className="w-full md:w-auto"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {clientSecret && selectedRoomId && (
              <Card className="backdrop-blur-sm bg-white/50">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Complete Your Booking</h2>
                  <PaymentForm
                    clientSecret={clientSecret}
                    amount={100} // Calculate actual amount
                    onSuccess={() => {
                      setClientSecret(undefined);
                      setSelectedRoomId(undefined);
                      toast({
                        title: "Booking Successful",
                        description: "Your room has been booked successfully!",
                      });
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}