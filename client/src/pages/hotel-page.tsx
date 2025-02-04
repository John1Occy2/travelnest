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
import { Loader2 } from "lucide-react";

export default function HotelPage() {
  const { id } = useParams();
  const hotelId = parseInt(id);
  const { data: hotel, isLoading: isLoadingHotel } = useHotel(hotelId);
  const { data: rooms, isLoading: isLoadingRooms } = useHotelRooms(hotelId);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
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

  const handleBookRoom = async (roomId: number, pricePerNight: number) => {
    if (selectedDates.length !== 2) {
      toast({
        title: "Select dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const nights = Math.ceil(
      (selectedDates[1].getTime() - selectedDates[0].getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const amount = nights * pricePerNight * 100; // Convert to cents

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
          <p className="text-muted-foreground mb-6">{hotel.description}</p>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Virtual Tours</h2>
            <VirtualTour tours={hotel.virtualTours || []} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((amenity, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-accent rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                numberOfMonths={2}
                className="rounded-md border mb-6"
              />

              <div className="space-y-4">
                {rooms.map((room) => (
                  <Card key={room.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Capacity: {room.capacity} guests
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${room.pricePerNight}/night
                          </div>
                          <Button
                            onClick={() =>
                              handleBookRoom(room.id, room.pricePerNight)
                            }
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
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <PaymentForm
                  clientSecret={clientSecret}
                  amount={100} // Calculate actual amount
                  onSuccess={() => {
                    setClientSecret(undefined);
                    setSelectedRoomId(undefined);
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
