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
    // const response = await apiClient.post<EscrowResponse>('/api/escrow', payload);
    return {
      success: true,
      message: "Escrow created successfully",
      data: {
        escrow_id: "esc_m1n2o3",
        payment_reference: "ref_123",
        squad_payment_link: "https://pay.squadco.com/esc_m1n2o3",
        type: payload.type,
        amount: payload.amount,
        trust_score: 88,
        trust_verdict: "SAFE",
        trust_reason: "Both parties have strong AjoScores and no dispute history."
      }
    };
  },

  getUserEscrows: async (userId: string | number, params?: { type?: string; status?: string }) => {
    // const response = await apiClient.get(`/api/escrow/user/${userId}`, { params });
    return {
      success: true,
      data: {
        escrows: [
          {
            escrow_id: "esc_m1n2o3",
            type: "employment",
            amount: 50000,
            status: "funded",
            my_role: "employer",
            counterparty_name: "Chidi Graphics",
            counterparty_score: 71,
            description: "Logo design job",
            my_confirmation: false,
            counterparty_confirmation: false,
            created_at: "2024-05-29T10:00:00Z"
          }
        ],
        total: 12,
        page: 1,
        limit: 10
      }
    };
  },

  getEscrowDetail: async (escrowId: string | number) => {
    // const response = await apiClient.get(`/api/escrow/${escrowId}`);
    return {
      success: true,
      data: {
        escrow_id: "esc_m1n2o3",
        type: "employment",
        amount: 50000,
        status: "funded",
        description: "Logo design and brand identity",
        trust_score: 88,
        trust_verdict: "SAFE",
        creator: { user_id: "usr_001", name: "Emeka Obi", ajo_score: 68, role: "employer" },
        counterparty: { user_id: "usr_002", name: "Chidi Graphics", ajo_score: 71, role: "worker" },
        confirmation_status: { creator_confirmed: false, counterparty_confirmed: true, both_confirmed: false },
        dispute_raised: false,
        squad_escrow_id: "SQD_ESC_001",
        created_at: "2024-05-29T10:00:00Z",
        expected_completion: "2024-06-15T00:00:00Z",
        instalment_schedule: null
      }
    };
  },

  generateVirtualAccount: async (escrowId: string | number): Promise<EscrowVirtualAccountResponse> => {
    return { status: "success", data: { account_number: "0123456789", bank_name: "Mock Bank", account_name: "Mock Escrow" } };
  },

  initiateDisbursement: async (escrowId: string | number): Promise<EscrowDisbursementResponse> => {
    return { success: "true", message: "Disbursement initiated", url: "https://sandbox.squadco.com/pay/123" };
  }
};
