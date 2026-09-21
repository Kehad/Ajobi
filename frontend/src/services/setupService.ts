import { apiClient } from './apiClient';

export interface SetupProgressResponse {
  success: boolean;
  data: {
    steps_completed: number[];
    current_step: number;
    onboarding_complete: boolean;
  };
}

export interface SetupStepResponse {
  success: boolean;
  data: {
    step_completed: number;
    next_step: number;
  };
}

export interface SetupFinalResponse {
  success: boolean;
  data: {
    onboarding_complete: boolean;
    ajo_score: number;
    score_tier: string;
    profile_image?: string;
    breakdown: {
      savings_consistency: number;
      repayment_behaviour: number;
      escrow_completion: number;
      transaction_history: number;
      account_maturity: number;
      community_standing: number;
    };
    explanation: string;
    improvement_tips: string[];
  };
}

export interface BankStatementUploadResponse {
  success: boolean;
  data: {
    bank_statement_score?: number;
    bank_breakdown?: any;
    bank_summary?: string;
    red_flags?: string[];
    positive_signals?: string[];
    analysis_valid?: boolean;
    updated_ajo_score?: number;
    updated_tier?: string;
    score_breakdown?: any;
    explanation?: string;
    improvement_tips?: string[];
    message?: string;
  };
}

export interface BankStatementStatusResponse {
  success: boolean;
  data: Array<{
    uploaded: boolean;
    bank_statement_score: number | null;
    analyzed_at: string | null;
    Current_ajo_score: number;
    score_unlocked_above_50: boolean;
  }>;
}

export const setupService = {
  getProgress: async (email?: string): Promise<SetupProgressResponse> => {
    const url = email ? `/api/onboarding/progress/${encodeURIComponent(email)}` : `/api/onboarding/progress`;
    const response = await apiClient.get<SetupProgressResponse>(url);
    return response.data;
  },
  submitStep1: async (data: { occupation: string; email?: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step1', data);
    return response.data;
  },
  submitStep2: async (data: { trade_duration: string; state: string; lga: string; income_range: string; email?: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step2', data);
    return response.data;
  },
  submitStep3: async (data: { saves_money: boolean; savings_methods: string[]; in_ajo_group: boolean; contribution_consistency: string; email?: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step3', data);
    return response.data;
  },
  submitStep4: async (data: { has_borrowed: boolean; repaid_fully: boolean; repaid_on_time: boolean; email?: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step4', data);
    return response.data;
  },
  submitStep5: async (data: { language: string; profile_photo?: File | null | string; email?: string }): Promise<SetupFinalResponse> => {
    let payload: any = data;
    if (data.profile_photo instanceof File) {
      const formData = new FormData();
      formData.append('language', data.language);
      formData.append('profile_photo', data.profile_photo, data.profile_photo.name);
      formData.append('profile_image', data.profile_photo, data.profile_photo.name);
      if (data.email) formData.append('email', data.email);
      payload = formData;
    }
    const response = await apiClient.post<SetupFinalResponse>('/api/onboarding/step5', payload);
    return response.data;
  },
  uploadBankStatement: async (payload: FormData | { bank_statement?: any; email?: string }): Promise<BankStatementUploadResponse> => {
    const response = await apiClient.post<BankStatementUploadResponse>('/api/bank-statement/status', payload);
    return response.data;
  },
  getBankStatementStatus: async (email?: string): Promise<BankStatementStatusResponse> => {
    const response = await apiClient.get<BankStatementStatusResponse>('/api/bank-statement/status', {
      params: email ? { email } : {}
    });
    return response.data;
  }
};

