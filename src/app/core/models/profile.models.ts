export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
  defaultShipping: boolean;
  defaultBilling: boolean;
}

export interface AddressRequest {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
  defaultShipping: boolean;
  defaultBilling: boolean;
}
