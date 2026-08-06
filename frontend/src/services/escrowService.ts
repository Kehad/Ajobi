import { apiClient } from './apiClient';

export interface CreateEscrowPayload {
  creator_id?: string | number;
  type?: string;
  counterparty_id?: string | number;
  recipient_user_id?: string;
  amount: number;
  description: string;
  expected_completion_date?: string;
  listing_id?: string | number;
}

export interface ConfirmEscrowPayload {
  name: string;
  account_number: string;
  bank_code: string;
  checkdate?: boolean;
}

export interface DisputePayload {
  raised_by?: string;
  reason: 'work_not_completed' | 'goods_not_delivered' | 'quality_not_as_agreed' | 'wrong_item_delivered' | 'seller_unresponsive' | 'other' | string;
  description: string;
  evidence_urls?: string[];
  general_id: string;
}

export interface EscrowResponse {
  status: boolean;
  message: string;
  data: {
    escrow_id: string | number;
    payment_reference?: string;
    squad_payment_link?: string;
    authorization_url?: string;
    type?: string;
    amount?: number;
    trust_score?: number;
    trust_verdict?: string;
    trust_reason?: string;
  };
}

export interface EscrowVirtualAccountResponse {
  status: boolean | "success";
  message: string;
  data: any;
}

export interface EscrowDisbursementResponse {
  status: boolean;
  message: string;
  url?: string;
  data?: any;
}

export const escrowService = {
  createEscrow: async (payload: CreateEscrowPayload, userId?: string): Promise<EscrowResponse> => {
    const id = userId || payload.creator_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/escrow/create/${id}` : `/api/escrow/create`;
    const response = await apiClient.post<EscrowResponse>(url, payload);
    return response.data;
  },

  getUserEscrows: async (userId?: string | number, params?: { type?: string; status?: string }) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/escrow/mine/${id}` : `/api/escrow/mine`;
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  getEscrowDetail: async (escrowId: string | number, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/escrow/${escrowId}/${id}` : `/api/escrow/${escrowId}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  confirmCreatorEscrow: async (escrowId: string | number, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const response = await apiClient.post(`/api/escrow/${escrowId}/creator/${id}`);
    return response.data;
  },

  confirmEscrow: async (escrowId: string | number, payload?: ConfirmEscrowPayload, userId?: string): Promise<EscrowDisbursementResponse> => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/escrow/${escrowId}/confirm/${id}` : `/api/escrow/${escrowId}/confirm`;
    const response = await apiClient.post(url, payload || {});
    return response.data;
  },

  singleTransferWithdrawal: async (recipientId: string, escrowId: string) => {
    const response = await apiClient.post(`/api/singletransfer/${recipientId}`, { escrow_id: escrowId });
    return response.data;
  },

  raiseDispute: async (payload: DisputePayload, userId?: string) => {
    const id = userId || payload.raised_by || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const body = { ...payload, raised_by: id };
    const response = await apiClient.post('/api/disputes', body);
    return response.data;
  },

  generateVirtualAccount: async (escrowId: string | number): Promise<EscrowVirtualAccountResponse> => {
    const response = await apiClient.post(`/api/escrow/${escrowId}/virtual-account`);
    return response.data;
  },

  getPublicEscrow: async (code: string) => {
    const response = await apiClient.get(`/api/escrow/public/${code}`);
    return response.data;
  }
};
