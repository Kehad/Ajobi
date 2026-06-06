import { apiClient } from './apiClient';

export interface CreateEscrowPayload {
  creator_id: string | number;
  type: string;
  counterparty_id: string | number;
  amount: number;
  description: string;
  expected_completion_date?: string;
  listing_id?: string | number;
}

export interface EscrowResponse {
  success: boolean;
  message: string;
  data: {
    escrow_id: string | number;
    payment_reference: string;
    squad_payment_link: string;
    type: string;
    amount: number;
    trust_score: number;
    trust_verdict: string;
    trust_reason: string;
  };
}

export interface EscrowVirtualAccountResponse {
  status: string;
  data: any;
}

export interface EscrowDisbursementResponse {
  success: string;
  message: string;
  url: string;
}

export const escrowService = {
  createEscrow: async (payload: CreateEscrowPayload): Promise<EscrowResponse> => {
    const response = await apiClient.post<EscrowResponse>('/api/escrow', payload);
    return response.data;
  },

  getUserEscrows: async (userId: string | number, params?: { type?: string; status?: string }) => {
    const response = await apiClient.get(`/api/escrow/user/${userId}`, { params });
    return response.data;
  },

  getEscrowDetail: async (escrowId: string | number) => {
    const response = await apiClient.get(`/api/escrow/${escrowId}`);
    return response.data;
  },

  generateVirtualAccount: async (escrowId: string | number): Promise<EscrowVirtualAccountResponse> => {
    const response = await apiClient.post<EscrowVirtualAccountResponse>('/api/user/escrowvirtualaccounts', { escrow_id: escrowId });
    return response.data;
  },

  initiateDisbursement: async (escrowId: string | number): Promise<EscrowDisbursementResponse> => {
    const response = await apiClient.post<EscrowDisbursementResponse>('/api/user/Escrow_disbursement', { escrow_id: escrowId });
    return response.data;
  }
};
