import { pgTable, text, serial, decimal, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isHotelOwner: boolean("is_hotel_owner").default(false),
  stripeCustomerId: text("stripe_customer_id"),
});

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  ownerId: integer("owner_id").notNull(),
  images: text("images").array(),
  virtualTours: jsonb("virtual_tours").$type<Array<{url: string, title: string}>>(),
  amenities: text("amenities").array(),
  rating: decimal("rating"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeAccountId: text("stripe_account_id"),
  subscriptionStatus: text("subscription_status"),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricePerNight: decimal("price_per_night").notNull(),
  capacity: integer("capacity").notNull(),
  images: text("images").array(),
  available: boolean("available").default(true),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  roomId: integer("room_id").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  totalPrice: decimal("total_price").notNull(),
  status: text("status").notNull(),
  paymentIntentId: text("payment_intent_id"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertHotelSchema = createInsertSchema(hotels);
export const insertRoomSchema = createInsertSchema(rooms);
export const insertBookingSchema = createInsertSchema(bookings);

export type User = typeof users.$inferSelect;
export type Hotel = typeof hotels.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Booking = typeof bookings.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;