import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEventSchema, 
  insertMatchSchema, 
  insertSeatCategorySchema, 
  insertCartItemSchema 
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // BIN Lookup endpoint
  app.post("/api/bin-lookup", async (req, res) => {
    try {
      const { bin } = req.body;
      if (!bin || bin.length < 6) {
        return res.status(400).json({ error: "Invalid BIN" });
      }

      const cleanBin = bin.replace(/\s/g, "").substring(0, 6);
      const apiKey = process.env.RAPIDAPI_BIN_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
      }

      const response = await fetch(`https://bin-ip-checker.p.rapidapi.com/?bin=${cleanBin}`, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'bin-ip-checker.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bin: cleanBin })
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: "BIN lookup failed" });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("BIN lookup error:", error);
      res.status(500).json({ error: "BIN lookup failed" });
    }
  });
  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req, res) => {
    try {
      const eventIdParam = req.query.eventId as string;
      const eventId = eventIdParam ? parseInt(eventIdParam) : undefined;
      const allMatches = await storage.getMatches(eventId);
      
      // Filter out ended matches (past dates)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const arabicMonths: Record<string, number> = {
        'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3,
        'مايو': 4, 'يونيو': 5, 'يوليو': 6, 'أغسطس': 7,
        'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11
      };
      
      const parseArabicDate = (dateStr: string): Date | null => {
        const parts = dateStr.split(' ');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0]);
        const month = arabicMonths[parts[1]];
        const year = parseInt(parts[2]);
        if (isNaN(day) || month === undefined || isNaN(year)) return null;
        return new Date(year, month, day);
      };
      
      const upcomingMatches = allMatches.filter(match => {
        const matchDate = parseArabicDate(match.date);
        if (!matchDate) return true;
        return matchDate >= today;
      });
      
      res.json(upcomingMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const match = await storage.getMatch(id);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  // Seat category routes
  app.get("/api/seat-categories", async (req, res) => {
    try {
      const matchId = parseInt(req.query.matchId as string);
      const categories = await storage.getSeatCategories(matchId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seat categories" });
    }
  });

  app.post("/api/seat-categories", async (req, res) => {
    try {
      const validatedData = insertSeatCategorySchema.parse(req.body);
      const category = await storage.createSeatCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid seat category data" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.get("/api/cart/:sessionId/details", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const items = await storage.getCartItemsWithDetails(sessionId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching cart details:", error);
      res.status(500).json({ error: "Failed to fetch cart details" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const item = await storage.addCartItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const item = await storage.updateCartItem(id, quantity);
      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeCartItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  return httpServer;
}
