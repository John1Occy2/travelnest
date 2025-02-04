import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { HotelRegistration } from "@/components/hotels/hotel-registration";
import { RoomManagement } from "@/components/hotels/room-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHotelsByOwner } from "@/hooks/use-hotels";
import { Loader2 } from "lucide-react";
import { SubscriptionManagement } from "@/components/hotels/subscription-management";
import { useQueryClient } from "@tanstack/react-query";


export default function DashboardPage() {
  const { user } = useAuth();
  const { data: hotels, isLoading } = useHotelsByOwner(user?.id);
  const [selectedHotelId, setSelectedHotelId] = useState<number>();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hotel = hotels?.find((hotel) => hotel.id === selectedHotelId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hotel Management Dashboard</h1>

      <Tabs defaultValue="hotels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hotels">My Hotels</TabsTrigger>
          <TabsTrigger value="registration">Register New Hotel</TabsTrigger>
          {selectedHotelId && (
            <>
              <TabsTrigger value="rooms">Manage Rooms</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="hotels" className="space-y-6">
          {hotels?.map((hotel) => (
            <Card key={hotel.id} className="cursor-pointer hover:bg-accent/5" onClick={() => setSelectedHotelId(hotel.id)}>
              <CardHeader>
                <CardTitle>{hotel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {hotel.address}
                </p>
                <div className="flex gap-2 mt-2">
                  {hotel.amenities?.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs bg-accent px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="registration">
          <HotelRegistration />
        </TabsContent>

        {selectedHotelId && (
          <TabsContent value="rooms">
            <RoomManagement hotelId={selectedHotelId} />
          </TabsContent>
        )}

        {selectedHotelId && hotel && (
          <TabsContent value="subscription">
            <SubscriptionManagement
              hotel={hotel}
              onSubscriptionUpdate={() => {
                queryClient.invalidateQueries({
                  queryKey: [`/api/hotels/owner/${user?.id}`],
                });
              }}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}