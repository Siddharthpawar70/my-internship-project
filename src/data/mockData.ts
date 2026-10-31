import { Hotel, RoomType, AddOn, Coupon, Promotion, Review, Booking, HousekeepingRoom, MaintenanceTicket, NotificationItem, GroupQuoteRequest } from '../types';

export const DESTINATIONS = [
  {
    name: 'Goa',
    state: 'Goa',
    tagline: 'Sun-kissed beaches, coastal luxury & heritage villas',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 38,
    avgPrice: 6500,
    popularFor: ['Beaches', 'Nightlife', 'Seafood', 'Water Sports']
  },
  {
    name: 'Udaipur',
    state: 'Rajasthan',
    tagline: 'Palatial royalty, tranquil lakes & romantic sunsets',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 26,
    avgPrice: 9200,
    popularFor: ['Lake Pichola', 'Heritage Palaces', 'Royal Dining']
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Sea-facing high rises, glamorous culture & iconic promenades',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 45,
    avgPrice: 8400,
    popularFor: ['Marine Drive', 'Business Hubs', 'Luxury Dining']
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    tagline: 'Boutique retreats, lush hillside gateways & cultural heritage',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 32,
    avgPrice: 4800,
    popularFor: ['Koregaon Park', 'Osho Garden', 'Aga Khan Palace', 'Hill Escapes']
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'The Pink City: Havelis, desert luxury & grandeur',
    image: 'https://images.unsplash.com/photo-1603288940300-4b0559385c76?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 29,
    avgPrice: 6200,
    popularFor: ['Amer Fort', 'Hawa Mahal', 'Handicrafts', 'Boutique Havelis']
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Garden city elegance, tech suites & premier luxury',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 40,
    avgPrice: 5900,
    popularFor: ['Cubbon Park', 'Brewery Strolls', 'Indiranagar', 'Tech Parks']
  },
  {
    name: 'Manali',
    state: 'Himachal Pradesh',
    tagline: 'Snow-capped peaks, alpine wooden chalets & river retreats',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 24,
    avgPrice: 5100,
    popularFor: ['Solang Valley', 'Snow Chalets', 'Rohtang Pass', 'Cafes']
  },
  {
    name: 'Kerala',
    state: 'Kerala',
    tagline: 'Emerald backwaters, spice plantations & Ayurvedic resorts',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 34,
    avgPrice: 7200,
    popularFor: ['Alleppey Houseboats', 'Munnar Tea Hills', 'Ayurveda Spa']
  },
  {
    name: 'Delhi',
    state: 'NCR',
    tagline: 'Diplomatic enclaves, monumental history & 5-star elegance',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 42,
    avgPrice: 6800,
    popularFor: ['Connaught Place', 'Lutyens Mansions', 'Old Delhi Delicacies']
  },
  {
    name: 'Lonavala',
    state: 'Maharashtra',
    tagline: 'Misty hills, monsoon waterfalls & weekend private villas',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 22,
    avgPrice: 5600,
    popularFor: ['Tiger Point', 'Monsoon Trails', 'Private Pool Villas']
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Nizami hospitality, lakeside palaces & contemporary luxury',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 31,
    avgPrice: 5400,
    popularFor: ['Charminar', 'HITEC City', 'Biryani Food Trails', 'Falaknuma']
  },
  {
    name: 'Shimla',
    state: 'Himachal Pradesh',
    tagline: 'Colonial charm, pine forests & panoramic Himalayan views',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80',
    hotelCount: 20,
    avgPrice: 6100,
    popularFor: ['The Mall Road', 'Ridge', 'Toy Train', 'Heritage Stays']
  }
];

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'stayaura-pune-grand',
    name: 'The Grand Aurum & Spa',
    tagline: 'Palatial luxury sanctuary nestled in lush Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    address: '88 North Main Road, Koregaon Park, Pune, Maharashtra 411001',
    coordinates: { lat: 18.5362, lng: 73.8940 },
    starRating: 5,
    guestRating: 4.8,
    reviewCount: 342,
    pricePerNight: 4999,
    originalPrice: 6800,
    featured: true,
    luxury: true,
    type: 'Luxury Hotel',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immerse yourself in timeless elegance at The Grand Aurum & Spa. Located in the leafy canopy of Koregaon Park, this flagship property features marble colonnades, signature Ayurvedic therapies, temperature-controlled lap pools, and multi-cuisine fine dining curated by celebrity chefs.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Heated Outdoor Pool', 'Steam & Sauna', 'Business Lounge', 'Ballroom', 'Kids Play Area', 'Concierge Service'],
    cancellationPolicy: 'Free cancellation up to 24 hours prior to check-in. Non-refundable within 24 hours.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '2.5 km from City Center',
    nearbyPlaces: [
      { name: 'Pune International Airport (PNQ)', distance: '6.2 km', type: 'Airport' },
      { name: 'Pune Railway Station', distance: '3.8 km', type: 'Railway Station' },
      { name: 'Phoenix Marketcity Mall', distance: '4.5 km', type: 'Shopping Mall' },
      { name: 'Osho International Meditation Resort', distance: '0.8 km', type: 'Attraction' },
      { name: 'Aga Khan Palace', distance: '2.1 km', type: 'Heritage' }
    ],
    faqs: [
      { question: 'What are the check-in and check-out timings?', answer: 'Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out can be requested upon booking.' },
      { question: 'Is breakfast included?', answer: 'Yes, our Deluxe and Suite rate plans include a lavish buffet breakfast at The Olive Orchard restaurant.' },
      { question: 'Is airport pick-up available?', answer: 'Yes, private luxury chauffeur transfers can be selected as an add-on during checkout.' }
    ]
  },
  {
    id: 'stayaura-pune-viman',
    name: 'Aura Heights Business & Suites',
    tagline: 'Modern executive suites minutes from tech parks and airport',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Sakore Nagar, Viman Nagar, Pune, Maharashtra 411014',
    coordinates: { lat: 18.5679, lng: 73.9143 },
    starRating: 4,
    guestRating: 4.6,
    reviewCount: 218,
    pricePerNight: 3499,
    originalPrice: 4500,
    featured: false,
    luxury: false,
    type: 'Business Hotel',
    heroImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Engineered for seamless productivity and urban convenience. Aura Heights offers ergonomic workstations, ultra-fast fiber Wi-Fi, 24-hour business lounges, and tranquil acoustic-glazed rooms right beside Pune airport.',
    checkInTime: '1:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Gym', 'Restaurant', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['High-speed Co-working Pods', 'Meeting Rooms', 'Express Laundry', '24h Bistro'],
    cancellationPolicy: 'Free cancellation until 48 hours before arrival. Afterwards, 1 night fee applies.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '6.8 km from City Center',
    nearbyPlaces: [
      { name: 'Pune Airport (PNQ)', distance: '1.2 km', type: 'Airport' },
      { name: 'Phoenix Marketcity Mall', distance: '1.5 km', type: 'Shopping Mall' },
      { name: 'EON Free Zone IT Park', distance: '5.0 km', type: 'Business' }
    ],
    faqs: [
      { question: 'Do you offer airport shuttle?', answer: 'Yes, we provide complimentary scheduled shuttles every 30 minutes to Pune Airport.' }
    ]
  },
  {
    id: 'stayaura-mumbai-colaba',
    name: 'The Marine Sovereign Mumbai',
    tagline: 'Colonial maritime grandeur overlooking the Arabian Sea',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    starRating: 5,
    guestRating: 4.9,
    reviewCount: 580,
    pricePerNight: 9800,
    originalPrice: 13500,
    featured: true,
    luxury: true,
    type: 'Luxury Hotel',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An architectural jewel set directly along the historic Colaba shoreline. Step through teakwood archways into expansive suites with sweeping sea views, butler service, Michelin-inspired dining, and vintage cocktail lounges.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Sea-view Infinity Pool', 'Private Yacht Charter Desk', 'Heritage Library Bar', 'Butler Service'],
    cancellationPolicy: 'Free cancellation until 3 days before check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '1.2 km from Marine Drive',
    nearbyPlaces: [
      { name: 'Gateway of India', distance: '0.3 km', type: 'Heritage' },
      { name: 'Chhatrapati Shivaji Maharaj Terminus', distance: '2.5 km', type: 'Railway Station' },
      { name: 'Colaba Causeway', distance: '0.4 km', type: 'Shopping' },
      { name: 'Mumbai Airport (BOM)', distance: '24 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Are sea view rooms guaranteed?', answer: 'Sea View Premier and Presidential suites guarantee unobstructed Arabian Sea views.' }
    ]
  },
  {
    id: 'stayaura-mumbai-juhu',
    name: 'Aura Horizon Beachfront Resort',
    tagline: 'Tropical coastal paradise along Juhu golden sands',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Juhu Tara Road, Juhu Beach, Mumbai, Maharashtra 400049',
    coordinates: { lat: 19.0988, lng: 72.8267 },
    starRating: 5,
    guestRating: 4.7,
    reviewCount: 412,
    pricePerNight: 7600,
    originalPrice: 9900,
    featured: true,
    luxury: true,
    type: 'Resort',
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Set amidst five acres of swaying palms with direct private access to Juhu Beach. Featuring open-air cabanas, sunset deck cocktail bar, bespoke wellness spa, and curated seafood grills.',
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning'],
    propertyFacilities: ['Private Beach Access', 'Lagoon Pool', 'Ayurvedic Pavilion', 'Sunset Terrace'],
    cancellationPolicy: 'Free cancellation up to 48 hours before arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '4.5 km from Bandra West',
    nearbyPlaces: [
      { name: 'Juhu Beach', distance: '0.1 km', type: 'Beach' },
      { name: 'Mumbai Airport (BOM)', distance: '6.5 km', type: 'Airport' },
      { name: 'Prithvi Theatre', distance: '1.2 km', type: 'Culture' }
    ],
    faqs: [
      { question: 'Is there direct access to the beach?', answer: 'Yes, guests have private gated pathway access directly onto the beach promenade.' }
    ]
  },
  {
    id: 'stayaura-goa-candolim',
    name: 'Aura Azura Coastal Sanctuary',
    tagline: 'Portuguese-inspired private villa suites with beachfront infinity pool',
    city: 'Goa',
    state: 'Goa',
    address: 'Fort Aguada Road, Candolim, North Goa 403515',
    coordinates: { lat: 15.5186, lng: 73.7634 },
    starRating: 5,
    guestRating: 4.9,
    reviewCount: 630,
    pricePerNight: 8200,
    originalPrice: 11000,
    featured: true,
    luxury: true,
    type: 'Resort',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Blended seamlessly between historic Goan-Portuguese courtyards and modern beach luxury. Featuring red-terracotta roofed suites, handcrafted azulejo tiles, an infinity pool touching the ocean, and sunset live jazz nights.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning'],
    propertyFacilities: ['Private Beach Cabanas', 'Goan Culinary Academy', 'Water Sports Desk', 'Bicycle Rentals'],
    cancellationPolicy: 'Free cancellation until 7 days prior to arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '0.3 km from Candolim Beach',
    nearbyPlaces: [
      { name: 'Candolim Beach', distance: '0.2 km', type: 'Beach' },
      { name: 'Aguada Fort', distance: '2.4 km', type: 'Heritage' },
      { name: 'Mopa International Airport (GOX)', distance: '28 km', type: 'Airport' },
      { name: 'Dabolim Airport (GOI)', distance: '36 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Do you arrange airport transfers from both Goa airports?', answer: 'Yes, both Mopa and Dabolim transfers are available via our private luxury fleet.' }
    ]
  },
  {
    id: 'stayaura-goa-vagator',
    name: 'Sunkissed Palms Boutique Resort',
    tagline: 'Bohemian cliffside escape overlooking Ozran & Little Vagator',
    city: 'Goa',
    state: 'Goa',
    address: 'Ozran Beach Road, Small Vagator, Anjuna, Goa 403509',
    coordinates: { lat: 15.5985, lng: 73.7380 },
    starRating: 4,
    guestRating: 4.7,
    reviewCount: 295,
    pricePerNight: 5200,
    originalPrice: 6900,
    featured: false,
    luxury: false,
    type: 'Boutique Hotel',
    heroImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A vibrant boutique hideaway perched on the Vagator red laterite cliffs. Surrounded by organic gardens, bamboo chalets, yoga decks, and an electric rooftop sunset cocktail lounge.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Restaurant', 'Bar', 'Room Service', 'Air Conditioning'],
    propertyFacilities: ['Yoga Pavilion', 'Sunset Sunken Bar', 'Artisanal Bakery'],
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '0.5 km from Ozran Beach',
    nearbyPlaces: [
      { name: 'Vagator Beach', distance: '0.4 km', type: 'Beach' },
      { name: 'Chapora Fort', distance: '1.2 km', type: 'Heritage' },
      { name: 'Thalassa Greek Restaurant', distance: '1.5 km', type: 'Dining' }
    ],
    faqs: [
      { question: 'Is the cliff trail accessible directly from the resort?', answer: 'Yes, a private paved pathway leads straight down to Little Vagator beach.' }
    ]
  },
  {
    id: 'stayaura-udaipur-pichola',
    name: 'Palacio de Aura Lake Palace',
    tagline: 'Iconic royal heritage palace floating on the waters of Lake Pichola',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Lake Pichola Heritage Island, Udaipur, Rajasthan 313001',
    coordinates: { lat: 24.5764, lng: 73.6800 },
    starRating: 5,
    guestRating: 4.95,
    reviewCount: 710,
    pricePerNight: 12500,
    originalPrice: 16500,
    featured: true,
    luxury: true,
    type: 'Heritage Palace',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Constructed with shimmering white Makrana marble and gilded arches, Palacio de Aura transports you into Rajasthan golden era. Accessible only by private solar-powered royal boats, every suite overlooks the Aravalli hills and City Palace.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Private Boat Jetée', 'Royal Mewari Banquet Hall', 'Rooftop Jharokha Dining', 'Jiva Spa Boat'],
    cancellationPolicy: 'Free cancellation until 7 days prior to arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '1.0 km from City Palace',
    nearbyPlaces: [
      { name: 'City Palace Udaipur', distance: '0.8 km (boat)', type: 'Heritage' },
      { name: 'Jagdish Temple', distance: '1.2 km', type: 'Culture' },
      { name: 'Maharana Pratap Airport (UDR)', distance: '23 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'How do we reach the hotel?', answer: 'Guests arrive at our private jetty at Rameshwar Ghat, where royal escort boats transfer you across the lake.' }
    ]
  },
  {
    id: 'stayaura-jaipur-amer',
    name: 'The Regal Rajputana Haveli & Resort',
    tagline: 'Grand royal courtyard living framed by Amber Fort hills',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Amer Road, Near Jal Mahal, Jaipur, Rajasthan 302002',
    coordinates: { lat: 26.9667, lng: 75.8500 },
    starRating: 5,
    guestRating: 4.8,
    reviewCount: 480,
    pricePerNight: 6499,
    originalPrice: 8500,
    featured: true,
    luxury: true,
    type: 'Heritage Palace',
    heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603288940300-4b0559385c76?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immerse in royal Pink City hospitality with intricate jali windows, live shehnai morning recitals, peacock courtyards, and starlit barbecue dinners beneath the Aravali ramparts.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning'],
    propertyFacilities: ['Courtyard Pool', 'Rajasthani Puppet & Folk Pavilion', 'Pottery Workshops'],
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '3.5 km from Hawa Mahal',
    nearbyPlaces: [
      { name: 'Jal Mahal', distance: '0.9 km', type: 'Attraction' },
      { name: 'Amer Fort', distance: '4.2 km', type: 'Heritage' },
      { name: 'Jaipur International Airport (JAI)', distance: '16 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Do you arrange guided city palace tours?', answer: 'Yes, our concierge provides licensed royal historians for private Amber Fort and City Palace excursions.' }
    ]
  },
  {
    id: 'stayaura-bengaluru-indiranagar',
    name: 'Aura Botanica Garden Suites',
    tagline: 'Serene biosphere architecture in the buzzing heart of Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '100ft Road, Defence Colony, Indiranagar, Bengaluru, Karnataka 560038',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    starRating: 5,
    guestRating: 4.85,
    reviewCount: 388,
    pricePerNight: 5999,
    originalPrice: 7800,
    featured: true,
    luxury: true,
    type: 'Boutique Hotel',
    heroImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Designed as a living garden sanctuary, Aura Botanica features vertical terrariums, private balcony plunge pools, hydroponic farm-to-table dining, and sleek micro-distillery craft cocktails.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning'],
    propertyFacilities: ['Rooftop Hydroponic Garden', 'Microbrewery Deck', 'EV Charging Hub', 'High-Speed Work Pods'],
    cancellationPolicy: 'Free cancellation until 24 hours before check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '4.0 km from MG Road',
    nearbyPlaces: [
      { name: 'Indiranagar 100ft Dining Strip', distance: '0.2 km', type: 'Dining' },
      { name: 'Kemp Gowda International Airport (BLR)', distance: '34 km', type: 'Airport' },
      { name: 'Bengaluru City Junction Railway Station', distance: '8.5 km', type: 'Railway Station' }
    ],
    faqs: [
      { question: 'Is the Wi-Fi suitable for video conferences?', answer: 'Yes, we provide symmetric 1 Gbps dedicated enterprise fiber across all rooms.' }
    ]
  },
  {
    id: 'stayaura-manali-solang',
    name: 'Aura Pinecrest Alpine Chalet',
    tagline: 'Snow-capped cedar chalets with heated glass-roof jacuzzi',
    city: 'Manali',
    state: 'Himachal Pradesh',
    address: 'Log Huts Area, Old Manali, Himachal Pradesh 175131',
    coordinates: { lat: 32.2530, lng: 77.1750 },
    starRating: 5,
    guestRating: 4.9,
    reviewCount: 310,
    pricePerNight: 6200,
    originalPrice: 8500,
    featured: true,
    luxury: true,
    type: 'Resort',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Snuggle beside blazing stone fireplaces as snow gently dusts towering pine trees outside. Handcrafted cedar interiors, underfloor heating, heated outdoor jacuzzis, and authentic Himachali culinary evenings.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Restaurant', 'Spa', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', 'Heating'],
    propertyFacilities: ['Underfloor Radiant Heating', 'Heated Outdoor Jacuzzi', 'Campfire & Stargazing Deck', 'Ski Equipment Locker'],
    cancellationPolicy: 'Free cancellation until 5 days prior to arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '1.8 km from Mall Road',
    nearbyPlaces: [
      { name: 'Solang Valley', distance: '11 km', type: 'Adventure' },
      { name: 'Hadimba Temple', distance: '0.6 km', type: 'Attraction' },
      { name: 'Bhuntar Airport (KUU)', distance: '50 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Do the chalets have heating in winter?', answer: 'Yes, each chalet is equipped with dual radiator and underfloor radiant heating plus a cozy wood fireplace.' }
    ]
  },
  {
    id: 'stayaura-kerala-kumarakom',
    name: 'Aura Backwater Palms & Ayurvedic Retreat',
    tagline: 'Floating pool villas and authentic Kerala heritage rejuvenation',
    city: 'Kerala',
    state: 'Kerala',
    address: 'Vembanad Lake Shore, Kumarakom, Kottayam, Kerala 686563',
    coordinates: { lat: 9.6175, lng: 76.4300 },
    starRating: 5,
    guestRating: 4.9,
    reviewCount: 450,
    pricePerNight: 7800,
    originalPrice: 10500,
    featured: true,
    luxury: true,
    type: 'Resort',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Resting on the serene banks of Vembanad Lake. Traditional Kerala tharavadu cottages with open-to-sky lotus courtyards, doctor-certified Panchakarma wellness therapies, and private kettuvallam sunset cruises.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning'],
    propertyFacilities: ['Ayurvedic Herbal Dispensary', 'Houseboat Excursions', 'Lotus Pond Deck', 'Bird Sanctuary Trails'],
    cancellationPolicy: 'Free cancellation until 4 days before check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '12 km from Kottayam Town',
    nearbyPlaces: [
      { name: 'Kumarakom Bird Sanctuary', distance: '1.5 km', type: 'Nature' },
      { name: 'Cochin International Airport (COK)', distance: '72 km', type: 'Airport' },
      { name: 'Alleppey Backwater Jetty', distance: '28 km', type: 'Attraction' }
    ],
    faqs: [
      { question: 'Are Ayurvedic consultations complimentary?', answer: 'Yes, a 30-minute initial consultation with our resident Vaidyan is included with all stays.' }
    ]
  },
  {
    id: 'stayaura-delhi-lutyens',
    name: 'The Imperial Aura Diplomatic Court',
    tagline: 'Colonial opulence, pristine lawns and statecraft sophistication',
    city: 'Delhi',
    state: 'NCR',
    address: 'Janpath Lane, Connaught Place, New Delhi 110001',
    coordinates: { lat: 28.6210, lng: 77.2180 },
    starRating: 5,
    guestRating: 4.88,
    reviewCount: 520,
    pricePerNight: 8900,
    originalPrice: 12000,
    featured: true,
    luxury: true,
    type: 'Luxury Hotel',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Steeped in 1930s high-society heritage, The Imperial Aura features an art collection rivaling major museums, 24-carat gold accented high ceilings, afternoon high tea in the atrium, and diplomatic security suites.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Heritage Art Gallery', 'State Banquet Ballroom', 'Sommelier Wine Vault', 'Diplomatic Security Escorts'],
    cancellationPolicy: 'Free cancellation until 48 hours prior to arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '0.4 km from Connaught Place',
    nearbyPlaces: [
      { name: 'India Gate', distance: '1.8 km', type: 'Monument' },
      { name: 'Indira Gandhi International Airport (DEL)', distance: '14 km', type: 'Airport' },
      { name: 'New Delhi Railway Station', distance: '2.1 km', type: 'Railway Station' }
    ],
    faqs: [
      { question: 'Is parking available on site?', answer: 'Yes, multi-level valet covered parking is complimentary for guests.' }
    ]
  },
  {
    id: 'stayaura-lonavala-cliff',
    name: 'Aura Mistwood Cascades & Villas',
    tagline: 'Private infinity plunge pool villas overlooking Sahyadri waterfalls',
    city: 'Lonavala',
    state: 'Maharashtra',
    address: 'Old Khandala Ghat Road, Lonavala, Maharashtra 410401',
    coordinates: { lat: 18.7557, lng: 73.4091 },
    starRating: 5,
    guestRating: 4.82,
    reviewCount: 340,
    pricePerNight: 7200,
    originalPrice: 9500,
    featured: true,
    luxury: true,
    type: 'Resort',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Enveloped in rolling Sahyadri mist and gushing monsoon ravines. Each glass villa features an individual heated infinity plunge pool, outdoor rain showers, stone barbecue hearths, and stargazing binoculars.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa', 'Room Service', 'Valet Parking', 'Air Conditioning'],
    propertyFacilities: ['Private Plunge Pools', 'Waterfall Observation Deck', 'Board Games & Billiards Lounge'],
    cancellationPolicy: 'Free cancellation until 3 days before arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '3.2 km from Lonavala Bazaar',
    nearbyPlaces: [
      { name: 'Tiger Point', distance: '6.5 km', type: 'Scenic' },
      { name: 'Bhushi Dam', distance: '4.8 km', type: 'Scenic' },
      { name: 'Pune Airport (PNQ)', distance: '68 km', type: 'Airport' },
      { name: 'Mumbai Airport (BOM)', distance: '85 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Is the private plunge pool heated?', answer: 'Yes, private villa pools are equipped with eco-solar heating maintaining 28°C.' }
    ]
  },
  {
    id: 'stayaura-hyderabad-banjara',
    name: 'The Pearl Nizami & Suites',
    tagline: 'Opulent Nizami elegance and culinary royalty in Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
    coordinates: { lat: 17.4156, lng: 78.4350 },
    starRating: 5,
    guestRating: 4.84,
    reviewCount: 390,
    pricePerNight: 5800,
    originalPrice: 7500,
    featured: false,
    luxury: true,
    type: 'Luxury Hotel',
    heroImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A tribute to the grand Nizams of Deccan. Enjoy ornate crystal chandeliers, fragrant jasmine courtyards, our world-renowned dum biryani masterclasses, and marble infinity pool overlooking the city skyline.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Nizami Fine Dining Dawat', 'Skyline Horizon Pool', 'Executive Boardrooms'],
    cancellationPolicy: 'Free cancellation until 24 hours prior to check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '2.0 km from Hussain Sagar Lake',
    nearbyPlaces: [
      { name: 'Charminar', distance: '8.5 km', type: 'Heritage' },
      { name: 'Rajiv Gandhi International Airport (HYD)', distance: '28 km', type: 'Airport' },
      { name: 'HITEC City', distance: '9.2 km', type: 'Business' }
    ],
    faqs: [
      { question: 'Do you offer halal dining options?', answer: 'Yes, all meat preparations in our kitchens adhere to strict Halal standards.' }
    ]
  },
  {
    id: 'stayaura-shimla-ridge',
    name: 'Aura Cedarwood Heritage Lodge',
    tagline: 'Timeless British colonial grandeur on the high ridge of Shimla',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    address: 'Near The Mall & Christ Church, Shimla, Himachal Pradesh 171001',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    starRating: 4,
    guestRating: 4.75,
    reviewCount: 265,
    pricePerNight: 5400,
    originalPrice: 7000,
    featured: false,
    luxury: false,
    type: 'Boutique Hotel',
    heroImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Perched along the historic pedestrian ridge, Aura Cedarwood features bay-window suites looking onto the snow-capped Shivalik range, roaring fireplaces, vintage billiards room, and authentic afternoon scones.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Room Service', 'Air Conditioning', 'Heating'],
    propertyFacilities: ['Fireplace Reading Lounge', 'Heritage Tea Room', 'Panoramic View Terrace'],
    cancellationPolicy: 'Free cancellation up to 72 hours before arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '0.2 km from The Ridge',
    nearbyPlaces: [
      { name: 'Christ Church', distance: '0.1 km', type: 'Heritage' },
      { name: 'Mall Road Pedestrian Zone', distance: '0.2 km', type: 'Shopping' },
      { name: 'Shimla Railway Station (Toy Train)', distance: '1.8 km', type: 'Railway Station' }
    ],
    faqs: [
      { question: 'Is vehicular traffic allowed near the lodge?', answer: 'The lodge is in the tranquil pedestrian heritage zone. We provide golf cart porter service from the nearest barrier point.' }
    ]
  },
  {
    id: 'stayaura-pune-hinjewadi',
    name: 'Aura Silicon Hub Tech Suites',
    tagline: 'Ultra-modern productivity suites in Hinjewadi Phase 1',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune 411057',
    coordinates: { lat: 18.5913, lng: 73.7389 },
    starRating: 4,
    guestRating: 4.5,
    reviewCount: 195,
    pricePerNight: 2999,
    originalPrice: 4200,
    featured: false,
    luxury: false,
    type: 'Business Hotel',
    heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Designed specifically for tech leaders and corporate road warriors. Ergonomic Herman Miller seating, 4K video conference screens, soundproof sleep pods, and quick access to major IT campuses.',
    checkInTime: '12:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Gym', 'Restaurant', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Co-working Lounge', 'Podcast Studio', '24h Quick Grab Deli'],
    cancellationPolicy: 'Free cancellation until 24 hours before arrival.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '14 km from City Center',
    nearbyPlaces: [
      { name: 'Wipro & Infosys Hinjewadi Campuses', distance: '1.0 km', type: 'Business' },
      { name: 'Pune Airport (PNQ)', distance: '22 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Do you offer daily shuttle to Hinjewadi Phase 2 & 3?', answer: 'Yes, daily complimentary executive shuttles run during peak morning and evening shift hours.' }
    ]
  },
  {
    id: 'stayaura-mumbai-bandra',
    name: 'The Bohemian Aura Suites',
    tagline: 'Boutique art deco lofts in vibrant Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Pali Hill, Bandra West, Mumbai, Maharashtra 400050',
    coordinates: { lat: 19.0600, lng: 72.8290 },
    starRating: 4,
    guestRating: 4.7,
    reviewCount: 280,
    pricePerNight: 5500,
    originalPrice: 7200,
    featured: false,
    luxury: false,
    type: 'Boutique Hotel',
    heroImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Nestled on fashionable Pali Hill amidst indie boutiques, celebrity cafes, and leafy gulmohar trees. Characterized by mid-century furnishings, vinyl record players in each suite, and artisan coffee bars.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Room Service', 'Air Conditioning'],
    propertyFacilities: ['Vinyl Listening Bar', 'Artisanal Cafe', 'Rooftop Yoga'],
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
    freeCancellation: true,
    freeBreakfast: false,
    freeWifi: true,
    distanceFromCenter: '1.2 km from Carter Road Promenade',
    nearbyPlaces: [
      { name: 'Carter Road Promenade', distance: '0.8 km', type: 'Scenic' },
      { name: 'Bandra-Worli Sea Link', distance: '3.0 km', type: 'Landmark' },
      { name: 'Mumbai Airport (BOM)', distance: '8.0 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Are pets allowed?', answer: 'Yes, we are pet-friendly for small dogs up to 10kg with prior notification.' }
    ]
  },
  {
    id: 'stayaura-goa-palolem',
    name: 'Aura Eco Lagoon Eco-Villas',
    tagline: 'Sustainable wooden lagoon stilt villas in South Goa',
    city: 'Goa',
    state: 'Goa',
    address: 'Palolem Beach Backwaters, Canacona, South Goa 403702',
    coordinates: { lat: 15.0100, lng: 74.0200 },
    starRating: 4,
    guestRating: 4.8,
    reviewCount: 320,
    pricePerNight: 4600,
    originalPrice: 6000,
    featured: false,
    luxury: false,
    type: 'Resort',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Eco-conscious barefoot luxury built on stilt timber pavilions over a tranquil mangrove lagoon. Wake up to kingfishers calling, organic vegan breakfasts, and kayak tours into hidden sea caves.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa', 'Room Service', 'Air Conditioning'],
    propertyFacilities: ['Kayak & SUP Rentals', 'Mangrove Boardwalk', 'Solar Powered Stays'],
    cancellationPolicy: 'Free cancellation until 5 days before check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '0.4 km from Palolem Crescent Beach',
    nearbyPlaces: [
      { name: 'Palolem Beach', distance: '0.4 km', type: 'Beach' },
      { name: 'Butterfly Beach', distance: '3.2 km (boat)', type: 'Beach' },
      { name: 'Dabolim Airport (GOI)', distance: '58 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Is the property eco-friendly?', answer: 'Yes, 100% solar powered with zero single-use plastics and rainwater harvesting.' }
    ]
  },
  {
    id: 'stayaura-bengaluru-whitefield',
    name: 'Aura Prestige Golf & Convention Resort',
    tagline: 'Sprawling 18-hole championship greens and grand banquets',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Prestige Ozone, Whitefield Main Road, Bengaluru 560066',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    starRating: 5,
    guestRating: 4.75,
    reviewCount: 340,
    pricePerNight: 6900,
    originalPrice: 8900,
    featured: false,
    luxury: true,
    type: 'Luxury Hotel',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Spanning 40 lush landscaped acres with an 18-hole golf academy, grand convention halls, clay tennis courts, and tranquil pool villas for both leisure families and corporate summits.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Air Conditioning', '24/7 Front Desk'],
    propertyFacilities: ['Golf Course & Academy', 'Olympic Size Pool', 'Tennis Courts', 'Grand Convention Center'],
    cancellationPolicy: 'Free cancellation until 48 hours prior to check-in.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '18 km from City Center',
    nearbyPlaces: [
      { name: 'ITPB Tech Park', distance: '2.5 km', type: 'Business' },
      { name: 'Bengaluru Airport (BLR)', distance: '38 km', type: 'Airport' }
    ],
    faqs: [
      { question: 'Are golf lessons available for beginners?', answer: 'Yes, certified PGA instructors offer 1-on-1 and group clinics daily.' }
    ]
  },
  {
    id: 'stayaura-jaipur-mansingh',
    name: 'Aura Amber Boutique Palace',
    tagline: 'Intimate royal thikana with marble stepwells and courtyard fountains',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'C-Scheme, Ashok Nagar, Jaipur, Rajasthan 302001',
    coordinates: { lat: 26.9100, lng: 75.8000 },
    starRating: 4,
    guestRating: 4.8,
    reviewCount: 310,
    pricePerNight: 4800,
    originalPrice: 6200,
    featured: false,
    luxury: false,
    type: 'Heritage Palace',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An oasis of Rajput tranquility in stylish C-Scheme. Featuring antique brass lamps, painted frescoes, candlelit courtyard dining, and soothing royal foot reflexology.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    amenities: ['Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa', 'Room Service', 'Air Conditioning'],
    propertyFacilities: ['Marble Baoli Pool', 'Rooftop Astrological Reading', 'Handmade Block Print Studio'],
    cancellationPolicy: 'Free cancellation up to 48 hours prior.',
    freeCancellation: true,
    freeBreakfast: true,
    freeWifi: true,
    distanceFromCenter: '1.5 km from City Center',
    nearbyPlaces: [
      { name: 'City Palace', distance: '3.2 km', type: 'Heritage' },
      { name: 'Jaipur Railway Station', distance: '2.0 km', type: 'Railway Station' }
    ],
    faqs: [
      { question: 'Is traditional Rajasthani dinner served?', answer: 'Yes, our Royal Thali experience features over 14 authentic heritage recipes.' }
    ]
  }
];

