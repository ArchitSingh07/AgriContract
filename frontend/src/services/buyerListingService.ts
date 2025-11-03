import api from '../lib/api';
import {
  BuyerListing,
  BuyerListingResponse,
  BuyerListingsResponse,
  CreateBuyerListingData,
  UpdateBuyerListingData,
  AddOfferToBuyerListingData,
} from '../types';

/**
 * Buyer Listing Service
 * Handles all API calls related to buyer listings
 */

export const buyerListingService = {
  /**
   * Create a new buyer listing
   */
  createBuyerListing: async (data: CreateBuyerListingData): Promise<BuyerListing> => {
    const response = await api.post<BuyerListingResponse>('/buyer-listings', data);
    return response.data as unknown as BuyerListing;
  },

  /**
   * Get all buyer listings with optional filters
   */
  getAllBuyerListings: async (filters?: {
    category?: string;
    cropName?: string;
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    status?: string;
    sortBy?: 'price' | 'quantity' | 'date';
    sortOrder?: 'asc' | 'desc';
  }): Promise<BuyerListing[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/buyer-listings?${queryString}` : '/buyer-listings';
    
    const response = await api.get<BuyerListingsResponse>(url);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get buyer's own listings
   */
  getMyBuyerListings: async (): Promise<BuyerListing[]> => {
    const response = await api.get<BuyerListingsResponse>('/buyer-listings/my-listings');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get a single buyer listing by ID
   */
  getBuyerListingById: async (id: string): Promise<BuyerListing> => {
    const response = await api.get<BuyerListingResponse>(`/buyer-listings/${id}`);
    return response.data as unknown as BuyerListing;
  },

  /**
   * Update a buyer listing
   */
  updateBuyerListing: async (id: string, data: UpdateBuyerListingData): Promise<BuyerListing> => {
    const response = await api.put<BuyerListingResponse>(`/buyer-listings/${id}`, data);
    return response.data as unknown as BuyerListing;
  },

  /**
   * Delete a buyer listing
   */
  deleteBuyerListing: async (id: string): Promise<void> => {
    await api.delete(`/buyer-listings/${id}`);
  },

  /**
   * Add an offer to a buyer listing (farmer only)
   */
  addOfferToBuyerListing: async (id: string, offerData: AddOfferToBuyerListingData): Promise<BuyerListing> => {
    const response = await api.post<BuyerListingResponse>(`/buyer-listings/${id}/offer`, offerData);
    return response.data as unknown as BuyerListing;
  },
};

export default buyerListingService;
