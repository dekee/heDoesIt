export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface ContactInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

export interface ContactInquiryResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthUser {
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface ProductRequest {
  name: string;
  description?: string;
  priceCents: number;
  categoryId?: number;
  featured: boolean;
  active: boolean;
  displayOrder: number;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  displayOrder: number;
}
