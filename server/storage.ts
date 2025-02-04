import { User, Hotel, Room, Booking, InsertUser, InsertHotel, InsertRoom, InsertBooking } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Hotel operations
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  getHotel(id: number): Promise<Hotel | undefined>;
  getHotels(): Promise<Hotel[]>;
  getHotelsByOwner(ownerId: number): Promise<Hotel[]>;
  updateHotel(id: number, hotel: Partial<Hotel>): Promise<Hotel>;
  getHotelByStripeCustomer(stripeCustomerId: string): Promise<Hotel | undefined>;

  // Room operations
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomsByHotel(hotelId: number): Promise<Room[]>;
  updateRoom(id: number, room: Partial<Room>): Promise<Room>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBookingsByHotel(hotelId: number): Promise<Booking[]>;
  updateBooking(id: number, booking: Partial<Booking>): Promise<Booking>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hotels: Map<number, Hotel>;
  private rooms: Map<number, Room>;
  private bookings: Map<number, Booking>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.hotels = new Map();
    this.rooms = new Map();
    this.bookings = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      isHotelOwner: insertUser.isHotelOwner ?? false,
      stripeCustomerId: insertUser.stripeCustomerId ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const id = this.currentId++;
    const newHotel: Hotel = {
      id,
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      ownerId: hotel.ownerId,
      images: hotel.images ?? null,
      virtualTours: hotel.virtualTours ?? null,
      amenities: hotel.amenities ?? null,
      rating: hotel.rating ?? null,
      stripeCustomerId: hotel.stripeCustomerId ?? null,
      stripeAccountId: hotel.stripeAccountId ?? null,
      subscriptionStatus: hotel.subscriptionStatus ?? null
    };
    this.hotels.set(id, newHotel);
    return newHotel;
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async getHotelsByOwner(ownerId: number): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(
      (hotel) => hotel.ownerId === ownerId,
    );
  }

  async updateHotel(id: number, hotel: Partial<Hotel>): Promise<Hotel> {
    const existing = await this.getHotel(id);
    if (!existing) throw new Error("Hotel not found");
    const updated = { ...existing, ...hotel };
    this.hotels.set(id, updated);
    return updated;
  }

  async getHotelByStripeCustomer(stripeCustomerId: string): Promise<Hotel | undefined> {
    return Array.from(this.hotels.values()).find(
      (hotel) => hotel.stripeCustomerId === stripeCustomerId
    );
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const id = this.currentId++;
    const newRoom: Room = {
      id,
      name: room.name,
      description: room.description,
      hotelId: room.hotelId,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      images: room.images ?? null,
      available: room.available ?? true
    };
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  async getRoomsByHotel(hotelId: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(
      (room) => room.hotelId === hotelId,
    );
  }

  async updateRoom(id: number, room: Partial<Room>): Promise<Room> {
    const existing = this.rooms.get(id);
    if (!existing) throw new Error("Room not found");
    const updated = { ...existing, ...room };
    this.rooms.set(id, updated);
    return updated;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const newBooking: Booking = {
      id,
      userId: booking.userId,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentIntentId: booking.paymentIntentId ?? null
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId,
    );
  }

  async getBookingsByHotel(hotelId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((booking) => {
      const room = this.rooms.get(booking.roomId);
      return room?.hotelId === hotelId;
    });
  }

  async updateBooking(id: number, booking: Partial<Booking>): Promise<Booking> {
    const existing = this.bookings.get(id);
    if (!existing) throw new Error("Booking not found");
    const updated = { ...existing, ...booking };
    this.bookings.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();