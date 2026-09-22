import { apiClient } from './apiClient';

export interface SavingsGoal {
  goal_id?: string;
  id?: string;
  user_id?: string;
  name: string;
  title?: string;
  target_amount: number;
  locked_balance?: number;
  current_amount?: number;
  frequency: 'daily' | 'weekly' | 'monthly' | string;
  deadline?: string;
  instalment_amount?: number;
  next_debit_date?: string | null;
  paystack_mandate_code?: string | null;
  status: string;
  created_at?: string;
  withdrawal_enabled?: boolean;
  recipient_code?: string | null;
  reference?: string | null;
  withdrawal_date?: string | null;
}

export interface SavingsInstalment {
  id: number | string;
  goal_id: string;
  user_id: string;
  amount: number;
  status: string;
  paystack_reference?: string | null;
  paid_at?: string | null;
  created_at?: string;
}

export interface SavingsGoalDetailData {
  goal: SavingsGoal;
  progress_percentage?: number;
  instalments?: SavingsInstalment[];
}

export interface CreateSavingsGoalPayload {
  name: string;
  target_amount: string | number;
  deadline: string;
  frequency: 'daily' | 'weekly' | 'monthly' | string;
}

export interface CreateSavingsGoalResponse {
  success?: boolean;
  status?: boolean | string;
  goal_id?: string;
  instalment_amount?: string | number;
  periods?: number;
  message?: string;
}

export interface SetupDebitResponse {
  success?: boolean;
  status?: boolean | string;
  authorization_url?: string;
  data?: {
    authorization_url?: string;
    [key: string]: any;
  };
  message?: string;
}

export interface BreakGoalResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  released_balance?: string | number;
  ajo_penalty?: number;
  response?: any;
}

export interface BankItem {
  name: string;
  code: string;
  bank_code?: string;
  id?: number | string;
}

export interface SavingsRecipientPayload {
  name: string;
  account_number: string;
  bank_code: string;
}

export interface SavingsRecipientResponse {
  status?: string | boolean;
  success?: boolean;
  message?: string;
  data?: any;
}

export interface WithdrawalPayload {
  goal_id: string;
}

export interface WithdrawalResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: any;
}

export interface AutomationRule {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  status: 'active' | 'inactive';
}

export interface SavingsActivity {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'deposit' | 'interest' | 'bonus';
}

const getUserId = (userId?: string): string => {
  if (userId) return userId;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId') || '';
  }
  return '';
};

export const savingsService = {
  // getOverview: async () => {
  //   const response = await apiClient.get('/api/savings/overview');
  //   return response.data;
  // },

  getGoals: async (userId?: string) => {
    const id = getUserId(userId);
    const url = id ? `/api/savings/mine/${id}` : `/api/savings/mine`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getGoalDetail: async (goalId: string, userId?: string) => {
    const id = getUserId(userId);
    const url = id ? `/api/savings/details/${goalId}/${id}` : `/api/savings/details/${goalId}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  createGoal: async (payload: CreateSavingsGoalPayload, userId?: string) => {
    const id = getUserId(userId);
    const url = id ? `/api/savings/create/${id}` : `/api/savings/create`;
    const response = await apiClient.post(url, payload);
    return response.data;
  },

  setupDebit: async (userId?: string) => {
    const id = getUserId(userId);
    const url = id ? `/api/savings/setup/${id}` : `/api/savings/setup`;
    const response = await apiClient.post(url);
    return response.data;
  },

  breakGoal: async (goalId: string, userId?: string) => {
    const id = getUserId(userId);
    const url = id ? `/api/savings/${goalId}/break/${id}` : `/api/savings/${goalId}/break`;
    const response = await apiClient.post(url, { goal_id: goalId });
    return response.data;
  },

  getBankList: async () => {
    const response = await apiClient.get('/api/banklist');
    return response.data;
  },

  createSavingsRecipient: async (goalId: string, payload: SavingsRecipientPayload, userId?: string) => {
    const id = getUserId(userId);
    const url = id ? `/api/savings/receipt/${goalId}/${id}` : `/api/savings/receipt/${goalId}`;
    const response = await apiClient.post(url, payload);
    return response.data;
  },

  savingsWithdrawal: async (recipientId: string, goalId: string) => {
    const response = await apiClient.post(`/api/savings/withdraw/${recipientId}`, { goal_id: goalId });
    return response.data;
  },

  getAutomationRules: async () => {
    const response = await apiClient.get('/api/savings/automation-rules');
    return response.data;
  },

  getActivity: async () => {
    const response = await apiClient.get('/api/savings/activity');
    return response.data;
  },
};

