import axiosInstance from '../lib/api';
import type {
  StartNegotiationData,
  SendMessageData,
  NegotiationResponse,
  NegotiationsResponse,
} from '../types';

export const negotiationService = {
  // Start a new negotiation
  startNegotiation: async (data: StartNegotiationData): Promise<NegotiationResponse> => {
    const response = await axiosInstance.post('/negotiations/start', data);
    return response.data;
  },

  // Send a message in negotiation
  sendMessage: async (data: SendMessageData): Promise<NegotiationResponse> => {
    const response = await axiosInstance.post('/negotiations/message', data);
    return response.data;
  },

  // Get all negotiations for a product
  getNegotiationsByProduct: async (productId: string): Promise<NegotiationsResponse> => {
    const response = await axiosInstance.get(`/negotiations/product/${productId}`);
    return response.data;
  },

  // Get single negotiation by ID
  getNegotiationById: async (negotiationId: string): Promise<NegotiationResponse> => {
    const response = await axiosInstance.get(`/negotiations/${negotiationId}`);
    return response.data;
  },

  // Get all negotiations for a farmer
  getNegotiationsByFarmer: async (farmerId: string): Promise<NegotiationsResponse> => {
    const response = await axiosInstance.get(`/negotiations/farmer/${farmerId}`);
    return response.data;
  },

  // Update negotiation status
  updateNegotiationStatus: async (
    negotiationId: string,
    status: 'active' | 'accepted' | 'rejected' | 'finalized'
  ): Promise<NegotiationResponse> => {
    const response = await axiosInstance.put(`/negotiations/${negotiationId}/status`, { status });
    return response.data;
  },
};
