import { apiClient } from './apiClient';

export interface CreateListingPayload {
  seller_type: 'product' | 'artisan' | 'service';
  category: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  condition?: 'New' | 'Used' | null;
  delivery_available?: boolean;
  lead_time?: string;
  allows_instalment?: boolean;
  min_instalment_count?: number;
}

export interface ListingItem {
  listing_id: string;
  seller_type: string;
  category: string;
  title: string;
  price: number;
  allows_instalment: boolean;
  min_instalment_count?: number;
  thumbnail: string;
  location: string;
  seller: {
    name: string;
    ajo_score: number;
    score_tier: string;
    completed_escrows: number;
  };
  created_at: string;
}

export interface ListingDetail extends Omit<ListingItem, 'thumbnail' | 'seller'> {
  description: string;
  images: string[];
  delivery_available: boolean;
  lead_time: string;
  status: string;
  seller: {
    user_id: string;
    name: string;
    photo: string;
    ajo_score: number;
    score_tier: string;
    member_since: string;
    completed_escrows: number;
    dispute_rate: string;
    response_rate: string;
  };
}

export interface BrowseListingsParams {
  category?: string;
  seller_type?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  allows_instalment?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PurchasePayload {
  user_id: string;
  payment_type?: 'full' | 'instalment';
  instalment_count?: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

export const marketplaceService = {
  createListing: async (payload: CreateListingPayload) => {
    const response = await apiClient.post('/api/listings', payload);
    return response.data;
  },

  browseListings: async (params: BrowseListingsParams) => {
    const response = await apiClient.get('/api/listings/browse', { params });
    return response.data;
  },

  getListingDetail: async (listingId: string) => {
    const response = await apiClient.get(`/api/listings/${listingId}`);
    return response.data;
  },

  initiatePurchase: async (listingId: string, payload: PurchasePayload) => {
    const response = await apiClient.post(`/api/listings/${listingId}/buy`, payload);
    return response.data;
  }
};
