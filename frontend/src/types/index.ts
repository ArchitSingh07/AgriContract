// TypeScript types and interfaces for the CropContract application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Farmer' | 'Buyer';
  location: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  farmerId: {
    _id: string;
    name: string;
    email: string;
    location: string;
  };
  name: string;
  type: string;
  description: string;
  location: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | 'bags' | 'crates' | 'boxes' | 'pieces';
  pricePerUnit: number;
  harvestDate: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'Farmer' | 'Buyer';
  location: string;
}

export interface CreateProductData {
  name: string;
  type: string;
  description: string;
  location: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: string;
  imageUrl?: string;
}

export interface UpdateProductData {
  name?: string;
  type?: string;
  description?: string;
  location?: string;
  quantity?: number;
  unit?: string;
  pricePerUnit?: number;
  harvestDate?: string;
  imageUrl?: string;
}

// Negotiation Types
export interface OfferDetails {
  price: number;
  quantity: number;
  deliveryDate: Date | string;
  terms?: string;
}

export interface Message {
  _id: string;
  senderId: string | User;
  senderType: 'farmer' | 'buyer';
  message: string;
  offerDetails?: OfferDetails;
  timestamp: Date | string;
}

export interface Negotiation {
  _id: string;
  listingType: 'product' | 'buyer-request';
  productId?: Product | string;
  buyerListingId?: BuyerListing | string;
  farmerId: User | string;
  buyerId: User | string;
  messages: Message[];
  status: 'active' | 'accepted' | 'rejected' | 'finalized';
  lastActivity: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NegotiationResponse {
  success: boolean;
  negotiation: Negotiation;
}

export interface NegotiationsResponse {
  success: boolean;
  negotiations: Negotiation[];
}

export interface StartNegotiationData {
  productId?: string;
  buyerListingId?: string;
  farmerId?: string;
  buyerId?: string;
  initialMessage: string;
  offerDetails?: OfferDetails;
}

export interface SendMessageData {
  negotiationId: string;
  message: string;
  offerDetails?: OfferDetails;
}

// Buyer Listing Types
export interface BuyerListing {
  _id: string;
  buyerId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    rating?: number;
    reviewCount?: number;
  };
  cropName: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'pulses' | 'spices' | 'other';
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | 'litre' | 'dozen' | 'piece';
  preferredPrice: number;
  preferredPriceUnit: 'per kg' | 'per quintal' | 'per ton' | 'per litre' | 'per dozen' | 'per piece';
  deliveryLocation: {
    city: string;
    state: string;
    pincode?: string;
  };
  preferredDeliveryDate: Date | string;
  description?: string;
  qualityRequirements?: string;
  status: 'active' | 'in-negotiation' | 'contracted' | 'fulfilled' | 'cancelled';
  images?: string[];
  offers?: BuyerListingOffer[];
  viewCount: number;
  offerCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BuyerListingOffer {
  _id: string;
  farmerId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    rating?: number;
  };
  offeredPrice: number;
  offeredQuantity: number;
  proposedDate?: Date | string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: Date | string;
}

export interface BuyerListingResponse {
  success?: boolean;
  message?: string;
  _id?: string;
  buyerId?: any;
  cropName?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  preferredPrice?: number;
  preferredPriceUnit?: string;
  deliveryLocation?: any;
  preferredDeliveryDate?: any;
  description?: string;
  qualityRequirements?: string;
  status?: string;
  images?: string[];
  offers?: BuyerListingOffer[];
  viewCount?: number;
  offerCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface BuyerListingsResponse {
  success?: boolean;
  count?: number;
  length?: number;
  [index: number]: BuyerListing;
}

export interface CreateBuyerListingData {
  cropName: string;
  category: string;
  quantity: number;
  unit?: string;
  preferredPrice: number;
  preferredPriceUnit?: string;
  deliveryLocation: {
    city: string;
    state: string;
    pincode?: string;
  };
  preferredDeliveryDate: Date | string;
  description?: string;
  qualityRequirements?: string;
  images?: string[];
}

export interface UpdateBuyerListingData {
  cropName?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  preferredPrice?: number;
  preferredPriceUnit?: string;
  deliveryLocation?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
  preferredDeliveryDate?: Date | string;
  description?: string;
  qualityRequirements?: string;
  status?: string;
  images?: string[];
}

export interface AddOfferToBuyerListingData {
  offeredPrice: number;
  offeredQuantity: number;
  proposedDate?: Date | string;
  message?: string;
}

// Contract Types
export interface Contract {
  _id: string;
  farmerId: User | string;
  buyerId: User | string;
  listingType: 'product' | 'buyer-request';
  productId?: Product | string;
  buyerListingId?: BuyerListing | string;
  negotiationId?: string;
  cropName: string;
  agreedPrice: number;
  quantity: number;
  unit: string;
  deliveryDate: Date | string;
  deliveryLocation?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
  terms: string;
  paymentTerms: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalValue: number;
  signedByFarmer: boolean;
  signedByBuyer: boolean;
  farmerSignDate?: Date | string;
  buyerSignDate?: Date | string;
  completionDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ContractResponse {
  success: boolean;
  contract: Contract;
}

export interface ContractsResponse {
  success: boolean;
  contracts: Contract[];
}

export interface CreateContractData {
  farmerId: string;
  buyerId: string;
  listingType: 'product' | 'buyer-request';
  productId?: string;
  buyerListingId?: string;
  negotiationId?: string;
  cropName: string;
  agreedPrice: number;
  quantity: number;
  unit?: string;
  deliveryDate: Date | string;
  deliveryLocation?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
  terms?: string;
  paymentTerms?: string;
}

export interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  pendingContracts: number;
  completedContracts: number;
  totalValue: number;
}

export interface ContractStatsResponse {
  success: boolean;
  stats: ContractStats;
}
