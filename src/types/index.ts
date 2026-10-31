export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  address: string;
  coordinates: { lat: number; lng: number };
  starRating: number;
  guestRating: number;
  reviewCount: number;
  pricePerNight: number; // Base price for lowest room
  originalPrice?: number;
  featured: boolean;
  luxury: boolean;
  type: 'Resort' | 'Luxury Hotel' | 'Boutique Hotel' | 'Business Hotel' | 'Heritage Palace' | 'Budget Hotel';
  heroImage: string;
  images: string[];
  galleryImages?: GalleryImage[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  propertyFacilities: string[];
  cancellationPolicy: string;
  freeCancellation: boolean;
  freeBreakfast: boolean;
  freeWifi: boolean;
  distanceFromCenter: string;
  nearbyPlaces: { name: string; distance: string; type: string }[];
  faqs: { question: string; answer: string }[];
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  type: 'Standard Room' | 'Deluxe Room' | 'Superior Room' | 'Executive Room' | 'Suite' | 'Family Room' | 'Twin Room' | 'Villa' | 'Dormitory';
  sizeSqFt: number;
  bedType: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  basePrice: number;
  originalPrice?: number;
  images: string[];
  amenities: string[];
  availableCount: number;
  inventoryByDate?: Record<string, number>;
  ratePlans: RatePlan[];
}

export interface RatePlan {
  id: string;
  name: string; // e.g. "Room Only", "Breakfast Included", "Half Board (Breakfast + Dinner)"
  description: string;
  pricePerNight: number;
  benefits: string[];
  cancellationPolicy: string;
  isRefundable: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  priceType: 'per_night' | 'one_time' | 'per_guest';
  description: string;
  iconName: string;
}

export interface Review {
  id: string;
  hotelId: string;
  guestName: string;
  guestCity?: string;
  userName?: string;
  userLocation?: string;
  date: string;
  overallRating: number;
  rating?: number;
  cleanliness: number;
  location: number;
  staff: number;
  value: number;
  roomType: string;
  title?: string;
  comment: string;
  travelerType?: string;
  helpfulCount: number;
}

export interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  specialRequests: string[];
  otherRequests: string;
  roomAllocations?: { roomIndex: number; adultNames: string[]; childNames?: string[] }[];
}

export interface Booking {
  id: string; // e.g. "HTL10245"
  hotelId: string;
  hotelName: string;
  hotelAddress: string;
  hotelCity: string;
  hotelImage: string;
  hotelPhone: string;
  roomId: string;
  roomName: string;
  ratePlanId: string;
  ratePlanName: string;
  checkIn: string; // "YYYY-MM-DD"
  checkOut: string; // "YYYY-MM-DD"
  nights: number;
  roomsCount: number;
  adultsCount: number;
  childrenCount: number;
  guestDetails: GuestDetails;
  selectedAddOns: { addOn: AddOn; quantity: number; total: number }[];
  baseRoomPrice: number;
  totalRoomPrice: number;
  totalAddOnsPrice: number;
  taxesAndFees: number; // 18% GST + fee
  serviceFee: number;
  couponCode?: string;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Card' | 'Net Banking' | 'Wallet' | 'Pay at Hotel';
  paymentStatus: 'Pending' | 'Authorized' | 'Paid' | 'Failed' | 'Refunded';
  bookingStatus: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
  bookedAt: string;
  assignedRoomNumber?: string;
  checkInTimestamp?: string;
  checkOutTimestamp?: string;
  cancellationReason?: string;
  refundAmount?: number;
  cancellationFee?: number;
  refundStatus?: 'None' | 'Refund Pending' | 'Refund Processing' | 'Refunded';
}

export interface Coupon {
  id?: string;
  code: string;
  title?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountPercent?: number;
  minBookingValue?: number;
  minSpend?: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
  active?: boolean;
  isActive?: boolean;
}

export type MaintenanceItem = MaintenanceTicket;

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  discount: string;
  code: string;
  expiryDate: string;
  bgColor: string;
}

export interface HousekeepingRoom {
  roomNumber: string;
  roomType: string;
  floor: number;
  status: 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Dirty' | 'Inspected' | 'Ready' | 'Maintenance' | 'Blocked';
  housekeepingStatus: 'Dirty' | 'Cleaning' | 'Inspected' | 'Ready';
  assignedTo?: string;
  lastUpdated: string;
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  issue: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Furniture' | 'Appliances';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Reported' | 'In Progress' | 'Maintenance' | 'Resolved';
  assignedTechnician: string;
  reportedDate: string;
  expectedCompletion: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'payment' | 'offer' | 'reminder' | 'cancellation';
  read: boolean;
  link?: string;
}

export interface GroupQuoteRequest {
  id: string;
  companyOrGroup: string;
  contactPerson: string;
  email: string;
  phone: string;
  destination: string;
  dates: string;
  guestsCount: number;
  roomsCount: number;
  roomTypeRequested: string;
  mealPlan: string;
  budgetPerNight: number;
  quotedRate?: number;
  mealsRate?: number;
  totalQuote?: number;
  status: 'Pending Quote' | 'Quote Sent' | 'Accepted' | 'Declined';
}
