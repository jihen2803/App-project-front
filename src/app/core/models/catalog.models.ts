export type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  brand: string | null;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  primaryImageUrl: string | null;
};

export type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  description: string;
  specifications: string;
  gender: string;
  status: string;
  category: string | null;
  brand: string | null;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  averageRating: number;
  reviewCount: number;
};
