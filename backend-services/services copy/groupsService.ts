import { apiClient } from './apiClient';

export interface CreateGroupPayload {
  name: string;
  contribution_amount: number;
  frequency: 'weekly' | 'monthly';
  max_members: number;
  min_ajo_score: number;
  rotation_type: 'random' | 'manual';
  grace_period_hours: 24 | 48;
  description?: string;
}

export interface BrowseGroupsParams {
  frequency?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
}

export interface JoinGroupPayload {
  invite_code: string;
}

export interface AutoMatchPayload {
  contribution_amount: number;
  frequency: 'weekly' | 'monthly';
  user_id: string;
}

export interface MandatePayload {
  bank_account_number: string;
  bank_code: string;
}

export const groupsService = {
  createGroup: async (payload: CreateGroupPayload) => {
    const response = await apiClient.post('/api/groups', payload);
    return response.data;
  },

  browseGroups: async (params?: BrowseGroupsParams) => {
    const response = await apiClient.get('/api/groups/browse', { params });
              
    return response.data;
  },

  getMyGroups: async (userId: string) => {
    const response = await apiClient.get(`/api/mygroups/${userId}`);
    return response.data;
  },

  getGroupDetail: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  },

  joinGroup: async (groupId: string, payload: JoinGroupPayload) => {
    const response = await apiClient.post(`/api/groups/${groupId}/join`, payload);
    return response.data;
  },

  autoMatchGroup: async (payload: AutoMatchPayload) => {
    const response = await apiClient.post('/api/groups/match', payload);
    return response.data;
  },

  setupDirectDebitMandate: async (groupId: string, payload: MandatePayload) => {
    const response = await apiClient.post(`/api/groups/${groupId}/mandate`, payload);
    return response.data;
  },

  getGroupContributionHistory: async (groupId: string, cycle: string = 'all') => {
    const response = await apiClient.get(`/api/groups/${groupId}/contributions`, {
      params: { cycle }
    });
    return response.data;
  },

  createGroupVirtualAccount: async (groupId: string | number) => {
    const response = await apiClient.post('/api/user/groupvirtualaccounts', { group_id: groupId });
    return response.data;
  },

  initiateGroupPayment: async (userId: string | number, groupId: string | number) => {
    const response = await apiClient.post('/api/user/group_payment', { 
      user_id: userId, 
      group_id: groupId 
    });
    return response.data;
  }
};
