
import { Item, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@bennett.edu.in',
  age: 20,
  course: 'B.Tech CSE',
  avatar: 'https://picsum.photos/id/64/200/200',
  isVerified: true,
  trustScore: 4.8,
  sustainabilityLevel: 12,
  campus: 'Bennett University',
  balance: 2500.00
};

export const MOCK_ITEMS: Item[] = [
  {
    id: 'i1',
    sellerId: 'u2',
    title: 'Sony WH-1000XM4 Noise Canceling',
    description: 'Great condition, barely used. Perfect for studying in loud hostels.',
    category: 'Tech',
    type: 'rent',
    dailyRate: 350,
    images: ['https://picsum.photos/id/250/400/400'],
    status: 'available',
    createdAt: new Date()
  },
  {
    id: 'i2',
    sellerId: 'u3',
    title: 'Concepts of Physics - H.C. Verma (Vol 1 & 2)',
    description: 'No highlighting, good condition. Essential for engineering mechanics.',
    category: 'Textbooks',
    type: 'sell',
    price: 600,
    images: ['https://picsum.photos/id/24/400/400'],
    status: 'available',
    createdAt: new Date()
  },
  {
    id: 'i3',
    sellerId: 'u4',
    title: 'JBL PartyBox Speaker',
    description: 'Massive sound for freshers parties. Battery life is 100%.',
    category: 'Party',
    type: 'rent',
    dailyRate: 800,
    images: ['https://picsum.photos/id/145/400/400'],
    status: 'available',
    createdAt: new Date()
  },
  {
    id: 'i4',
    sellerId: 'u5',
    title: 'Zara Denim Jacket (M)',
    description: 'Bought from Myntra, doesn\'t fit me anymore. Super cool wash.',
    category: 'Fashion',
    type: 'sell',
    price: 1200,
    images: ['https://picsum.photos/id/338/400/400'],
    status: 'available',
    createdAt: new Date()
  },
  {
    id: 'i5',
    sellerId: 'u2',
    title: 'Badminton Set (Yonex)',
    description: '2 Racquets + Shuttlecocks. Great for evening games.',
    category: 'Sports',
    type: 'rent',
    dailyRate: 150,
    images: ['https://picsum.photos/id/158/400/400'],
    status: 'available',
    createdAt: new Date()
  }
];

export const CATEGORIES = ['Tech', 'Textbooks', 'Fashion', 'Party', 'Sports', 'Other'] as const;
