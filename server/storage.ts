import { 
  type User, 
  type InsertUser,
  type Event,
  type InsertEvent,
  type Match,
  type InsertMatch,
  type SeatCategory,
  type InsertSeatCategory,
  type CartItem,
  type InsertCartItem,
  users,
  events,
  matches,
  seatCategories,
  cartItems
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Match methods
  getMatches(eventId?: number): Promise<Match[]>;
  getMatch(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  
  // Seat category methods
  getSeatCategories(matchId: number): Promise<SeatCategory[]>;
  getSeatCategory(id: number): Promise<SeatCategory | undefined>;
  createSeatCategory(category: InsertSeatCategory): Promise<SeatCategory>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItem[]>;
  getCartItemsWithDetails(sessionId: string): Promise<any[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }
  
  // Match methods
  async getMatches(eventId?: number): Promise<Match[]> {
    if (eventId !== undefined && !isNaN(eventId)) {
      return await db.select().from(matches).where(eq(matches.eventId, eventId));
    }
    return await db.select().from(matches);
  }

  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match || undefined;
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values(insertMatch)
      .returning();
    return match;
  }
  
  // Seat category methods
  async getSeatCategories(matchId: number): Promise<SeatCategory[]> {
    return await db.select().from(seatCategories).where(eq(seatCategories.matchId, matchId));
  }

  async getSeatCategory(id: number): Promise<SeatCategory | undefined> {
    const [category] = await db.select().from(seatCategories).where(eq(seatCategories.id, id));
    return category || undefined;
  }

  async createSeatCategory(insertCategory: InsertSeatCategory): Promise<SeatCategory> {
    const [category] = await db
      .insert(seatCategories)
      .values(insertCategory)
      .returning();
    return category;
  }
  
  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async getCartItemsWithDetails(sessionId: string): Promise<any[]> {
    const items = await db
      .select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        matchId: cartItems.matchId,
        categoryId: cartItems.categoryId,
        quantity: cartItems.quantity,
        categoryName: seatCategories.category,
        price: seatCategories.price,
        colorCode: seatCategories.colorCode,
        homeTeam: matches.homeTeam,
        awayTeam: matches.awayTeam,
        matchCode: matches.matchCode,
        date: matches.date,
        time: matches.time,
        stadium: matches.stadium,
      })
      .from(cartItems)
      .leftJoin(seatCategories, eq(cartItems.categoryId, seatCategories.id))
      .leftJoin(matches, eq(cartItems.matchId, matches.id))
      .where(eq(cartItems.sessionId, sessionId));
    return items;
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const [item] = await db
      .insert(cartItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item || undefined;
  }

  async removeCartItem(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
