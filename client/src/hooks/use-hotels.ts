import { useQuery, useMutation } from "@tanstack/react-query";
import { Hotel, Room, Booking } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export function useHotels() {
  return useQuery<Hotel[]>({ 
    queryKey: ["/api/hotels"]
  });
}

export function useHotel(id: number) {
  return useQuery<Hotel>({ 
    queryKey: [`/api/hotels/${id}`]
  });
}

export function useHotelsByOwner(ownerId: number | undefined) {
  return useQuery<Hotel[]>({
    queryKey: [`/api/hotels/owner/${ownerId}`],
    enabled: !!ownerId,
  });
}

export function useHotelRooms(hotelId: number) {
  return useQuery<Room[]>({ 
    queryKey: [`/api/hotels/${hotelId}/rooms`]
  });
}

export function useCreateHotel() {
  return useMutation({
    mutationFn: async (hotel: Omit<Hotel, "id">) => {
      const res = await apiRequest("POST", "/api/hotels", hotel);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hotels"] });
    },
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (booking: Omit<Booking, "id">) => {
      const res = await apiRequest("POST", "/api/bookings", booking);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/bookings"] });
    },
  });
}