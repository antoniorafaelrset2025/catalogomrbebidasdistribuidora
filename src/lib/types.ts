export type Review = {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number; // 1-5
  comment: string;
};

export type Category = 'Cigarros Sousa Cruz' | 'Cigarros Nacional' | 'Fumos' | 'Seda' | 'Isqueiros';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
};
