
export type ItemType = 'rent' | 'sell' | 'both';
export type Category = 'Tech' | 'Textbooks' | 'Fashion' | 'Party' | 'Sports' | 'Other';

export interface Item {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: Category;
  type: ItemType;
  price?: number; // For sale
  dailyRate?: number; // For rent
  images: string[];
  status: 'available' | 'rented' | 'sold';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  course?: string;
  avatar: string;
  isVerified: boolean;
  trustScore: number; // 0-5
  sustainabilityLevel: number; // XP or Level
  campus: string;
  balance: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string; // stored as ISO string
  itemId?: string; // optional context
}

export type ViewState = 'home' | 'marketplace' | 'create' | 'profile' | 'item-detail' | 'my-listings' | 'chat-list' | 'chat-room';

export interface FilterState {
  type: 'all' | 'rent' | 'buy';
  category: Category | 'All';
  search: string;
  maxPrice: number;
}
