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
    // const response = await apiClient.post('/api/listings', payload);
    return {
      success: true,
      data: {
        listing_id: "lst_p9q8r7",
        status: "active",
        created_at: "2024-05-29T10:00:00Z"
      }
    };
  },

  browseListings: async (params: BrowseListingsParams) => {
    // const response = await apiClient.get('/api/listings/browse', { params });
    return {
      success: true,
      data: {
        listings: [
          {
            listing_id: "lst_p9q8r7",
            seller_type: "artisan",
            category: "Fashion & Tailoring",
            title: "Custom Ankara Dress",
            price: 25000,
            allows_instalment: true,
            min_instalment_count: 2,
            thumbnail: "https://storage.url/image1.jpg",
            location: "Surulere, Lagos",
            seller: {
              name: "Mama Ngozi",
              ajo_score: 74,
              score_tier: "Gold",
              completed_escrows: 34
            },
            created_at: "2024-05-29T10:00:00Z"
          }
        ],
        total: 86,
        page: 1,
        limit: 12
      }
    };
  },

  getListingDetail: async (listingId: string) => {
    // const response = await apiClient.get(`/api/listings/${listingId}`);
    return {
      success: true,
      data: {
        listing_id: "lst_p9q8r7",
        seller_type: "artisan",
        category: "Fashion & Tailoring",
        title: "Custom Ankara Dress",
        description: "I make custom Ankara dresses to fit. Any style, any size. 7-day turnaround.",
        price: 25000,
        images: [
          "https://storage.url/image1.jpg",
          "https://storage.url/image2.jpg"
        ],
        location: "Surulere, Lagos",
        delivery_available: true,
        lead_time: "7-14 days",
        allows_instalment: true,
        min_instalment_count: 2,
        status: "active",
        created_at: "2024-05-29T10:00:00Z",
        seller: {
          user_id: "usr_001",
          name: "Mama Ngozi",
          photo: "https://img.freepik.com/premium-photo/happy-african-american-woman-smiling-studio_576311-37877.jpg",
          ajo_score: 74,
          score_tier: "Gold",
          member_since: "2024-01-15T00:00:00Z",
          completed_escrows: 34,
          dispute_rate: "0%",
          response_rate: "98%"
        }
      }
    };
  },

  initiatePurchase: async (listingId: string, payload: PurchasePayload) => {
    // const response = await apiClient.post(`/api/listings/${listingId}/buy`, payload);
    return {
      success: true,
      data: {
        escrow_id: "esc_m1n2o3",
        payment_type: payload.payment_type || "instalment",
        total_amount: 25000,
        trust_score: 82,
        trust_verdict: "SAFE",
        trust_reason: "Seller has strong transaction history. No flags detected.",
        instalment_schedule: [
          {
            instalment_number: 1,
            amount: 8334,
            due_date: "2024-06-05T00:00:00Z"
          },
          {
            instalment_number: 2,
            amount: 8333,
            due_date: "2024-07-05T00:00:00Z"
          },
          {
            instalment_number: 3,
            amount: 8333,
            due_date: "2024-08-05T00:00:00Z"
          }
        ],
        next_step: "setup_mandate"
      }
    };
  }
};
