import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertHotelSchema, insertRoomSchema, insertBookingSchema } from "@shared/schema";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia'
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Hotel routes
  app.get("/api/hotels", async (_req, res) => {
    const hotels = await storage.getHotels();
    res.json(hotels);
  });

  app.get("/api/hotels/owner/:id", async (req, res) => {
    const hotels = await storage.getHotelsByOwner(parseInt(req.params.id));
    res.json(hotels);
  });

  app.get("/api/hotels/:id", async (req, res) => {
    const hotel = await storage.getHotel(parseInt(req.params.id));
    if (!hotel) return res.sendStatus(404);
    res.json(hotel);
  });

  app.post("/api/hotels", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertHotelSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const hotel = await storage.createHotel({
      ...parsed.data,
      ownerId: req.user.id,
    });
    res.status(201).json(hotel);
  });

  // Room routes
  app.get("/api/hotels/:id/rooms", async (req, res) => {
    const rooms = await storage.getRoomsByHotel(parseInt(req.params.id));
    res.json(rooms);
  });

  app.post("/api/hotels/:id/rooms", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertRoomSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const room = await storage.createRoom({
      ...parsed.data,
      hotelId: parseInt(req.params.id),
    });
    res.status(201).json(room);
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertBookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const booking = await storage.createBooking({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(booking);
  });

  app.get("/api/user/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bookings = await storage.getBookingsByUser(req.user.id);
    res.json(bookings);
  });

  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  });

  // Add this after the existing payment routes
  app.post("/api/hotels/:id/subscribe", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const hotel = await storage.getHotel(parseInt(req.params.id));
    if (!hotel) return res.sendStatus(404);

    if (hotel.ownerId !== req.user.id) return res.sendStatus(403);

    try {
      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: hotel.stripeCustomerId || (await stripe.customers.create()).id,
        items: [{ price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update hotel with stripe customer id if it's new
      if (!hotel.stripeCustomerId) {
        await storage.updateHotel(hotel.id, {
          stripeCustomerId: subscription.customer as string,
        });
      }

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Subscription creation failed:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  // Add webhook handler for subscription events
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      // Handle subscription events
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          const hotel = await storage.getHotelByStripeCustomer(subscription.customer as string);
          if (hotel) {
            await storage.updateHotel(hotel.id, {
              subscriptionStatus: subscription.status,
            });
          }
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown webhook error';
      res.status(400).send(`Webhook Error: ${errorMessage}`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}