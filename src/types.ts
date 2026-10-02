export type Language = 'en' | 'gu';

export interface Product {
  id: string;
  name: string;
  nameGu?: string;
  categoryId: string;
  originalPrice: number;
  discountPrice?: number;
  hasDiscount: boolean;
  imageUrl: string;
  additionalImages?: string[];
  description: string;
  descriptionGu?: string;
  inStock: boolean;
  unit?: string; // e.g. "kg", "piece", "packet", "box"
  featured?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameGu: string;
  description: string;
  descriptionGu?: string;
  iconName: string;
  imageUrl: string;
  itemCount?: number;
}

export type OrderStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface BookingOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerNote?: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  originalPrice: number;
  discountPrice?: number;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  address?: string;
  lastOrderedAt?: string;
}

export interface StoreProfile {
  name: string;
  nameGu: string;
  tagline: string;
  taglineGu: string;
  ownerName: string;
  whatsappNumber: string; // e.g. "9876543210"
  email: string;
  phoneNumber: string;
  address: string;
  addressGu: string;
  mapsUrl: string;
  currencySymbol: string;
  announcementText: string;
  announcementTextGu: string;
  adminPin: string;
  adminPassword1: string;
  adminPassword2: string;
}
