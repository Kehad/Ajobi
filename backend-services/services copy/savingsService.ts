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

  getGoals: async () => {
    const response = await apiClient.get('/api/savings/goals');
    return response.data;
  },

  getAutomationRules: async () => {
    const response = await apiClient.get('/api/savings/automation-rules');
    return response.data;
  },

  getActivity: async () => {
    const response = await apiClient.get('/api/savings/activity');
    return response.data;
  }
};
