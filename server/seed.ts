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
    endDate: "25 December 2025",
    location: "Various stadiums, Qatar",
    locationAr: "ملاعب مختلفة، قطر",
    code: "QAR25",
    basePrice: 25,
  });

  console.log("Created event:", event.title);

  const matchesData = [
    // المرحلة 2 - الجمعة 6 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "1",
      homeTeam: "الأردن",
      awayTeam: "الكويت",
      date: "6 ديسمبر 2025",
      time: "20:00",
      dayOfWeek: "الجمعة",
      stadium: "Ahmed bin Ali Stadium",
      stadiumAr: "استاد أحمد بن علي",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "2",
      homeTeam: "البحرين",
      awayTeam: "الجزائر",
      date: "6 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الجمعة",
      stadium: "Ahmed bin Ali Stadium",
      stadiumAr: "استاد أحمد بن علي",
      basePrice: 25,
      status: "available",
    },

    // السبت 6 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "3",
      homeTeam: "السودان",
      awayTeam: "العراق",
      date: "6 ديسمبر 2025",
      time: "20:00",
      dayOfWeek: "السبت",
      stadium: "974 Stadium",
      stadiumAr: "استاد 974",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "4",
      homeTeam: "مصر",
      awayTeam: "الإمارات",
      date: "6 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "السبت",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 25,
      status: "available",
    },

    // المرحلة 3 - الأحد 7 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "5",
      homeTeam: "قطر",
      awayTeam: "تونس",
      date: "7 ديسمبر 2025",
      time: "18:00",
      dayOfWeek: "الأحد",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "6",
      homeTeam: "سوريا",
      awayTeam: "فلسطين",
      date: "7 ديسمبر 2025",
      time: "18:00",
      dayOfWeek: "الأحد",
      stadium: "Education City Stadium",
      stadiumAr: "استاد المدينة التعليمية",
      basePrice: 25,
      status: "available",
    },

    // الاثنين 8 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "7",
      homeTeam: "المغرب",
      awayTeam: "السعودية",
      date: "8 ديسمبر 2025",
      time: "18:00",
      dayOfWeek: "الاثنين",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "8",
      homeTeam: "عمان",
      awayTeam: "جزر القمر",
      date: "8 ديسمبر 2025",
      time: "18:00",
      dayOfWeek: "الاثنين",
      stadium: "974 Stadium",
      stadiumAr: "استاد 974",
      basePrice: 25,
      status: "available",
    },

    // الثلاثاء 9 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "9",
      homeTeam: "الأردن",
      awayTeam: "مصر",
      date: "9 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الثلاثاء",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "10",
      homeTeam: "الكويت",
      awayTeam: "الإمارات",
      date: "9 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الثلاثاء",
      stadium: "Al Thumama Stadium",
      stadiumAr: "استاد الثمامة",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "11",
      homeTeam: "الجزائر",
      awayTeam: "العراق",
      date: "9 ديسمبر 2025",
      time: "18:00",
      dayOfWeek: "الثلاثاء",
      stadium: "Education City Stadium",
      stadiumAr: "استاد المدينة التعليمية",
      basePrice: 25,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "12",
      homeTeam: "البحرين",
      awayTeam: "السودان",
      date: "9 ديسمبر 2025",
      time: "18:00",
      dayOfWeek: "الثلاثاء",
      stadium: "974 Stadium",
      stadiumAr: "استاد 974",
      basePrice: 25,
      status: "available",
    },

    // الخميس 11 ديسمبر 2025 - ربع النهائي
    {
      eventId: event.id,
      matchCode: "QF1",
      homeTeam: "B1",
      awayTeam: "A2",
      date: "11 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الخميس",
      stadium: "Ahmed bin Ali Stadium",
      stadiumAr: "استاد أحمد بن علي",
      basePrice: 40,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "QF2",
      homeTeam: "A1",
      awayTeam: "B2",
      date: "11 ديسمبر 2025",
      time: "18:30",
      dayOfWeek: "الخميس",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 40,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "QF3",
      homeTeam: "C1",
      awayTeam: "D2",
      date: "11 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الخميس",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 40,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "QF4",
      homeTeam: "D1",
      awayTeam: "C2",
      date: "11 ديسمبر 2025",
      time: "18:30",
      dayOfWeek: "الخميس",
      stadium: "Education City Stadium",
      stadiumAr: "استاد المدينة التعليمية",
      basePrice: 40,
      status: "available",
    },

    // نصف النهائي - الأحد 14 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "SF1",
      homeTeam: "الفائز ربع النهائي 1",
      awayTeam: "الفائز ربع النهائي 2",
      date: "14 ديسمبر 2025",
      time: "17:30",
      dayOfWeek: "الأحد",
      stadium: "Lusail Stadium",
      stadiumAr: "استاد لوسيل",
      basePrice: 60,
      status: "available",
    },
    {
      eventId: event.id,
      matchCode: "SF2",
      homeTeam: "الفائز ربع النهائي 3",
      awayTeam: "الفائز ربع النهائي 4",
      date: "14 ديسمبر 2025",
      time: "20:30",
      dayOfWeek: "الأحد",
      stadium: "Al Bayt Stadium",
      stadiumAr: "استاد البيت",
      basePrice: 60,
      status: "available",
    },

    // النهائي - الخميس 18 ديسمبر 2025
    {
      eventId: event.id,
      matchCode: "FINAL",
      homeTeam: "الفائز نصف النهائي 1",
      awayTeam: "الفائز نصف النهائي 2",
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
    console.log(
      `Created match: ${match.matchCode} - ${match.homeTeam} vs ${match.awayTeam}`,
    );

    // Create seat categories for each match
    const categories = [
      {
        matchId: match.id,
        category: "CAT 1",
        price: matchData.basePrice * 2,
        available: true,
        colorCode: "#8B1538",
      },
      {
        matchId: match.id,
        category: "CAT 2",
        price: Math.round(matchData.basePrice * 1.5),
        available: true,
        colorCode: "#2C5F7F",
      },
      {
        matchId: match.id,
        category: "CAT 3",
        price: matchData.basePrice,
        available: true,
        colorCode: "#1E3A5F",
      },
    ];

    for (const categoryData of categories) {
      await storage.createSeatCategory(categoryData);
    }
  }

  console.log("Database seeding completed!");
}
