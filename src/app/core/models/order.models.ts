export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  primaryImageUrl: string | null;
  sku: string;
  sizeName: string | null;
  colorName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  customerNote?: string;
  shippingAddress: AddressSnapshot | null;
  billingAddress: AddressSnapshot | null;
  couponCode?: string;
  paymentStatus?: string;
  paymentProvider?: string;
  shipmentStatus?: string;
  trackingNumber?: string;
  carrier?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderRequest {
  shippingAddressId: number;
  billingAddressId: number;
  deliveryMethod?: string;
  paymentProvider?: string;
  customerNote?: string;
  couponCode?: string;
}
