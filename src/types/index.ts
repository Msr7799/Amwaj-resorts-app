export interface Resort {
  id: string;
  name: string;
  type: 'vip' | 'standard';
  description: string;
  bedrooms: number;
  bathrooms: number;
  priceRegular: number;
  priceWeekend: number;
  currency: string;
  features: string[];
  amenities: string[];
  images: string[];
  video?: string;
  hasPrivatePool: boolean;
  hasPrivateBeach: boolean;
  beachAccess: 'direct' | 'stairs';
}

export interface BookingData {
  resortId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface PolicyItem {
  id: number;
  text: string;
}
