import { apiClient } from './apiClient';

export interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: string;
  percentage_achieved: number;
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

export const savingsService = {
  getOverview: async () => {
    const response = await apiClient.get('/api/savings/overview');
    return response.data;
  },

  getGoals: async (userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/savings/mine/${id}` : `/api/savings/mine`;
    const response = await apiClient.get(url);
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

  createGoal: async (payload: { name: string; target_amount: number | string; deadline: string; frequency: string }, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/savings/create/${id}` : `/api/savings/create`;
    const response = await apiClient.post(url, payload);
    return response.data;
  },

  getGoalDetail: async (id: string, userId?: string) => {
    const uId = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = uId ? `/api/savings/details/${id}/${uId}` : `/api/savings/${id}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  breakGoal: async (id: string, userId?: string) => {
    const uId = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = uId ? `/api/savings/${id}/break/${uId}` : `/api/savings/${id}/break`;
    const response = await apiClient.post(url, { goal_id: id });
    return response.data;
  },

  setupDebit: async (userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/savings/setup/${id}` : `/api/savings/setup`;
    const response = await apiClient.post(url);
    return response.data;
  },

  createSavingsRecipient: async (goalId: string, data: { name: string; account_number: string; bank_code: string }, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const response = await apiClient.post(`/api/savings/receipt/${goalId}/${id}`, data);
    return response.data;
  },

  savingsWithdrawal: async (recipientId: string, goalId: string) => {
    const response = await apiClient.post(`/api/savings/withdraw/${recipientId}`, { goal_id: goalId });
    return response.data;
  }
};
