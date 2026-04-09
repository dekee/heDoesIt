import type {
  ProductResponse,
  CategoryResponse,
  ContactInquiryRequest,
  ContactInquiryResponse,
  AuthUser,
  ProductRequest,
  CategoryRequest,
} from './types';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }
  return { 'Content-Type': 'application/json' };
}

function authHeadersNoContent(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('auth_token');
    const error = await response.json().catch(() => ({ message: 'Authentication required' }));
    throw new Error(error.error || error.message || 'Authentication required');
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

// --- Products (Public) ---
export async function fetchProducts(params?: { category?: number; featured?: boolean }): Promise<ProductResponse[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', String(params.category));
  if (params?.featured) searchParams.set('featured', 'true');
  const query = searchParams.toString();
  const url = query ? `/api/products?${query}` : '/api/products';
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchProduct(id: number): Promise<ProductResponse> {
  const res = await fetch(`/api/products/${id}`);
  return handleResponse(res);
}

// --- Categories (Public) ---
export async function fetchCategories(): Promise<CategoryResponse[]> {
  const res = await fetch('/api/categories');
  return handleResponse(res);
}

// --- Contact (Public) ---
export async function submitContact(data: ContactInquiryRequest): Promise<ContactInquiryResponse> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// --- Subscribe (Public) ---
export async function subscribe(email: string): Promise<{ message: string }> {
  const res = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// --- Auth ---
export async function verifyAuth(): Promise<AuthUser> {
  const res = await fetch('/api/auth/me', { headers: authHeaders() });
  return handleResponse(res);
}

// --- Admin Products ---
export async function fetchAllProducts(): Promise<ProductResponse[]> {
  const res = await fetch('/api/admin/products', { headers: authHeaders() });
  return handleResponse(res);
}

export async function createProduct(data: ProductRequest, image?: File): Promise<ProductResponse> {
  const formData = new FormData();
  formData.append('product', JSON.stringify(data));
  if (image) formData.append('image', image);
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: authHeadersNoContent(),
    body: formData,
  });
  return handleResponse(res);
}

export async function updateProduct(id: number, data: ProductRequest, image?: File): Promise<ProductResponse> {
  const formData = new FormData();
  formData.append('product', JSON.stringify(data));
  if (image) formData.append('image', image);
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeadersNoContent(),
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Admin Categories ---
export async function createCategory(data: CategoryRequest): Promise<CategoryResponse> {
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateCategory(id: number, data: CategoryRequest): Promise<CategoryResponse> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Admin Inquiries ---
export async function fetchInquiries(): Promise<ContactInquiryResponse[]> {
  const res = await fetch('/api/admin/inquiries', { headers: authHeaders() });
  return handleResponse(res);
}

export async function markInquiryRead(id: number): Promise<ContactInquiryResponse> {
  const res = await fetch(`/api/admin/inquiries/${id}/read`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function deleteInquiry(id: number): Promise<void> {
  const res = await fetch(`/api/admin/inquiries/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Admin Users ---
export async function fetchAdminUsers(): Promise<{ id: number; email: string; name: string; createdAt: string }[]> {
  const res = await fetch('/api/admin/users', { headers: authHeaders() });
  return handleResponse(res);
}

export async function addAdminUser(data: { email: string; name: string }): Promise<{ id: number; email: string; name: string }> {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function removeAdminUser(id: number): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Admin Subscribers ---
export async function fetchSubscribers(): Promise<{ id: number; email: string; createdAt: string }[]> {
  const res = await fetch('/api/admin/subscribers', { headers: authHeaders() });
  return handleResponse(res);
}
