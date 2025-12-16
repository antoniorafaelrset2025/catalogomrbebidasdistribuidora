export type Review = {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number; // 1-5
  comment: string;
};

export type Category =
  | 'Cigarros Sousa Cruz'
  | 'Cigarros Nacional'
  | 'Fumos'
  | 'Seda'
  | 'Isqueiros'
  | 'LONG NECKS'
  | 'CERVEJAS LATAS'
  | 'CACHAÇAS 1L'
  | 'CACHAÇAS MEIOTAS'
  | 'VODKAS'
  | 'GIN'
  | 'WHISKYS'
  | 'DESTILADOS'
  | 'VINHOS'
  | 'ENERGÉTICOS'
  | 'BEBIDAS';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
};

export type NewProduct = {
  name: string;
  description: string;
  price: number;
  category: Category;
};


export type SiteInfo = {
  siteName: string;
  heroTitle1: string;
  heroTitle2: string;
  heroLocation: string;
  heroSlogan: string;
  heroPhone: string;
  heroPhoneDisplay: string;
  heroLocation2: string;
  heroPhone2: string;
  heroPhoneDisplay2: string;
};
