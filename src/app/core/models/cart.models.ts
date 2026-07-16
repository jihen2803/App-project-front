export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  images: string[];
  brand?: { id: number; name: string; };
  category?: { id: number; name: string; };
  stock: number;
}

export interface CartItemResponse {
  id: number;
  product: ProductSummary;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  subtotal: number;
  shipping?: number;
  tax?: number;
  couponDiscount?: number;
  total: number;
  coupon?: {
    code: string;
    discountPercent: number;
    validUntil: string;
  };
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemRequest {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ApplyCouponRequest {
  couponCode: string;
}
