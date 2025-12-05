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
    startDate: "5 December 2025",
    endDate: "18 December 2025",
    location: "Various stadiums, Qatar",
    locationAr: "ملاعب مختلفة، قطر",
    code: "QAR25",
    basePrice: 25,
  });

  console.log("Created event:", event.title);

  // Create matches based on FIFA Arab Cup schedule
  const matchesData = [
    // Group Stage Matches - Day 1 (5 December 2025)
    {
      eventId: event.id,
      matchCode: "M1",
      homeTeam: "قطر",
      awayTeam: "فلسطين",
      date: "5 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الخميس",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M2",
      homeTeam: "الكويت",
      awayTeam: "الإمارات",
      date: "5 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الخميس",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 25,
      status: "available",
    },
    // Day 2 (6 December 2025)
    {
      eventId: event.id,
      matchCode: "M3",
      homeTeam: "السعودية",
      awayTeam: "موريتانيا",
      date: "6 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الجمعة",
      stadium: "Education City Stadium",
      stadiumAr: "استاد المدينة التعليمية",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M4",
      homeTeam: "الأردن",
      awayTeam: "العراق",
      date: "6 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الجمعة",
      stadium: "Al Thumama Stadium",
      stadiumAr: "استاد الثمامة",
      basePrice: 25,
      status: "available",
    },
    // Day 3 (7 December 2025)
    {
      eventId: event.id,
      matchCode: "M5",
      homeTeam: "مصر",
      awayTeam: "اليمن",
      date: "7 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "السبت",
      stadium: "974 Stadium",
      stadiumAr: "استاد 974",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M6",
      homeTeam: "المغرب",
      awayTeam: "الجزائر",
      date: "7 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "السبت",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 25,
      status: "available",
    },
    // Day 4 (8 December 2025)
    {
      eventId: event.id,
      matchCode: "M7",
      homeTeam: "تونس",
      awayTeam: "لبنان",
      date: "8 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الأحد",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M8",
      homeTeam: "ليبيا",
      awayTeam: "السودان",
      date: "8 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الأحد",
      stadium: "Education City Stadium",
      stadiumAr: "استاد المدينة التعليمية",
      basePrice: 25,
      status: "available",
    },
    // Day 5 (9 December 2025) - Matchday 2
    {
      eventId: event.id,
      matchCode: "M9",
      homeTeam: "فلسطين",
      awayTeam: "الكويت",
      date: "9 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الاثنين",
      stadium: "Al Thumama Stadium",
      stadiumAr: "استاد الثمامة",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M10",
      homeTeam: "الإمارات",
      awayTeam: "قطر",
      date: "9 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الاثنين",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 25,
      status: "available",
    },
    // Day 6 (10 December 2025)
    {
      eventId: event.id,
      matchCode: "M11",
      homeTeam: "موريتانيا",
      awayTeam: "الأردن",
      date: "10 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الثلاثاء",
      stadium: "974 Stadium",
      stadiumAr: "استاد 974",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "M12",
      homeTeam: "العراق",
      awayTeam: "السعودية",
      date: "10 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الثلاثاء",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 25,
      status: "available",
    },
    // Quarter-Finals (13 December 2025)
    {
      eventId: event.id,
      matchCode: "QF1",
      homeTeam: "ربع النهائي 1",
      awayTeam: "ربع النهائي 1",
      date: "13 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "السبت",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 40,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "QF2",
      homeTeam: "ربع النهائي 2",
      awayTeam: "ربع النهائي 2",
      date: "13 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "السبت",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 40,
      status: "available",
    },
    // Semi-Finals (16 December 2025)
    {
      eventId: event.id,
      matchCode: "SF1",
      homeTeam: "نصف النهائي 1",
      awayTeam: "نصف النهائي 1",
      date: "16 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الثلاثاء",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 60,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "SF2",
      homeTeam: "نصف النهائي 2",
      awayTeam: "نصف النهائي 2",
      date: "16 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الثلاثاء",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 60,
      status: "available",
    },
    // Final (18 December 2025)
    {
      eventId: event.id,
      matchCode: "FINAL",
      homeTeam: "النهائي",
      awayTeam: "النهائي",
      date: "18 ديسمبر 2025",
      time: "20:00",
      dayOfWeek: "الخميس",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 100,
      status: "available",
    },
  ];

  for (const matchData of matchesData) {
    const match = await storage.createMatch(matchData);
    console.log(`Created match: ${match.matchCode} - ${match.homeTeam} vs ${match.awayTeam}`);

    // Create seat categories for each match
    const categories = [
      {
        matchId: match.id,
        category: "CAT 1",
        price: matchData.basePrice * 2,
        available: true,
        colorCode: "#1e3a8a",
      },
      {
        matchId: match.id,
        category: "CAT 2",
        price: Math.round(matchData.basePrice * 1.5),
        available: true,
        colorCode: "#84cc16",
      },
      {
        matchId: match.id,
        category: "CAT 3",
        price: matchData.basePrice,
        available: true,
        colorCode: "#dc2626",
      },
    ];

    for (const categoryData of categories) {
      await storage.createSeatCategory(categoryData);
    }
  }

  console.log("Database seeding completed!");
}
