import api from '../lib/api';
import type {
  ProductResponse,
  ProductsResponse,
  CreateProductData,
  UpdateProductData,
} from '../types';

export const productService = {
  // Get all products with optional filters
  getAllProducts: async (filters?: {
    type?: string;
    name?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'price' | 'quantity' | 'date';
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get<ProductsResponse>(url);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  // Get products by farmer ID
  getProductsByFarmer: async (farmerId: string): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`/products/farmer/${farmerId}`);
    return response.data;
  },

  // Create new product (Farmer only)
  createProduct: async (data: CreateProductData): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>('/products', data);
    return response.data;
  },

  // Update product (Farmer only)
  updateProduct: async (id: string, data: UpdateProductData): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (Farmer only)
  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