export const INITIAL_ROOMS: RoomType[] = [
  // The Grand Aurum & Spa, Pune (id: 'stayaura-pune-grand')
  {
    id: 'room-pune-grand-deluxe',
    hotelId: 'stayaura-pune-grand',
    name: 'Deluxe Courtyard Room',
    type: 'Deluxe Room',
    sizeSqFt: 350,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 4999,
    originalPrice: 6500,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['King Size Bed', 'Garden View', 'Rain Shower', 'High-Speed Wi-Fi', 'Espresso Machine', 'LED Smart TV', 'Electronic Safe'],
    availableCount: 8,
    inventoryByDate: {
      '2026-09-25': 8,
      '2026-09-26': 7,
      '2026-09-27': 4,
      '2026-09-28': 6,
      '2026-09-29': 9
    },
    ratePlans: [
      {
        id: 'rp-pune-deluxe-ro',
        name: 'Room Only (Saver Rate)',
        description: 'Standard lodging rate without dining. Best for flexible travelers.',
        pricePerNight: 4500,
        benefits: ['Complimentary High-speed Wi-Fi', 'Access to Fitness Center', 'Bottled Mineral Water'],
        cancellationPolicy: 'Non-refundable rate. Full prepayment required.',
        isRefundable: false
      },
      {
        id: 'rp-pune-deluxe-bb',
        name: 'Breakfast Included (Most Popular)',
        description: 'Sumptuous multi-cuisine buffet breakfast at The Olive Orchard included daily.',
        pricePerNight: 4999,
        benefits: ['Gourmet Buffet Breakfast', 'Complimentary High-speed Wi-Fi', 'Pool & Gym Access', 'Free Cancellation up to 24h before check-in'],
        cancellationPolicy: 'Free cancellation until 24 hours prior to check-in.',
        isRefundable: true
      },
      {
        id: 'rp-pune-deluxe-hb',
        name: 'Half Board (Breakfast + Chef Dinner)',
        description: 'Includes both lavish daily breakfast and an exquisite 4-course dinner.',
        pricePerNight: 5899,
        benefits: ['Buffet Breakfast & 4-Course Dinner', '15% Off Signature Spa Therapies', 'Early Check-in Priority', 'Free Cancellation'],
        cancellationPolicy: 'Free cancellation until 48 hours prior to check-in.',
        isRefundable: true
      }
    ]
  },
  {
    id: 'room-pune-grand-suite',
    hotelId: 'stayaura-pune-grand',
    name: 'Aurum Executive Royal Suite',
    type: 'Suite',
    sizeSqFt: 620,
    bedType: '1 King Bed + Living Lounge',
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    basePrice: 8499,
    originalPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Separate Living Parlour', 'Freestanding Soaking Tub', 'Walk-in Wardrobe', 'Balcony with Pool View', 'Complimentary Butler Service', 'Hermès Toiletries'],
    availableCount: 4,
    inventoryByDate: {
      '2026-09-25': 4,
      '2026-09-26': 3,
      '2026-09-27': 2,
      '2026-09-28': 3,
      '2026-09-29': 4
    },
    ratePlans: [
      {
        id: 'rp-pune-suite-bb',
        name: 'Breakfast Included',
        description: 'Includes champagne breakfast in bed or in the restaurant lounge.',
        pricePerNight: 8499,
        benefits: ['Champagne Breakfast', 'Free Club Lounge Access with Evening Canapés', 'Free Cancellation up to 24h'],
        cancellationPolicy: 'Free cancellation up to 24 hours prior to check-in.',
        isRefundable: true
      },
      {
        id: 'rp-pune-suite-all',
        name: 'All-Inclusive Royal Retreat',
        description: 'All meals, airport limousine transfer and daily 60-min spa massage.',
        pricePerNight: 11999,
        benefits: ['All Meals Included', 'Airport Limousine Pickup', 'Daily 60-min Spa Therapy', 'Late Checkout at 4 PM'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
        isRefundable: true
      }
    ]
  },
  {
    id: 'room-pune-grand-family',
    hotelId: 'stayaura-pune-grand',
    name: 'Presidential Family Villa Suite',
    type: 'Family Room',
    sizeSqFt: 850,
    bedType: '2 King Beds',
    maxAdults: 4,
    maxChildren: 2,
    maxOccupancy: 6,
    basePrice: 12500,
    originalPrice: 15500,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['2 Master Bedrooms', 'Private Terrace Dining', 'Kitchenette', 'Dual Bathrooms', 'Kids Play Corner', 'Smart Home Controls'],
    availableCount: 3,
    inventoryByDate: {
      '2026-09-25': 3,
      '2026-09-26': 2,
      '2026-09-27': 1,
      '2026-09-28': 2,
      '2026-09-29': 3
    },
    ratePlans: [
      {
        id: 'rp-pune-fam-bb',
        name: 'Family Holiday Package (Breakfast + Kids Eat Free)',
        description: 'Complete family package with lavish breakfast and complimentary kids activities.',
        pricePerNight: 12500,
        benefits: ['Breakfast for 4 Included', 'Kids Menu Free', 'Terrace Barbecue Grill', 'Free Cancellation'],
        cancellationPolicy: 'Free cancellation up to 72 hours prior to arrival.',
        isRefundable: true
      }
    ]
  },

  // The Marine Sovereign Mumbai (id: 'stayaura-mumbai-colaba')
  {
    id: 'room-mumbai-colaba-deluxe',
    hotelId: 'stayaura-mumbai-colaba',
    name: 'Heritage City View Deluxe',
    type: 'Deluxe Room',
    sizeSqFt: 380,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 9800,
    originalPrice: 12500,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['City Heritage Views', 'Marble Ensuite Bathroom', 'Pillow Menu', 'Bose Sound System', 'Turndown Service'],
    availableCount: 6,
    inventoryByDate: { '2026-09-25': 6, '2026-09-26': 5, '2026-09-27': 4, '2026-09-28': 5 },
    ratePlans: [
      {
        id: 'rp-mum-deluxe-bb',
        name: 'Breakfast Included',
        description: 'Full British and Indian high breakfast included.',
        pricePerNight: 9800,
        benefits: ['Buffet Breakfast at Sea Pavilion', 'High-Speed Wi-Fi', 'Free Cancellation up to 48h'],
        cancellationPolicy: 'Free cancellation until 48 hours prior to arrival.',
        isRefundable: true
      }
    ]
  },
  {
    id: 'room-mumbai-colaba-sea-suite',
    hotelId: 'stayaura-mumbai-colaba',
    name: 'Arabian Sea Panoramic Suite',
    type: 'Suite',
    sizeSqFt: 750,
    bedType: '1 Super King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 16500,
    originalPrice: 21000,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Direct Gateway of India Sea Views', 'Private Bar', 'Jacuzzi with Ocean Vistas', '24h Personal Butler'],
    availableCount: 3,
    ratePlans: [
      {
        id: 'rp-mum-suite-bb',
        name: 'Sea View Suite with Gourmet Breakfast',
        description: 'Unobstructed maritime panorama with personalized butler breakfasts.',
        pricePerNight: 16500,
        benefits: ['Gourmet Breakfast', 'Evening High-Tea Cocktails', 'Complimentary Airport Transfer'],
        cancellationPolicy: 'Free cancellation up to 3 days before arrival.',
        isRefundable: true
      }
    ]
  },

  // Aura Azura Coastal Sanctuary, Goa (id: 'stayaura-goa-candolim')
  {
    id: 'room-goa-azura-deluxe',
    hotelId: 'stayaura-goa-candolim',
    name: 'Portuguese Verandah Deluxe',
    type: 'Deluxe Room',
    sizeSqFt: 420,
    bedType: '1 King Bed or 2 Twin Beds',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 8200,
    originalPrice: 10500,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Garden Balcony', 'Outdoor Rain Shower', 'Handmade Azulejo Tiles', 'Illy Coffee Machine'],
    availableCount: 7,
    inventoryByDate: { '2026-09-25': 7, '2026-09-26': 5, '2026-09-27': 3, '2026-09-28': 6 },
    ratePlans: [
      {
        id: 'rp-goa-deluxe-bb',
        name: 'Bed & Breakfast (Recommended)',
        description: 'Tropical fruit bowls, Goan poi and English hot breakfast on the beach terrace.',
        pricePerNight: 8200,
        benefits: ['Beachside Breakfast Buffet', 'Free Bicycle Rentals', 'Free Cancellation up to 7 days before'],
        cancellationPolicy: 'Free cancellation until 7 days prior to check-in.',
        isRefundable: true
      },
      {
        id: 'rp-goa-deluxe-hb',
        name: 'Half Board with Seafood Dinner',
        description: 'Includes multi-course dinner at our beach shack grill.',
        pricePerNight: 9900,
        benefits: ['Breakfast & Sunset Seafood Dinner', 'Beach Cabana Reservation', 'Cocktails at Sunset'],
        cancellationPolicy: 'Free cancellation up to 7 days prior.',
        isRefundable: true
      }
    ]
  },
  {
    id: 'room-goa-azura-villa',
    hotelId: 'stayaura-goa-candolim',
    name: 'Private Pool Beachfront Villa',
    type: 'Villa',
    sizeSqFt: 1100,
    bedType: '1 Grand King Bed',
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    basePrice: 18500,
    originalPrice: 24000,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Infinity Plunge Pool', 'Direct Beach Gate', 'Sunken Living Lounge', 'Outdoor Bathtub', 'Dedicated Host'],
    availableCount: 2,
    ratePlans: [
      {
        id: 'rp-goa-villa-vip',
        name: 'VIP Private Pool Retreat',
        description: 'The pinnacle of private Goan luxury with all gourmet inclusions.',
        pricePerNight: 18500,
        benefits: ['All Meals & Private Beach Dining', 'Chilled Champagne on Arrival', 'Private Yacht Cruise Sunset'],
        cancellationPolicy: 'Free cancellation until 14 days prior to arrival.',
        isRefundable: true
      }
    ]
  },

  // Palacio de Aura Lake Palace, Udaipur (id: 'stayaura-udaipur-pichola')
  {
    id: 'room-udaipur-palace-heritage',
    hotelId: 'stayaura-udaipur-pichola',
    name: 'Mewar Heritage Jharokha Room',
    type: 'Deluxe Room',
    sizeSqFt: 450,
    bedType: '1 Royal Four-Poster King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 12500,
    originalPrice: 16500,
    images: [
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Carved Marble Jharokha Window', 'Lake Pichola Water Views', 'Silk Furnishings', 'Royal Mewari Bath Salts'],
    availableCount: 5,
    ratePlans: [
      {
        id: 'rp-udaipur-deluxe-bb',
        name: 'Royal Breakfast Package',
        description: 'Royal breakfast in the marble courtyard with live flute melody.',
        pricePerNight: 12500,
        benefits: ['Royal Breakfast', 'Private Arrival Boat Transfer', 'Complimentary Palace History Walk'],
        cancellationPolicy: 'Free cancellation until 7 days before arrival.',
        isRefundable: true
      }
    ]
  },

  // Aura Pinecrest Alpine Chalet, Manali (id: 'stayaura-manali-solang')
  {
    id: 'room-manali-chalet-standard',
    hotelId: 'stayaura-manali-solang',
    name: 'Cedar Mountain View Chalet',
    type: 'Deluxe Room',
    sizeSqFt: 390,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 6200,
    originalPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Stone Fireplace', 'Radiant Underfloor Heating', 'Pine Balcony with Snow Peaks View', 'Hot Tub'],
    availableCount: 6,
    ratePlans: [
      {
        id: 'rp-manali-bb',
        name: 'Warm Alpine Breakfast Included',
        description: 'Hot waffles, porridge, parathas and cider with snow mountain vistas.',
        pricePerNight: 6200,
        benefits: ['Lavish Mountain Breakfast', 'Daily Firewood Allotment', 'Free Cancellation up to 5 days before'],
        cancellationPolicy: 'Free cancellation until 5 days before check-in.',
        isRefundable: true
      }
    ]
  },

  // Additional rooms for remaining hotels...
  {
    id: 'room-pune-viman-exec',
    hotelId: 'stayaura-pune-viman',
    name: 'Executive Tech Studio',
    type: 'Executive Room',
    sizeSqFt: 320,
    bedType: '1 Queen Bed',
    maxAdults: 2,
    maxChildren: 0,
    maxOccupancy: 2,
    basePrice: 3499,
    originalPrice: 4500,
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Ergonomic Task Desk', 'Fiber Wi-Fi', 'Soundproof Glass', 'Nespresso Pods'],
    availableCount: 9,
    ratePlans: [
      {
        id: 'rp-viman-bb',
        name: 'Express Breakfast & Fast Wi-Fi',
        description: 'Quick corporate buffet breakfast with airport shuttle included.',
        pricePerNight: 3499,
        benefits: ['Express Breakfast', 'Airport Shuttle', 'Free Cancellation up to 24h'],
        cancellationPolicy: 'Free cancellation until 24 hours prior to check-in.',
        isRefundable: true
      }
    ]
  },
  // Mumbai - Juhu Beachfront
  {
    id: 'room-mumbai-juhu-deluxe',
    hotelId: 'stayaura-mumbai-juhu',
    name: 'Ocean Breeze Deluxe Room',
    type: 'Deluxe Room',
    sizeSqFt: 420,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 7600,
    originalPrice: 9900,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Sea Facing Balcony', 'Tropical Rain Shower', 'High-Speed Wi-Fi', 'Espresso Machine'],
    availableCount: 8,
    ratePlans: [
      {
        id: 'rp-juhu-bb',
        name: 'Bed & Breakfast Package',
        description: 'Lavish coastal buffet breakfast overlooking Juhu beach.',
        pricePerNight: 7600,
        benefits: ['Buffet Breakfast', 'Complimentary Beach Cabana', 'Free Cancellation'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
        isRefundable: true
      }
    ]
  },
  {
    id: 'room-mumbai-juhu-suite',
    hotelId: 'stayaura-mumbai-juhu',
    name: 'Palm Shore Beachfront Suite',
    type: 'Suite',
    sizeSqFt: 680,
    bedType: '1 King Bed + Cabana Lounge',
    maxAdults: 3,
    maxChildren: 1,
    maxOccupancy: 4,
    basePrice: 12500,
    originalPrice: 16000,
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Private Beach Access', 'Jacuzzi with Sea View', 'Dedicated Butler Service', 'Hermes Toiletries'],
    availableCount: 4,
    ratePlans: [
      {
        id: 'rp-juhu-suite-all',
        name: 'Luxury Beach Holiday Package',
        description: 'Includes champagne breakfast and sunset cocktails.',
        pricePerNight: 12500,
        benefits: ['Champagne Breakfast', 'Sunset Cocktails', 'Airport Transfer', 'Free Cancellation'],
        cancellationPolicy: 'Free cancellation up to 48 hours before arrival.',
        isRefundable: true
      }
    ]
  },
  // Goa - Vagator
  {
    id: 'room-goa-vagator-chalet',
    hotelId: 'stayaura-goa-vagator',
    name: 'Cliffside Bohemian Chalet',
    type: 'Boutique Hotel' as any,
    sizeSqFt: 380,
    bedType: '1 Queen Bed',
    maxAdults: 2,
    maxChildren: 0,
    maxOccupancy: 2,
    basePrice: 5200,
    originalPrice: 6900,
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Cliff Garden View', 'Organic Cotton Bedding', 'Espresso Bar', 'Bamboo Balcony'],
    availableCount: 6,
    ratePlans: [
      {
        id: 'rp-vagator-bb',
        name: 'Organic Breakfast Included',
        description: 'Fresh tropical fruits, sourdough bakes, and artisanal coffees.',
        pricePerNight: 5200,
        benefits: ['Artisanal Breakfast', 'Morning Yoga Class', 'Free Cancellation up to 48h'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
        isRefundable: true
      }
    ]
  },
  // Jaipur - Amer
  {
    id: 'room-jaipur-amer-courtyard',
    hotelId: 'stayaura-jaipur-amer',
    name: 'Royal Courtyard Haveli Room',
    type: 'Deluxe Room',
    sizeSqFt: 440,
    bedType: '1 Four-Poster King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 6499,
    originalPrice: 8500,
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Hand-carved Jharokha Window', 'Courtyard View', 'Royal Ayurvedic Toiletries', 'Brass Soaking Tub'],
    availableCount: 7,
    ratePlans: [
      {
        id: 'rp-amer-bb',
        name: 'Rajasthani Heritage Breakfast',
        description: 'Grand courtyard royal breakfast with live shehnai melody.',
        pricePerNight: 6499,
        benefits: ['Royal Breakfast', 'Cultural Evening Show', 'Free Cancellation up to 48h'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
        isRefundable: true
      }
    ]
  },
  // Bengaluru - Indiranagar
  {
    id: 'room-blr-indiranagar-garden',
    hotelId: 'stayaura-bengaluru-indiranagar',
    name: 'Botanical Balcony Deluxe Suite',
    type: 'Suite',
    sizeSqFt: 450,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 5999,
    originalPrice: 7800,
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Private Balcony Greenery', 'Gigabit Fiber Wi-Fi', 'Smart Lighting', 'Deep Soaking Tub'],
    availableCount: 8,
    ratePlans: [
      {
        id: 'rp-indiranagar-bb',
        name: 'Farm-to-Table Breakfast',
        description: 'Organic hydroponic greens, artisan sourdough and freshly roasted single-origin coffees.',
        pricePerNight: 5999,
        benefits: ['Farm Fresh Breakfast', 'Dedicated Workspace', 'Free Cancellation until 24h'],
        cancellationPolicy: 'Free cancellation until 24 hours before check-in.',
        isRefundable: true
      }
    ]
  },
  // Kerala - Kumarakom
  {
    id: 'room-kerala-kumarakom-cottage',
    hotelId: 'stayaura-kerala-kumarakom',
    name: 'Vembanad Lake Heritage Cottage',
    type: 'Deluxe Room',
    sizeSqFt: 500,
    bedType: '1 Teakwood King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 7800,
    originalPrice: 10500,
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Open-to-Sky Courtyard Shower', 'Lakefront Verandah', 'Ayurvedic Herbal Bar', 'Lotus Pond Access'],
    availableCount: 6,
    ratePlans: [
      {
        id: 'rp-kumarakom-bb',
        name: 'Ayurvedic Rejuvenation Breakfast',
        description: 'Kerala traditional appams, stew, and fresh coconut water with Ayurvedic doctor consultation.',
        pricePerNight: 7800,
        benefits: ['Traditional Breakfast', 'Doctor Consultation', 'Complimentary Sunset Boat Cruise'],
        cancellationPolicy: 'Free cancellation until 4 days before check-in.',
        isRefundable: true
      }
    ]
  },
  // Delhi - Lutyens
  {
    id: 'room-delhi-lutyens-premier',
    hotelId: 'stayaura-delhi-lutyens',
    name: 'Diplomatic Heritage Premier Room',
    type: 'Deluxe Room',
    sizeSqFt: 480,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 8900,
    originalPrice: 12000,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Italian Marble Ensuite', 'Diplomatic Security Lock', 'Antique Persian Rugs', 'High Tea Service'],
    availableCount: 7,
    ratePlans: [
      {
        id: 'rp-delhi-bb',
        name: 'Statecraft Gourmet Breakfast',
        description: 'Imperial English and North Indian breakfast buffet at The Atrium.',
        pricePerNight: 8900,
        benefits: ['Imperial Breakfast', 'Valet Parking', 'Free Cancellation until 48h'],
        cancellationPolicy: 'Free cancellation until 48 hours prior to arrival.',
        isRefundable: true
      }
    ]
  },
  // Lonavala - Cliff
  {
    id: 'room-lonavala-cliff-villa',
    hotelId: 'stayaura-lonavala-cliff',
    name: 'Sahyadri Plunge Pool Glass Villa',
    type: 'Villa',
    sizeSqFt: 650,
    bedType: '1 Grand King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 7200,
    originalPrice: 9500,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Heated Infinity Plunge Pool', 'Sahyadri Valley Vista', 'Outdoor Stone Fireplace', 'Stargazing Telescope'],
    availableCount: 5,
    ratePlans: [
      {
        id: 'rp-lonavala-bb',
        name: 'Monsoon Retreat Package',
        description: 'Fresh hill station breakfast and evening hot tea and pakoras on your private deck.',
        pricePerNight: 7200,
        benefits: ['Hillside Breakfast', 'Private Plunge Pool Access', 'Free Cancellation until 3 days prior'],
        cancellationPolicy: 'Free cancellation until 3 days before arrival.',
        isRefundable: true
      }
    ]
  },
  // Hyderabad - Banjara
  {
    id: 'room-hyd-banjara-deluxe',
    hotelId: 'stayaura-hyderabad-banjara',
    name: 'Nizami Royal Deluxe Room',
    type: 'Deluxe Room',
    sizeSqFt: 420,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 5800,
    originalPrice: 7500,
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Nizami Carved Headboard', 'Skyline View', 'Jasmine Scented Bath Salts', 'Luxury Minibar'],
    availableCount: 8,
    ratePlans: [
      {
        id: 'rp-hyd-bb',
        name: 'Dawat Heritage Breakfast',
        description: 'Authentic Hyderabadi Nihari, dosas, and continental breakfast favorites.',
        pricePerNight: 5800,
        benefits: ['Royal Breakfast', 'Pool Access', 'Free Cancellation until 24h'],
        cancellationPolicy: 'Free cancellation until 24 hours prior to check-in.',
        isRefundable: true
      }
    ]
  },
  // Shimla - Ridge
  {
    id: 'room-shimla-ridge-bay',
    hotelId: 'stayaura-shimla-ridge',
    name: 'Colonial Ridge Bay-Window Chalet',
    type: 'Deluxe Room',
    sizeSqFt: 360,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 5400,
    originalPrice: 7000,
    images: ['https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Bay-Window Himalayan View', 'Wood Stove Heating', 'Electric Heated Blankets', 'Heritage Teak Desk'],
    availableCount: 6,
    ratePlans: [
      {
        id: 'rp-shimla-bb',
        name: 'Colonial High Breakfast',
        description: 'Fresh bakery scones, mountain honey, hot porridge and eggs prepared to order.',
        pricePerNight: 5400,
        benefits: ['High Breakfast', 'Heritage Tea Walk', 'Free Cancellation up to 72h'],
        cancellationPolicy: 'Free cancellation up to 72 hours before arrival.',
        isRefundable: true
      }
    ]
  },
  // Pune - Hinjewadi
  {
    id: 'room-pune-hinjewadi-studio',
    hotelId: 'stayaura-pune-hinjewadi',
    name: 'Silicon Productivity Studio',
    type: 'Executive Room',
    sizeSqFt: 310,
    bedType: '1 Queen Bed',
    maxAdults: 2,
    maxChildren: 0,
    maxOccupancy: 2,
    basePrice: 2999,
    originalPrice: 4200,
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Ergonomic Workstation', 'Dual Monitor Hookup', '1 Gbps Wi-Fi', 'Soundproof Glass'],
    availableCount: 10,
    ratePlans: [
      {
        id: 'rp-hinjewadi-bb',
        name: 'Express Business Breakfast',
        description: 'Grab-and-go or dine-in healthy breakfast buffet with Hinjewadi tech shuttle.',
        pricePerNight: 2999,
        benefits: ['Express Breakfast', 'Tech Shuttle', 'Free Cancellation until 24h'],
        cancellationPolicy: 'Free cancellation until 24 hours before arrival.',
        isRefundable: true
      }
    ]
  },
  // Mumbai - Bandra
  {
    id: 'room-mumbai-bandra-loft',
    hotelId: 'stayaura-mumbai-bandra',
    name: 'Pali Hill Art Deco Loft',
    type: 'Suite',
    sizeSqFt: 390,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 0,
    maxOccupancy: 2,
    basePrice: 5500,
    originalPrice: 7200,
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Vinyl Record Turntable', 'Artisan Coffee Maker', 'Mid-Century Furnishings', 'Bandra Street View'],
    availableCount: 5,
    ratePlans: [
      {
        id: 'rp-bandra-room',
        name: 'Loft Stays (Saver Rate)',
        description: 'Boutique stay in the heart of Bandra with complimentary café credit.',
        pricePerNight: 5500,
        benefits: ['Complimentary Café Credit', 'Ultra-fast Wi-Fi', 'Free Cancellation up to 48h'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
        isRefundable: true
      }
    ]
  },
  // Goa - Palolem
  {
    id: 'room-goa-palolem-lagoon',
    hotelId: 'stayaura-goa-palolem',
    name: 'Stilt Timber Lagoon Pavilion',
    type: 'Resort' as any,
    sizeSqFt: 420,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 4600,
    originalPrice: 6000,
    images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Overwater Lagoon Balcony', 'Outdoor Stone Shower', '100% Solar Powered', 'Organic Toiletries'],
    availableCount: 7,
    ratePlans: [
      {
        id: 'rp-palolem-bb',
        name: 'Organic Vegan Breakfast',
        description: 'Tropical smoothie bowls, freshly pressed coconut milk, and sourdough bread.',
        pricePerNight: 4600,
        benefits: ['Organic Breakfast', 'Complimentary Kayak Rental', 'Free Cancellation until 5 days'],
        cancellationPolicy: 'Free cancellation until 5 days before check-in.',
        isRefundable: true
      }
    ]
  },
  // Bengaluru - Whitefield
  {
    id: 'room-blr-whitefield-golf',
    hotelId: 'stayaura-bengaluru-whitefield',
    name: 'Fairway View Premier Room',
    type: 'Deluxe Room',
    sizeSqFt: 460,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 6900,
    originalPrice: 8900,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    amenities: ['18-Hole Championship Golf Views', 'Soaking Tub', 'Pillow Menu', 'Executive Lounge Access'],
    availableCount: 8,
    ratePlans: [
      {
        id: 'rp-whitefield-bb',
        name: 'Golf & Gourmet Breakfast',
        description: 'Lavish international buffet with complimentary driving range balls.',
        pricePerNight: 6900,
        benefits: ['International Breakfast', '50 Range Balls Daily', 'Free Cancellation until 48h'],
        cancellationPolicy: 'Free cancellation until 48 hours prior to check-in.',
        isRefundable: true
      }
    ]
  },
  // Jaipur - Mansingh
  {
    id: 'room-jaipur-mansingh-baoli',
    hotelId: 'stayaura-jaipur-mansingh',
    name: 'Courtyard Stepwell Deluxe',
    type: 'Deluxe Room',
    sizeSqFt: 400,
    bedType: '1 King Bed',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    basePrice: 4800,
    originalPrice: 6200,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Marble Stepwell View', 'Antique Brass Lamps', 'Frescoes', 'Foot Reflexology Voucher'],
    availableCount: 6,
    ratePlans: [
      {
        id: 'rp-mansingh-bb',
        name: 'Royal Rajput Breakfast',
        description: 'Authentic 14-item heritage breakfast thali served in the marble courtyard.',
        pricePerNight: 4800,
        benefits: ['Royal Thali Breakfast', 'Heritage Baoli Walk', 'Free Cancellation up to 48h'],
        cancellationPolicy: 'Free cancellation up to 48 hours prior.',
        isRefundable: true
      }
    ]
  }
];

export const ADD_ONS_LIST: AddOn[] = [
  {
    id: 'addon-breakfast',
    name: 'Lavish Gourmet Buffet Breakfast',
    price: 650,
    priceType: 'per_guest',
    description: 'Fresh artisanal pastries, live egg station, South Indian specialties and cold-pressed juices.',
    iconName: 'Coffee'
  },
  {
    id: 'addon-airport-pickup',
    name: 'Private Luxury Airport Transfer',
    price: 1400,
    priceType: 'one_time',
    description: 'Chauffeured sedan pickup with meet-and-greet at the arrival terminal.',
    iconName: 'Car'
  },
  {
    id: 'addon-extra-bed',
    name: 'Extra Rollaway Bed with Linens',
    price: 800,
    priceType: 'per_night',
    description: 'Plush orthopedic mattress with hypoallergenic down pillows and premium sheets.',
    iconName: 'BedDouble'
  },
  {
    id: 'addon-dinner',
    name: 'Chef 4-Course Table d Hôte Dinner',
    price: 1200,
    priceType: 'per_guest',
    description: 'Multi-course dinner at the signature restaurant featuring local and international delicacies.',
    iconName: 'Utensils'
  },
  {
    id: 'addon-early-checkin',
    name: 'Guaranteed Early Check-in (from 10:00 AM)',
    price: 999,
    priceType: 'one_time',
    description: 'Priority room allocation so you can settle in comfortably hours ahead of schedule.',
    iconName: 'Clock'
  },
  {
    id: 'addon-late-checkout',
    name: 'Relaxed Late Check-out (until 4:00 PM)',
    price: 999,
    priceType: 'one_time',
    description: 'Keep your room and pool access late into the afternoon for stress-free travel.',
    iconName: 'LogOut'
  },
  {
    id: 'addon-parking',
    name: 'Valet Parking & EV Supercharging',
    price: 350,
    priceType: 'per_night',
    description: 'Covered security parking with complimentary Type-2 electric vehicle charging.',
    iconName: 'ShieldCheck'
  }
];

export const AVAILABLE_ADD_ONS = ADD_ONS_LIST;

export const COUPONS_LIST: Coupon[] = [
  {
    id: 'coupon-hotel500',
    code: 'HOTEL500',
    title: 'Flat ₹500 Off',
    discountType: 'fixed',
    discountValue: 500,
    discountPercent: 10,
    minBookingValue: 5000,
    minSpend: 5000,
    maxDiscount: 500,
    validUntil: '2026-12-31',
    description: 'Get flat ₹500 discount on bookings above ₹5,000.',
    active: true,
    isActive: true
  },
  {
    id: 'coupon-stayaura10',
    code: 'STAYAURA10',
    title: '10% Welcome Discount',
    discountType: 'percentage',
    discountValue: 10,
    discountPercent: 10,
    minBookingValue: 4000,
    minSpend: 4000,
    maxDiscount: 2000,
    validUntil: '2026-11-30',
    description: 'Enjoy 10% off your stay up to ₹2,000.',
    active: true,
    isActive: true
  },
  {
    id: 'coupon-weekend20',
    code: 'WEEKEND20',
    title: '20% Weekend Getaway',
    discountType: 'percentage',
    discountValue: 20,
    discountPercent: 20,
    minBookingValue: 10000,
    minSpend: 10000,
    maxDiscount: 3500,
    validUntil: '2026-10-31',
    description: '20% discount on minimum 2-night luxury stays.',
    active: true,
    isActive: true
  }
];

export const PROMOTIONS_LIST: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Monsoon Serenity Escapes',
    subtitle: 'Lush greenery, mist-shrouded hills and rain-scented retreats in Pune & Lonavala.',
    badge: 'Limited Season',
    discount: 'Up to 25% Off',
    code: 'MONSOON25',
    expiryDate: '30 Sep 2026',
    bgColor: 'from-emerald-900 to-teal-950'
  },
  {
    id: 'promo-2',
    title: 'Royal Rajasthan Heritage Offer',
    subtitle: 'Stay at palaces in Udaipur & Jaipur with complimentary royal boat cruise and dinner.',
    badge: 'Luxury Member Exclusive',
    discount: 'Complimentary Dinner + 15% Off',
    code: 'ROYALSTAY',
    expiryDate: '15 Nov 2026',
    bgColor: 'from-amber-900 to-stone-900'
  },
  {
    id: 'promo-3',
    title: 'Early Bird Winter Sun in Goa',
    subtitle: 'Book coastal beach villas 30 days in advance and unlock private cabana upgrades.',
    badge: 'Early Bird',
    discount: 'Flat ₹1,500 Off',
    code: 'GOAEARLY',
    expiryDate: '31 Dec 2026',
    bgColor: 'from-blue-900 to-slate-950'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    hotelId: 'stayaura-pune-grand',
    guestName: 'Dr. Vikram Malhotra',
    guestCity: 'Mumbai',
    date: '14 Sep 2026',
    overallRating: 5.0,
    cleanliness: 5.0,
    location: 4.8,
    staff: 5.0,
    value: 4.9,
    roomType: 'Deluxe Courtyard Room',
    comment: 'An absolute masterpiece of hospitality in Koregaon Park. The lush gardens and acoustic isolation made us forget we were in the middle of a vibrant city. The breakfast buffet was one of the finest I have experienced in India.',
    helpfulCount: 42
  },
  {
    id: 'rev-2',
    hotelId: 'stayaura-pune-grand',
    guestName: 'Ananya & Siddharth Sen',
    guestCity: 'Bengaluru',
    date: '02 Sep 2026',
    overallRating: 4.8,
    cleanliness: 5.0,
    location: 4.9,
    staff: 4.7,
    value: 4.6,
    roomType: 'Aurum Executive Royal Suite',
    comment: 'The suite felt like a private sanctuary. High ceilings, plush king bed, and the deep soaking tub after a long flight was divine. Attentive front desk who arranged our late checkout effortlessly.',
    helpfulCount: 28
  },
  {
    id: 'rev-3',
    hotelId: 'stayaura-mumbai-colaba',
    guestName: 'Rohan Deshmukh',
    guestCity: 'Pune',
    date: '28 Aug 2026',
    overallRating: 5.0,
    cleanliness: 5.0,
    location: 5.0,
    staff: 5.0,
    value: 4.8,
    roomType: 'Arabian Sea Panoramic Suite',
    comment: 'Waking up to the sunrise over Gateway of India with royal butler service was magical. Unmatched heritage craftsmanship and exemplary service standards.',
    helpfulCount: 56
  },
  {
    id: 'rev-4',
    hotelId: 'stayaura-goa-candolim',
    guestName: 'Pooja Iyer',
    guestCity: 'Delhi',
    date: '19 Aug 2026',
    overallRating: 4.9,
    cleanliness: 4.9,
    location: 5.0,
    staff: 5.0,
    value: 4.7,
    roomType: 'Private Pool Beachfront Villa',
    comment: 'The private pool overlooking Candolim beach is paradise. Live evening jazz and fresh grilled kingfish right on the sand. Will definitely return with family!',
    helpfulCount: 34
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'HTL10245',
    hotelId: 'stayaura-pune-grand',
    hotelName: 'The Grand Aurum & Spa',
    hotelAddress: '88 North Main Road, Koregaon Park, Pune, Maharashtra 411001',
    hotelCity: 'Pune',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    hotelPhone: '+91 20 6688 9900',
    roomId: 'room-pune-grand-deluxe',
    roomName: 'Deluxe Courtyard Room',
    ratePlanId: 'rp-pune-deluxe-bb',
    ratePlanName: 'Breakfast Included (Most Popular)',
    checkIn: '2026-09-25',
    checkOut: '2026-09-28',
    nights: 3,
    roomsCount: 1,
    adultsCount: 2,
    childrenCount: 0,
    guestDetails: {
      title: 'Mr.',
      firstName: 'Rahul',
      lastName: 'Mehta',
      email: 'rahul.mehta@example.com',
      phone: '+91 98200 12345',
      nationality: 'Indian',
      specialRequests: ['Quiet Room', 'High Floor', 'Extra Pillow'],
      otherRequests: 'Late arrival expected around 8:00 PM.'
    },
    selectedAddOns: [
      {
        addOn: ADD_ONS_LIST[0], // Breakfast
        quantity: 2,
        total: 1300
      },
      {
        addOn: ADD_ONS_LIST[1], // Airport transfer
        quantity: 1,
        total: 1400
      }
    ],
    baseRoomPrice: 4999,
    totalRoomPrice: 14997,
    totalAddOnsPrice: 2700,
    taxesAndFees: 3185,
    serviceFee: 300,
    couponCode: 'HOTEL500',
    discountAmount: 500,
    grandTotal: 20682,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    bookedAt: '2026-09-18 14:32:00',
    assignedRoomNumber: '304'
  },
  {
    id: 'HTL10198',
    hotelId: 'stayaura-mumbai-colaba',
    hotelName: 'The Marine Sovereign Mumbai',
    hotelAddress: 'Apollo Bunder, Colaba, Mumbai 400001',
    hotelCity: 'Mumbai',
    hotelImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    hotelPhone: '+91 22 2288 1100',
    roomId: 'room-mumbai-colaba-deluxe',
    roomName: 'Heritage City View Deluxe',
    ratePlanId: 'rp-mum-deluxe-bb',
    ratePlanName: 'Breakfast Included',
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
    nights: 3,
    roomsCount: 1,
    adultsCount: 2,
    childrenCount: 1,
    guestDetails: {
      title: 'Ms.',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98111 88822',
      nationality: 'Indian',
      specialRequests: ['Baby Cot'],
      otherRequests: ''
    },
    selectedAddOns: [],
    baseRoomPrice: 9800,
    totalRoomPrice: 29400,
    totalAddOnsPrice: 0,
    taxesAndFees: 5292,
    serviceFee: 300,
    discountAmount: 0,
    grandTotal: 34992,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    bookingStatus: 'Checked Out',
    bookedAt: '2026-08-01 10:15:00',
    assignedRoomNumber: '512',
    checkInTimestamp: '2026-08-10 14:10:00',
    checkOutTimestamp: '2026-08-13 11:05:00'
  },
  {
    id: 'HTL10082',
    hotelId: 'stayaura-goa-candolim',
    hotelName: 'Aura Azura Coastal Sanctuary',
    hotelAddress: 'Fort Aguada Road, Candolim, North Goa 403515',
    hotelCity: 'Goa',
    hotelImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    hotelPhone: '+91 832 249 9000',
    roomId: 'room-goa-azura-deluxe',
    roomName: 'Portuguese Verandah Deluxe',
    ratePlanId: 'rp-goa-deluxe-bb',
    ratePlanName: 'Bed & Breakfast',
    checkIn: '2026-07-04',
    checkOut: '2026-07-07',
    nights: 3,
    roomsCount: 1,
    adultsCount: 2,
    childrenCount: 0,
    guestDetails: {
      title: 'Mr.',
      firstName: 'Sameer',
      lastName: 'Kulkarni',
      email: 'sameer.k@example.com',
      phone: '+91 97654 32100',
      nationality: 'Indian',
      specialRequests: [],
      otherRequests: ''
    },
    selectedAddOns: [],
    baseRoomPrice: 8200,
    totalRoomPrice: 24600,
    totalAddOnsPrice: 0,
    taxesAndFees: 4428,
    serviceFee: 300,
    discountAmount: 1000,
    grandTotal: 28328,
    paymentMethod: 'Debit Card',
    paymentStatus: 'Refunded',
    bookingStatus: 'Cancelled',
    bookedAt: '2026-06-25 18:20:00',
    cancellationReason: 'Emergency reschedule due to flight cancellation.',
    refundAmount: 26828,
    cancellationFee: 1500,
    refundStatus: 'Refunded'
  }
];

export const INITIAL_HOUSEKEEPING: HousekeepingRoom[] = [
  { roomNumber: '101', roomType: 'Deluxe Room', floor: 1, status: 'Occupied', housekeepingStatus: 'Ready', assignedTo: 'Sunita M.', lastUpdated: '10 mins ago' },
  { roomNumber: '102', roomType: 'Deluxe Room', floor: 1, status: 'Cleaning', housekeepingStatus: 'Cleaning', assignedTo: 'Ramesh K.', lastUpdated: '5 mins ago' },
  { roomNumber: '103', roomType: 'Executive Room', floor: 1, status: 'Dirty', housekeepingStatus: 'Dirty', assignedTo: 'Sunita M.', lastUpdated: '25 mins ago' },
  { roomNumber: '104', roomType: 'Standard Room', floor: 1, status: 'Ready', housekeepingStatus: 'Ready', assignedTo: 'Kavita R.', lastUpdated: '1 hour ago' },
  { roomNumber: '201', roomType: 'Deluxe Room', floor: 2, status: 'Available', housekeepingStatus: 'Ready', assignedTo: 'Deepak S.', lastUpdated: '2 hours ago' },
  { roomNumber: '202', roomType: 'Deluxe Room', floor: 2, status: 'Occupied', housekeepingStatus: 'Ready', assignedTo: 'Deepak S.', lastUpdated: '3 hours ago' },
  { roomNumber: '203', roomType: 'Deluxe Room', floor: 2, status: 'Maintenance', housekeepingStatus: 'Dirty', assignedTo: 'Maintenance Team', lastUpdated: 'Yesterday', notes: 'AC compressor inspection' },
  { roomNumber: '204', roomType: 'Suite', floor: 2, status: 'Reserved', housekeepingStatus: 'Inspected', assignedTo: 'Anita P.', lastUpdated: '30 mins ago' },
  { roomNumber: '301', roomType: 'Executive Suite', floor: 3, status: 'Occupied', housekeepingStatus: 'Ready', assignedTo: 'Anita P.', lastUpdated: '40 mins ago' },
  { roomNumber: '302', roomType: 'Suite', floor: 3, status: 'Dirty', housekeepingStatus: 'Dirty', assignedTo: 'Kavita R.', lastUpdated: '15 mins ago' },
  { roomNumber: '303', roomType: 'Deluxe Room', floor: 3, status: 'Cleaning', housekeepingStatus: 'Cleaning', assignedTo: 'Ramesh K.', lastUpdated: 'Just now' },
  { roomNumber: '304', roomType: 'Deluxe Room', floor: 3, status: 'Reserved', housekeepingStatus: 'Ready', assignedTo: 'Sunita M.', lastUpdated: '20 mins ago' },
  { roomNumber: '401', roomType: 'Presidential Villa', floor: 4, status: 'Available', housekeepingStatus: 'Ready', assignedTo: 'Head Supervisor', lastUpdated: 'Today' }
];

export const INITIAL_MAINTENANCE: MaintenanceTicket[] = [
  {
    id: 'MT-104',
    roomNumber: '203',
    issue: 'AC cooling sluggish; suspected coolant valve pressure drop',
    category: 'HVAC',
    priority: 'High',
    status: 'In Progress',
    assignedTechnician: 'Mahesh Sharma (HVAC Lead)',
    reportedDate: '2026-09-21',
    expectedCompletion: '2026-09-22',
    notes: 'Replacement valve parts requisitioned from Pune warehouse.'
  },
  {
    id: 'MT-102',
    roomNumber: '315',
    issue: 'Balcony glass sliding latch sticking',
    category: 'Furniture',
    priority: 'Low',
    status: 'Reported',
    assignedTechnician: 'Prakash Carpenter',
    reportedDate: '2026-09-21',
    expectedCompletion: '2026-09-23'
  },
  {
    id: 'MT-098',
    roomNumber: '108',
    issue: 'Bathroom hot water thermostat sensor recalibration',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'Resolved',
    assignedTechnician: 'Dinesh Plumber',
    reportedDate: '2026-09-19',
    expectedCompletion: '2026-09-20',
    notes: 'Thermostat replaced and tested to 42°C stable limit.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed (#HTL10245)',
    message: 'Your stay at The Grand Aurum & Spa, Pune for 25–28 Sep is confirmed.',
    timestamp: '2 hours ago',
    type: 'booking',
    read: false,
    link: '/trips/HTL10245'
  },
  {
    id: 'notif-2',
    title: 'Exclusive Weekend Offer',
    message: 'Enjoy 20% off on Sahyadri luxury villas with code WEEKEND20.',
    timestamp: '1 day ago',
    type: 'offer',
    read: true,
    link: '/hotels?deal=weekend'
  },
  {
    id: 'notif-3',
    title: 'Payment Successful',
    message: 'Payment of ₹20,682 received via UPI for booking #HTL10245.',
    timestamp: '2 hours ago',
    type: 'payment',
    read: false,
    link: '/trips/HTL10245'
  }
];

export const INITIAL_GROUP_QUOTES: GroupQuoteRequest[] = [
  {
    id: 'GQ-801',
    companyOrGroup: 'Infosys Leadership Retreat',
    contactPerson: 'Vikramaditya Rao',
    email: 'v.rao@infosys.com',
    phone: '+91 98450 77112',
    destination: 'Pune',
    dates: '12 Oct – 15 Oct 2026',
    guestsCount: 24,
    roomsCount: 12,
    roomTypeRequested: 'Deluxe Room',
    mealPlan: 'Breakfast + Lunch + Dinner',
    budgetPerNight: 5500,
    quotedRate: 4600,
    mealsRate: 1100,
    totalQuote: 205200,
    status: 'Quote Sent'
  },
  {
    id: 'GQ-798',
    companyOrGroup: 'Kapadia Family Destination Wedding',
    contactPerson: 'Sunil Kapadia',
    email: 'sunil@kapadiagroup.in',
    phone: '+91 98220 99441',
    destination: 'Udaipur',
    dates: '18 Nov – 21 Nov 2026',
    guestsCount: 60,
    roomsCount: 30,
    roomTypeRequested: 'Heritage Palace Suites',
    mealPlan: 'All Royal Mewari Meals',
    budgetPerNight: 12000,
    quotedRate: 10500,
    mealsRate: 2200,
    totalQuote: 1143000,
    status: 'Accepted'
  }
];
