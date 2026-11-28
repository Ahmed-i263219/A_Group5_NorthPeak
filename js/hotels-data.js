/**
 * js/hotels-data.js
 * Shared stays data and pricing logic for NorthPeak Tours
 * Shared across Stays Directory, Room Details, and Stay Reservation pages.
 */

const HOTELS = [
  {
    id: "karimabad-heritage-lodge",
    name: "Karimabad Heritage Lodge",
    destination: "hunza",
    destinationLabel: "Hunza Valley",
    location: "Zero Point, Karimabad, Hunza (Alt: 2,438m)",
    pricePerNight: 18000,
    rating: 4.9,
    reviews: 142,
    maxGuests: 6,
    image: "karimabad-heritage-lodge.jpg",
    summary: "Traditional cedarwood stone lodge overlooking Baltit Fort and Rakaposhi peaks.",
    description: "Nestled high in the historic terraced slopes of Karimabad, this heritage lodge blends authentic Hunzakut stone and timber craftsmanship with heated modern comforts. Step out onto sunlit balconies capturing unobstructed 360-degree panoramas of Rakaposhi, Ultar Sar, and Ladyfinger Peak.",
    amenities: ["Free High-Speed Wi-Fi", "Wood Pellet Heating", "24/7 Solar Backup", "Organic Hunza Breakfast", "Balcony Mountain Views", "Hot Water Boiler"],
    winterOpen: true,
    accessNote: "Paved metallic road directly to property; 4x4 optional in light snow. Valet parking on-site.",
    checkInTime: "14:00",
    checkOutTime: "11:30",
    cancellationPolicy: "Free cancellation up to 48 hours prior to check-in. Non-refundable during peak Eid and Cherry Blossom weeks.",
    guestReviews: [
      { name: "Bilal Farooq", rating: 5, date: "October 2025", text: "Waking up to the golden dawn on Rakaposhi from our deluxe room balcony was the highlight of our northern trip." },
      { name: "Sarah Jenkins", rating: 5, date: "August 2025", text: "Exceptional hospitality, warm traditional apricot tea on arrival, and immaculate heated rooms." },
      { name: "Dr. Ayesha Malik", rating: 4.8, date: "July 2025", text: "Very central location close to Baltit Fort. Delicious local walnut cake and hearty breakfasts." }
    ],
    rooms: [
      {
        id: "khl-std",
        name: "Standard Heritage Room",
        pricePerNight: 18000,
        capacity: 2,
        bedType: "1 Queen Bed",
        sizeSqFt: 280,
        amenities: ["Mountain View", "En-suite Heated Bath", "Electric Kettle", "Smart Heater"],
        description: "Cozy wood-paneled bedroom designed for couples or solo trekkers with panoramic mountain windows."
      },
      {
        id: "khl-dlx",
        name: "Deluxe Rakaposhi Panorama",
        pricePerNight: 23400, // 1.3x multiplier
        capacity: 3,
        bedType: "1 King Bed + 1 Single Daybed",
        sizeSqFt: 390,
        amenities: ["Private Balcony", "Fireplace", "En-suite Bath with Tub", "Tea & Coffee Station", "Smart TV"],
        description: "Spacious corner room featuring handcrafted deodar woodwork and an expansive private terrace overlooking the valley."
      },
      {
        id: "khl-ste",
        name: "Mir Family Suite",
        pricePerNight: 32400, // 1.8x multiplier
        capacity: 6,
        bedType: "2 King Beds + 2 Rollaway Beds",
        sizeSqFt: 620,
        amenities: ["Two Bedrooms", "Living Lounge", "Kitchenette", "Dual Balconies", "2 Luxury Baths"],
        description: "Two-bedroom grand suite tailored for extended families, including a warm parlor and private kitchenette."
      }
    ]
  },
  {
    id: "naltar-pine-chalets",
    name: "Naltar Pine Chalets",
    destination: "naltar",
    destinationLabel: "Naltar Valley",
    location: "Upper Naltar Ski Valley, Gilgit (Alt: 2,895m)",
    pricePerNight: 9500,
    rating: 4.6,
    reviews: 88,
    maxGuests: 4,
    image: "naltar-pine-chalets.jpg",
    summary: "Rustic pine-log cabins beside crystal alpine streams and dense pine forests.",
    description: "Surrounded by pine-scented woodlands and turquoise glacial lakes, Naltar Pine Chalets offers an authentic eco-retreat away from tourist crowds. Ideal for nature lovers and summer trail adventurers.",
    amenities: ["Log-Fire Stoves", "Natural Spring Water", "Local Trout Dining", "Star-Gazing Deck", "Trekking Guides", "Forest Trails"],
    winterOpen: false,
    accessNote: "Strictly accessible via 4x4 Jeep from Nomal (approx. 2 hours). Impassable in heavy winter snowfalls.",
    checkInTime: "13:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation up to 5 days before check-in due to weather-dependent mountain transit.",
    guestReviews: [
      { name: "Hamza Tariq", rating: 4.7, date: "September 2025", text: "Fresh stream water right by the cabin and fresh trout grilled under the stars. Unmatched rustic charm." },
      { name: "Clara Vance", rating: 4.5, date: "July 2025", text: "Breathtaking location near the colorful lakes. Ensure you book a sturdy jeep from Nomal." },
      { name: "Usman Ghani", rating: 4.6, date: "June 2025", text: "Peaceful forest silence, warm blankets, and friendly staff who arranged local horses for our trek." }
    ],
    rooms: [
      {
        id: "npc-std",
        name: "Standard Pine Cabin",
        pricePerNight: 9500,
        capacity: 2,
        bedType: "2 Twin Beds",
        sizeSqFt: 240,
        amenities: ["Forest View", "Hot Shower", "Log Wood Stove", "Reading Nook"],
        description: "Classic pine-scented cabin with cozy twin bedding and authentic wood stove heater."
      },
      {
        id: "npc-dlx",
        name: "Deluxe Stream-side Chalet",
        pricePerNight: 12350, // 1.3x multiplier
        capacity: 3,
        bedType: "1 Queen Bed + 1 Daybed",
        sizeSqFt: 340,
        amenities: ["Stream Deck", "Fireplace", "En-suite Bath", "Campfire Kit"],
        description: "Step directly onto an over-water wooden deck listening to the soothing sounds of Naltar stream."
      },
      {
        id: "npc-fam",
        name: "Alpine Family Loft",
        pricePerNight: 16150, // 1.7x multiplier
        capacity: 4,
        bedType: "1 Queen Bed + 2 Twin Beds in Loft",
        sizeSqFt: 480,
        amenities: ["Mezzanine Loft", "Mountain View", "Dining Table", "Heated Blankets"],
        description: "Two-level wooden cabin with an adventurous upper sleeping loft loved by children and small groups."
      }
    ]
  },
  {
    id: "duikar-horizon-ridge-hotel",
    name: "Duikar Horizon Ridge Hotel",
    destination: "duikar",
    destinationLabel: "Duikar (Eagle's Nest)",
    location: "Eagle's Nest Ridge, Duikar, Hunza (Alt: 2,850m)",
    pricePerNight: 22000,
    rating: 4.9,
    reviews: 176,
    maxGuests: 6,
    image: "duikar-horizon-ridge-hotel.jpg",
    summary: "The highest vantage stay in Hunza, famous for legendary sunrise views over 7,000m summits.",
    description: "Perched high on the rugged ridge of Duikar, this boutique clifftop retreat puts you at eye level with Ladyfinger Peak, Golden Peak, and Diran. Bask in dramatic sunrises from floor-to-ceiling glass windows and private sky decks.",
    amenities: ["Panoramic Rooftop Lounge", "Heated Flooring", "24/7 Generator & Solar Power", "Multi-Cuisine Restaurant", "Free Wi-Fi", "Oxygen Concentrators On-Demand"],
    winterOpen: true,
    accessNote: "Steep 25-minute winding paved road up from Karimabad. Snow chains or 4x4 required during winter frost.",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation up to 72 hours before arrival. 50% charge within 48 hours.",
    guestReviews: [
      { name: "Zainab Shah", rating: 5, date: "November 2025", text: "Standing on the terrace at 6 AM seeing the golden sun strike Ladyfinger peak is an experience that stays with you forever." },
      { name: "Marcus Klein", rating: 4.9, date: "October 2025", text: "Superb heating even as outside dipped below freezing. Hot water was instant, food in the glass cafe was top tier." },
      { name: "Rashid Mehmood", rating: 4.8, date: "August 2025", text: "Worth every rupee for the view alone. Friendly manager arranged our stargazing camp setup." }
    ],
    rooms: [
      {
        id: "dhr-std",
        name: "Horizon Standard",
        pricePerNight: 22000,
        capacity: 2,
        bedType: "1 Queen Bed",
        sizeSqFt: 300,
        amenities: ["Eagle's Nest View", "Underfloor Heating", "Luxury Shower", "Tea Maker"],
        description: "Modern comfort overlooking the terraced valleys of Hunza and Nagar below."
      },
      {
        id: "dhr-dlx",
        name: "Celestial Sunrise Suite",
        pricePerNight: 28600, // 1.3x multiplier
        capacity: 3,
        bedType: "1 King Bed + 1 Rollaway",
        sizeSqFt: 420,
        amenities: ["Private Clifftop Balcony", "Panoramic Bay Window", "Bathtub", "Espresso Machine"],
        description: "Floor-to-ceiling glass frontage angled precisely for the dawn glow over Ultar Sar."
      },
      {
        id: "dhr-fam",
        name: "Summit Penthouse",
        pricePerNight: 41800, // 1.9x multiplier
        capacity: 6,
        bedType: "2 King Bedrooms + Sofa Bed",
        sizeSqFt: 720,
        amenities: ["Panoramic Terrace", "Living Room with Fireplace", "2 Bathrooms", "Dining Space"],
        description: "The crown jewel of Duikar: a grand clifftop penthouse commanding endless Himalayan vistas."
      }
    ]
  },
  {
    id: "kachura-lakeside-pavilion",
    name: "Kachura Lakeside Pavilion",
    destination: "skardu",
    destinationLabel: "Skardu (Kachura)",
    location: "Lower Kachura Lake Road, Skardu, Baltistan (Alt: 2,228m)",
    pricePerNight: 24500,
    rating: 4.8,
    reviews: 210,
    maxGuests: 6,
    image: "kachura-lakeside-pavilion.jpg",
    summary: "Lakeside luxury cottages surrounded by heritage apple and apricot orchards.",
    description: "Located on the tranquil shores of Kachura Lake, this sanctuary offers private wooden piers, tranquil orchard pathways, and Tibetan-Balti architectural flourishes. Savor freshly caught local trout right on the wooden deck.",
    amenities: ["Private Lake Pier", "Central Heating", "High-speed Starlink Wi-Fi", "Balti & Continental Dining", "Airport Shuttle", "Lakeside Bonfire"],
    winterOpen: true,
    accessNote: "Convenient 20-minute drive on smooth paved highway from Skardu International Airport.",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 3 days prior. Flights into Skardu can be weather-affected; date changes honored free.",
    guestReviews: [
      { name: "Omer Zubair", rating: 5, date: "October 2025", text: "The autumn colors reflecting on the crystal lake were otherworldly. Top-tier dining and airport pickup." },
      { name: "Emily Watson", rating: 4.8, date: "September 2025", text: "Peaceful escape with swans swimming right by our breakfast pavilion. Very comfortable beds and warm heating." },
      { name: "Farhan Ali", rating: 4.7, date: "May 2025", text: "The trout was the best we had in Pakistan. Great base for visiting Shangrila and Upper Kachura." }
    ],
    rooms: [
      {
        id: "klp-std",
        name: "Orchard View Room",
        pricePerNight: 24500,
        capacity: 2,
        bedType: "1 King Bed or 2 Twins",
        sizeSqFt: 320,
        amenities: ["Garden View", "Heated Bathroom", "Coffee Bar", "Work Desk"],
        description: "Secluded amidst blossoming apricot trees with fragrant breezes from the lakeshore."
      },
      {
        id: "klp-dlx",
        name: "Lakeside Waters Chalet",
        pricePerNight: 31850, // 1.3x multiplier
        capacity: 3,
        bedType: "1 King Bed + 1 Daybed",
        sizeSqFt: 440,
        amenities: ["Direct Lake Pier Access", "Soaking Tub", "Fireplace", "Outdoor Loungers"],
        description: "Direct walk-out access to the emerald waters with a private deck and sun loungers."
      },
      {
        id: "klp-ste",
        name: "Baltistan Royal Pavilion",
        pricePerNight: 46550, // 1.9x multiplier
        capacity: 6,
        bedType: "2 King En-suite Bedrooms",
        sizeSqFt: 780,
        amenities: ["Private Pier & Garden", "Two Master Baths", "Grand Lounge", "Butler Service"],
        description: "Extravagant lakeside residence with handcrafted wooden ceilings and dedicated attendant service."
      }
    ]
  },
  {
    id: "ushu-forest-riverside-inn",
    name: "Ushu Forest Riverside Inn",
    destination: "kalam",
    destinationLabel: "Swat (Kalam)",
    location: "Ushu Forest Highway, Kalam, Swat (Alt: 2,150m)",
    pricePerNight: 12500,
    rating: 4.7,
    reviews: 115,
    maxGuests: 4,
    image: "ushu-forest-riverside-inn.jpg",
    summary: "Secluded riverfront retreat in the towering cedar and deodar woods of Kalam.",
    description: "Nestled along the rushing waters of the Swat River at the entrance of the mystical Ushu Deodar Forest, this inn offers crisp mountain air, riverside barbecue decks, and cozy winter wood stoves.",
    amenities: ["Riverside Terrace", "Wood Stoves & Electric Blankets", "24/7 Power Generator", "Traditional Swati Trout", "Guided Forest Hikes", "Campfire Facility"],
    winterOpen: true,
    accessNote: "Paved route up to Kalam bazaar; last 3km is a compacted gravel trail easily traversed by regular sedans.",
    checkInTime: "13:30",
    checkOutTime: "11:30",
    cancellationPolicy: "Free cancellation up to 48 hours prior to arrival.",
    guestReviews: [
      { name: "Saad Qureshi", rating: 5, date: "October 2025", text: "The sound of Swat river rushing outside your window while sitting next to the warm bukhari heater is unbeatable." },
      { name: "Nadia Khan", rating: 4.6, date: "July 2025", text: "Deodar forest right across the river. Perfect family retreat from Lahore's summer heat." },
      { name: "David Chen", rating: 4.6, date: "June 2025", text: "Delicious chapli kebabs and trout. Clean rooms and very accommodating staff." }
    ],
    rooms: [
      {
        id: "ufr-std",
        name: "Standard River Cottage",
        pricePerNight: 12500,
        capacity: 2,
        bedType: "1 Queen Bed",
        sizeSqFt: 260,
        amenities: ["River View", "Hot Water Boiler", "Electric Blankets", "Tea Maker"],
        description: "Intimate riverside room with calming views of the deodar canopies and running river."
      },
      {
        id: "ufr-dlx",
        name: "Deluxe Deodar Balcony",
        pricePerNight: 16250, // 1.3x multiplier
        capacity: 3,
        bedType: "1 King Bed + 1 Single Bed",
        sizeSqFt: 360,
        amenities: ["Riverfront Balcony", "Wood Stove Bukhari", "Modern Bath", "Smart TV"],
        description: "Private wooden balcony hanging right above the riverbank with aroma of natural pine wood."
      },
      {
        id: "ufr-fam",
        name: "Swat Valley Family Chalet",
        pricePerNight: 21250, // 1.7x multiplier
        capacity: 4,
        bedType: "2 Queen Beds",
        sizeSqFt: 510,
        amenities: ["Two Queen Beds", "Spacious Lounge Area", "Dining Corner", "Campfire Deck"],
        description: "Generous family room furnished with Swati carvings and expansive views of the Ushu valley."
      }
    ]
  },
  {
    id: "kunhar-alpine-lodge",
    name: "Kunhar Alpine Lodge",
    destination: "naran",
    destinationLabel: "Kaghan (Naran)",
    location: "Babusar Road, Near Kunhar River, Naran (Alt: 2,409m)",
    pricePerNight: 14000,
    rating: 4.5,
    reviews: 94,
    maxGuests: 5,
    image: "kunhar-alpine-lodge.jpg",
    summary: "Cozy riverside alpine getaway right at the doorstep of Lake Saiful Muluk.",
    description: "Set right on the banks of the glistening Kunhar River in the Kaghan Valley, this alpine-style lodge features manicured riverside gardens, wooden sundecks, and quick access to Lake Saiful Muluk and Babusar Top.",
    amenities: ["Riverfront Garden", "Lakeside Excursion Booking", "Continuous Hot Water", "On-site Buffet Dining", "Free Wi-Fi", "Ample Private Parking"],
    winterOpen: false,
    accessNote: "Accessible via Hazara Motorway and N-15 Highway. Closed from December through March due to heavy Babusar-Naran snow.",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation up to 72 hours before arrival.",
    guestReviews: [
      { name: "Khurram Shahzad", rating: 4.7, date: "August 2025", text: "Great family hotel with grassy lawn directly touching the Kunhar river. The jeep track to Saiful Muluk starts right nearby." },
      { name: "Fatima Noor", rating: 4.5, date: "July 2025", text: "Clean rooms, hot water was dependable, and breakfast buffet had great parathas and eggs." },
      { name: "Liam O'Connor", rating: 4.4, date: "September 2025", text: "Refreshing breezes and cool weather in September. Highly recommended for exploring Kaghan valley." }
    ],
    rooms: [
      {
        id: "kal-std",
        name: "Alpine Standard Room",
        pricePerNight: 14000,
        capacity: 2,
        bedType: "1 Queen Bed",
        sizeSqFt: 270,
        amenities: ["River Sounds", "En-suite Bath", "Heater on Request", "Electric Kettle"],
        description: "Comfortable standard lodging with mountain views and rapid access to the dining terrace."
      },
      {
        id: "kal-dlx",
        name: "Deluxe Kunhar Riverfront",
        pricePerNight: 18200, // 1.3x multiplier
        capacity: 3,
        bedType: "1 King Bed + 1 Rollaway",
        sizeSqFt: 380,
        amenities: ["Private Balcony", "River Vista", "Mini Fridge", "Modern Bathroom"],
        description: "Enjoy your morning chai overlooking the turquoise glacial currents of the Kunhar."
      },
      {
        id: "kal-fam",
        name: "Kaghan Family Suite",
        pricePerNight: 24500, // 1.75x multiplier
        capacity: 5,
        bedType: "1 King Bed + 3 Single Beds",
        sizeSqFt: 580,
        amenities: ["Two Connected Rooms", "Two Bathrooms", "Living Area", "Balcony"],
        description: "Interconnected multi-bed suite built for vacationing families exploring Kaghan."
      }
    ]
  }
];

