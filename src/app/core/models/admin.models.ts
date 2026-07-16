export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  monthlyRevenue: MonthlyRevenueEntry[];
  bestSellers: BestSellerEntry[];
}

export interface MonthlyRevenueEntry {
  month: number;
  revenue: number;
}

export interface BestSellerEntry {
  productId: number;
  productName: string;
  unitsSold: number;
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemCount: number;
  paymentStatus?: string;
  shipmentStatus?: string;
  createdAt: string;
}

export interface CouponResponse {
  id: number;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  usageLimit: number;
  usageCount: number;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
}

export interface ProductRequest {
  name: string;
  slug: string;
  description: string;
  specifications?: string;
  gender: string;
  status: string;
  basePrice: number;
  discountPercentage: number;
  stockQuantity: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  categoryId?: number;
  brandId?: number;
}

export interface CouponRequest {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  usageLimit: number;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
}

export interface CategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
}

export interface BrandRequest {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
}
