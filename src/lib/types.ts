import type { ImagePlaceholder } from './placeholder-images';

export type Review = {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number; // 1-5
  comment: string;
};

export type Category = 'Electronics' | 'Office' | 'Lighting';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: ImagePlaceholder[];
  reviews: Review[];
};