/**
 * Helper: format currency consistently in PKR
 * @param {number} amount
 * @returns {string} e.g. "Rs. 18,000"
 */
function formatPKR(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return `Rs. ${rounded.toLocaleString("en-PK")}`;
}

/**
 * Helper: checks if a date string (YYYY-MM-DD) falls in winter (Dec 1 - Feb 28/29)
 * @param {string|Date} dateStr
 * @returns {boolean}
 */
function isWinterDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const month = d.getMonth(); // 0 = Jan, 1 = Feb, 11 = Dec
  return month === 11 || month === 0 || month === 1;
}

/**
 * Helper: calculate number of nights between two date strings (YYYY-MM-DD)
 * Defaults to minimum 1 night if dates are equal or invalid.
 * @param {string} checkin
 * @param {string} checkout
 * @returns {number}
 */
function calculateNights(checkin, checkout) {
  if (!checkin || !checkout) return 1;
  const start = new Date(checkin);
  const end = new Date(checkout);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

/**
 * calculateStayTotal: Pure function calculating itemised pricing breakdown.
 * Used by Stays Directory, Room Details, and Stay Reservation pages.
 *
 * @param {Object} hotel - Selected hotel object from HOTELS
 * @param {Object} [room] - Selected room object from hotel.rooms (optional, defaults to hotel base price)
 * @param {string} checkin - YYYY-MM-DD
 * @param {string} checkout - YYYY-MM-DD
 * @param {number} [guests=2] - Number of guests
 * @param {Object} [extras={}] - Selected add-on services: { airportShuttle: bool, firewoodHeater: bool, guidedTrek: bool, mealPlan: bool }
 * @returns {Object} Itemised price breakdown:
 *   {
 *     nights: number,
 *     baseRatePerNight: number,
 *     roomSubtotal: number,
 *     seasonSurcharge: number,
 *     seasonLabel: string,
 *     longStayDiscount: number,
 *     longStayLabel: string,
 *     extrasTotal: number,
 *     extrasBreakdown: Array<{ name: string, price: number }>,
 *     tax: number,
 *     grandTotal: number
 *   }
 */
function calculateStayTotal(hotel, room, checkin, checkout, guests = 2, extras = {}) {
  const nights = calculateNights(checkin, checkout);
  const baseRatePerNight = room ? room.pricePerNight : (hotel ? hotel.pricePerNight : 0);
  const roomSubtotal = baseRatePerNight * nights;

  // Seasonal Surcharge logic:
  // Summer peak (June, July, August): 15% peak surcharge
  // Autumn cherry / foliage (October): 10% seasonal surcharge
  // Winter (Dec, Jan, Feb): 10% heating & logistics surcharge (if open)
  let seasonMultiplier = 0;
  let seasonLabel = "Standard Season (0%)";
  if (checkin) {
    const d = new Date(checkin);
    const month = d.getMonth(); // 0 to 11
    if (month >= 5 && month <= 7) { // Jun, Jul, Aug
      seasonMultiplier = 0.15;
      seasonLabel = "Peak Summer Season (+15%)";
    } else if (month === 9) { // Oct
      seasonMultiplier = 0.10;
      seasonLabel = "Autumn Blossom Season (+10%)";
    } else if (month === 11 || month === 0 || month === 1) { // Dec, Jan, Feb
      seasonMultiplier = 0.10;
      seasonLabel = "Winter Heating & Logistics Surcharge (+10%)";
    }
  }
  const seasonSurcharge = Math.round(roomSubtotal * seasonMultiplier);

  // Long stay discount:
  // >= 5 nights: 10% off room subtotal
  // >= 3 nights: 5% off room subtotal
  let discountRate = 0;
  let longStayLabel = "None";
  if (nights >= 5) {
    discountRate = 0.10;
    longStayLabel = "Long Stay Discount (10% off for 5+ nights)";
  } else if (nights >= 3) {
    discountRate = 0.05;
    longStayLabel = "Extended Stay Discount (5% off for 3+ nights)";
  }
  const longStayDiscount = Math.round(roomSubtotal * discountRate);

  // Extras calculation
  const extrasBreakdown = [];
  let extrasTotal = 0;

  if (extras.airportShuttle) {
    const cost = 5500; // Flat one-time private 4x4 / airport pickup
    extrasTotal += cost;
    extrasBreakdown.push({ name: "Dedicated 4x4 / Airport Transfer", price: cost });
  }

  if (extras.firewoodHeater) {
    const cost = 2500 * nights; // Per night wood heater / bukhari crate
    extrasTotal += cost;
    extrasBreakdown.push({ name: `Wood Stove Bukhari Fuel (${nights} nights)`, price: cost });
  }

  if (extras.mealPlan) {
    const guestCount = Number(guests) || 2;
    const cost = 1800 * guestCount * nights; // Daily traditional breakfast & dinner
    extrasTotal += cost;
    extrasBreakdown.push({ name: `Daily Half-Board Meals (${guestCount} guests x ${nights} nights)`, price: cost });
  }

  if (extras.guidedTrek) {
    const cost = 6000; // Local certified mountain guide per excursion
    extrasTotal += cost;
    extrasBreakdown.push({ name: "Certified Mountain Trekking Guide (Full Day)", price: cost });
  }

  // Subtotal before tax
  const taxableBase = Math.max(0, roomSubtotal + seasonSurcharge - longStayDiscount + extrasTotal);

  // Northern Areas tourism levy & standard services tax: 5%
  const taxRate = 0.05;
  const tax = Math.round(taxableBase * taxRate);

  const grandTotal = taxableBase + tax;

  return {
    nights,
    baseRatePerNight,
    roomSubtotal,
    seasonSurcharge,
    seasonLabel,
    longStayDiscount,
    longStayLabel,
    extrasTotal,
    extrasBreakdown,
    tax,
    grandTotal
  };
}

// ==========================================================================
// Shared Saved Stays (Favorites) Manager across all pages
// ==========================================================================
const SAVED_STORAGE_KEY = "northpeak_saved_stays_v1";

function getSavedStayIds() {
  try {
    const data = localStorage.getItem(SAVED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn("Could not read saved stays from localStorage:", err);
    return [];
  }
}

function setSavedStayIds(ids) {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
    updateSharedSavedUI();
  } catch (err) {
    console.warn("Could not write saved stays to localStorage:", err);
  }
}

function toggleSavedStayId(id) {
  const ids = getSavedStayIds();
  const index = ids.indexOf(id);
  if (index > -1) {
    ids.splice(index, 1);
  } else {
    ids.push(id);
  }
  setSavedStayIds(ids);
  return ids.includes(id);
}

function updateSharedSavedUI() {
  const savedIds = getSavedStayIds();
  const badges = document.querySelectorAll(".np-saved-count");
  badges.forEach((b) => {
    b.textContent = savedIds.length;
  });

  const savedListContainer = document.getElementById("savedListContainer");
  if (savedListContainer) {
    if (savedIds.length === 0) {
      savedListContainer.innerHTML = `
        <div class="text-center py-4 text-muted">
          <p class="mb-1">You have no saved stays yet.</p>
          <small>Click the heart icon on any stay card or detail page to save it for quick reference.</small>
        </div>
      `;
    } else {
      const savedHotels = HOTELS.filter((h) => savedIds.includes(h.id));
      savedListContainer.innerHTML = savedHotels
        .map(
          (h) => `
          <div class="np-saved-item">
            <img src="../images/${h.image}" alt="${h.name}" class="np-saved-thumb" />
            <div class="np-saved-info">
              <div class="np-saved-name">${h.name}</div>
              <div class="np-saved-meta">${h.destinationLabel} • ${formatPKR(h.pricePerNight)}/night</div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <a href="room-details.html?id=${encodeURIComponent(h.id)}" class="np-btn np-btn-primary np-btn-sm">
                View
              </a>
              <button type="button" class="np-btn np-btn-danger np-btn-sm remove-saved-btn" data-id="${h.id}" title="Remove stay" aria-label="Remove ${h.name} from saved">
                ✕
              </button>
            </div>
          </div>
        `
        )
        .join("");

      savedListContainer.querySelectorAll(".remove-saved-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          toggleSavedStayId(id);
          // If page has a custom onSavedChange callback (e.g. to sync heart button on stays or room-details page)
          if (typeof window.onSavedStaysChanged === "function") {
            window.onSavedStaysChanged(id);
          }
        });
      });
    }
  }

  // Clear button inside modal
  const clearBtn = document.getElementById("clearSavedBtn");
  if (clearBtn && !clearBtn.dataset.bound) {
    clearBtn.dataset.bound = "true";
    clearBtn.addEventListener("click", () => {
      setSavedStayIds([]);
      if (typeof window.onSavedStaysChanged === "function") {
        window.onSavedStaysChanged(null);
      }
    });
  }
}

// Auto init on load
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    updateSharedSavedUI();
  });
}

// Make accessible in both browser window and potential node unit testing environments
if (typeof window !== "undefined") {
  window.HOTELS = HOTELS;
  window.formatPKR = formatPKR;
  window.isWinterDate = isWinterDate;
  window.calculateNights = calculateNights;
  window.calculateStayTotal = calculateStayTotal;
  window.getSavedStayIds = getSavedStayIds;
  window.setSavedStayIds = setSavedStayIds;
  window.toggleSavedStayId = toggleSavedStayId;
  window.updateSharedSavedUI = updateSharedSavedUI;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HOTELS,
    formatPKR,
    isWinterDate,
    calculateNights,
    calculateStayTotal,
    getSavedStayIds,
    setSavedStayIds,
    toggleSavedStayId,
    updateSharedSavedUI
  };
}
