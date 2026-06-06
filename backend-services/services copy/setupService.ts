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

export const setupService = {
  getProgress: async (email: string): Promise<SetupProgressResponse> => {
    const response = await apiClient.get<SetupProgressResponse>(`/api/onboarding/progress/${email}`);
    return response.data;
  },
  submitStep1: async (data: { occupation: string, email: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step1', data);
    return response.data;
  },
  submitStep2: async (data: { trade_duration: string; state: string; lga: string; income_range: string, email: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step2', data);
    return response.data;
  },
  submitStep3: async (data: { saves_money: boolean; savings_methods: string[]; in_ajo_group: boolean; contribution_consistency: string, email: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step3', data);
    return response.data;
  },
  submitStep4: async (data: { has_borrowed: boolean; repaid_fully: boolean; repaid_on_time: boolean, email: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post<SetupStepResponse>('/api/onboarding/step4', data);
    return response.data;
  },
  submitStep5: async (data: { language: string; profile_photo: File | null | string, email: string }): Promise<SetupFinalResponse> => {
    const response = await apiClient.post<SetupFinalResponse>('/api/onboarding/step5', data);
    return response.data;
  }
};
