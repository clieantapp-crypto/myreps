import { storage } from "./storage";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Check if data already exists
  const existingEvents = await storage.getEvents();
  if (existingEvents.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  // Create FIFA Arab Cup 2025 event
  const event = await storage.createEvent({
    title: "FIFA Arab Cup Qatar 2025™",
    startDate: "4 December 2025",
    endDate: "18 December 2025",
    location: "Various stadiums, Qatar",
    locationAr: "ملاعب مختلفة، قطر",
    code: "QAR25",
    basePrice: 25,
  });

  console.log("Created event:", event.title);

  // Create matches
  const matchesData = [
    {
      eventId: event.id,
      matchCode: "M10",
      homeTeam: "Palestine",
      awayTeam: "Tunisia",
      date: "4 DEC 2025",
      time: "17:30",
      dayOfWeek: "THURSDAY",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 40,
      status: "few",
    },
    {
      eventId: event.id,
      matchCode: "M11",
      homeTeam: "Qatar",
      awayTeam: "Bahrain",
      date: "4 DEC 2025",
      time: "21:00",
      dayOfWeek: "THURSDAY",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 60,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M12",
      homeTeam: "Egypt",
      awayTeam: "Algeria",
      date: "5 DEC 2025",
      time: "15:00",
      dayOfWeek: "FRIDAY",
      stadium: "Education City Stadium",
      stadiumAr: "استاد المدينة التعليمية",
      basePrice: 40,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M13",
      homeTeam: "Saudi Arabia",
      awayTeam: "Morocco",
      date: "5 DEC 2025",
      time: "19:00",
      dayOfWeek: "FRIDAY",
      stadium: "Al Thumama Stadium",
      stadiumAr: "استاد الثمامة",
      basePrice: 50,
      status: "sold_out",
    },
    {
      eventId: event.id,
      matchCode: "M14",
      homeTeam: "UAE",
      awayTeam: "Iraq",
      date: "6 DEC 2025",
      time: "16:00",
      dayOfWeek: "SATURDAY",
      stadium: "974 Stadium",
      stadiumAr: "استاد 974",
      basePrice: 40,
      status: "available",
    },
  ];

  for (const matchData of matchesData) {
    const match = await storage.createMatch(matchData);
    console.log(`Created match: ${match.matchCode} - ${match.homeTeam} v. ${match.awayTeam}`);

    // Create seat categories for each match
    const categories = [
      {
        matchId: match.id,
        category: "CAT 1",
        price: 60,
        available: true,
        colorCode: "#1e3a8a",
      },
      {
        matchId: match.id,
        category: "CAT 2",
        price: 40,
        available: true,
        colorCode: "#84cc16",
      },
      {
        matchId: match.id,
        category: "CAT 3",
        price: 30,
        available: false,
        colorCode: "#dc2626",
      },
    ];

    for (const categoryData of categories) {
      await storage.createSeatCategory(categoryData);
    }
  }

  console.log("Database seeding completed!");
}
