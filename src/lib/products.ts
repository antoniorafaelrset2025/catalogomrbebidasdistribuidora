import type { Product, Category, Review } from './types';
import allImages from './placeholder-images.json';

const { placeholderImages } = allImages;

export const categories: Category[] = ['Office', 'Electronics', 'Lighting'];

const reviews: Review[] = [
  {
    id: 'review-1',
    author: 'Alex Johnson',
    avatarUrl: 'https://picsum.photos/seed/avatar1/40/40',
    rating: 5,
    comment: 'Absolutely love this product! It has exceeded all my expectations. Highly recommended!',
  },
  {
    id: 'review-2',
    author: 'Maria Garcia',
    avatarUrl: 'https://picsum.photos/seed/avatar2/40/40',
    rating: 4,
    comment: 'Great value for the price. It works well, although the setup was a bit tricky.',
  },
  {
    id: 'review-3',
    author: 'James Smith',
    avatarUrl: 'https://picsum.photos/seed/avatar3/40/40',
    rating: 5,
    comment: 'Fantastic build quality and beautiful design. I use it every day.',
  },
  {
    id: 'review-4',
    author: 'Priya Patel',
    avatarUrl: 'https://picsum.photos/seed/avatar4/40/40',
    rating: 3,
    comment: 'It\'s a decent product, but I was expecting a bit more for the price. It gets the job done.',
  },
  {
    id: 'review-5',
    author: 'Chen Wang',
    avatarUrl: 'https://picsum.photos/seed/avatar5/40/40',
    rating: 4,
    comment: 'Very satisfied with my purchase. It arrived quickly and was exactly as described.',
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Ergonomic Office Chair',
    description: 'Our ergonomic office chair provides optimal comfort and support for long hours of work. Featuring adjustable lumbar support, armrests, and seat height, it\'s designed to improve posture and reduce back pain.',
    price: 299.99,
    category: 'Office',
    images: placeholderImages.filter(img => img.id.includes('ergonomic-chair')),
    reviews: [reviews[0], reviews[2]],
  },
  {
    id: 'prod-2',
    name: 'Sleek Wireless Mouse',
    description: 'Experience seamless navigation with this sleek and responsive wireless mouse. Its ergonomic design fits comfortably in your hand, and the high-precision sensor works on almost any surface.',
    price: 49.99,
    category: 'Electronics',
    images: placeholderImages.filter(img => img.id.includes('wireless-mouse')),
    reviews: [reviews[1], reviews[4]],
  },
  {
    id: 'prod-3',
    name: 'Mechanical Keyboard',
    description: 'Elevate your typing experience with our mechanical keyboard. It offers tactile feedback and a satisfying click with every keystroke, plus customizable RGB backlighting for a personalized setup.',
    price: 129.99,
    category: 'Electronics',
    images: placeholderImages.filter(img => img.id.includes('mech-keyboard')),
    reviews: [reviews[2]],
  },
  {
    id: 'prod-4',
    name: 'UltraWide 4K Monitor',
    description: 'Immerse yourself in stunning detail with this 34-inch UltraWide 4K monitor. Perfect for multitasking and gaming, it delivers vibrant colors and crisp images from any angle.',
    price: 799.99,
    category: 'Electronics',
    images: placeholderImages.filter(img => img.id.includes('4k-monitor')),
    reviews: [reviews[0], reviews[1], reviews[3]],
  },
  {
    id: 'prod-5',
    name: 'Adjustable Laptop Stand',
    description: 'Raise your laptop to a comfortable viewing height with this adjustable aluminum stand. It helps improve ergonomics and keeps your device cool with its open-air design.',
    price: 39.99,
    category: 'Office',
    images: placeholderImages.filter(img => img.id.includes('laptop-stand')),
    reviews: [reviews[4]],
  },
  {
    id: 'prod-6',
    name: 'Minimalist LED Desk Lamp',
    description: 'Illuminate your workspace with this minimalist LED desk lamp. It offers adjustable brightness levels and color temperatures, all controlled by a simple touch interface.',
    price: 59.99,
    category: 'Lighting',
    images: placeholderImages.filter(img => img.id.includes('desk-lamp')),
    reviews: [reviews[0], reviews[4]],
  },
  {
    id: 'prod-7',
    name: 'Electric Standing Desk',
    description: 'Switch between sitting and standing effortlessly with our electric standing desk. With a quiet motor and programmable height presets, it\'s the centerpiece of a healthy and productive workspace.',
    price: 499.99,
    category: 'Office',
    images: placeholderImages.filter(img => img.id.includes('standing-desk')),
    reviews: [reviews[2], reviews[3]],
  },
  {
    id: 'prod-8',
    name: 'Multi-Port USB-C Hub',
    description: 'Expand your connectivity with this all-in-one USB-C hub. It features ports for HDMI, USB-A, SD cards, and more, all in a compact and portable design.',
    price: 69.99,
    category: 'Electronics',
    images: placeholderImages.filter(img => img.id.includes('usb-c-hub')),
    reviews: [reviews[1]],
  },
];
