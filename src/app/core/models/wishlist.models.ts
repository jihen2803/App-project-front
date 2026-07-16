export interface WishlistItemResponse {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount?: number;
    images: string[];
    brand?: { id: number; name: string; };
    category?: { id: number; name: string; };
    stock: number;
  };
  addedAt: string;
}

export interface WishlistResponse {
  id: number;
  userId: number;
  items: WishlistItemResponse[];
  itemCount: number;
}
