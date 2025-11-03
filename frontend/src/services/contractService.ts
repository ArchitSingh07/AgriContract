import axiosInstance from '../lib/api';
import type {
  CreateContractData,
  ContractResponse,
  ContractsResponse,
  ContractStatsResponse,
} from '../types';

export const contractService = {
  // Create a new contract
  createContract: async (data: CreateContractData): Promise<ContractResponse> => {
    const response = await axiosInstance.post('/contracts/create', data);
    return response.data;
  },

  // Get all contracts for a farmer
  getContractsByFarmer: async (farmerId: string): Promise<ContractsResponse> => {
    const response = await axiosInstance.get(`/contracts/farmer/${farmerId}`);
    return response.data;
  },

  // Get all contracts for a buyer
  getContractsByBuyer: async (buyerId: string): Promise<ContractsResponse> => {
    const response = await axiosInstance.get(`/contracts/buyer/${buyerId}`);
    return response.data;
  },

  // Get single contract by ID
  getContractById: async (contractId: string): Promise<ContractResponse> => {
    const response = await axiosInstance.get(`/contracts/${contractId}`);
    return response.data;
  },

  // Sign a contract
  signContract: async (contractId: string): Promise<ContractResponse> => {
    const response = await axiosInstance.put(`/contracts/${contractId}/sign`);
    return response.data;
  },

  // Update contract status
  updateContractStatus: async (
    contractId: string,
    status: 'pending' | 'active' | 'completed' | 'cancelled'
  ): Promise<ContractResponse> => {
    const response = await axiosInstance.put(`/contracts/${contractId}/status`, { status });
    return response.data;
  },

  // Get contract statistics
  getContractStats: async (userId: string): Promise<ContractStatsResponse> => {
    const response = await axiosInstance.get(`/contracts/stats/${userId}`);
    return response.data;
  },
};
