import { apiClient } from './apiClient';

export interface CreateGroupPayload {
  name: string;
  user_id?: string;
  contribution_amount: number;
  frequency: 'weekly' | 'monthly' | 'daily';
  max_members: number;
  min_ajo_score: number;
  rotation_type: 'random' | 'manual';
  grace_period_hours: 24 | 48;
  description?: string;
  joining_method: 'manual' | 'automatch';
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
  user_id?: string;
}

export interface MandatePayload {
  bank_account_number?: string;
  bank_code?: string;
}

export const groupsService = {
  createGroup: async (payload: CreateGroupPayload) => {
    const userId = payload.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const body = { ...payload, user_id: userId };
    const response = await apiClient.post('/api/groups', body);
    return response.data;
  },

  browseGroups: async (params?: BrowseGroupsParams) => {
    const response = await apiClient.get('/api/groups/browse', { params });
    return response.data;
  },

  getMyGroups: async (userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/mygroups/${id}` : '/api/groups/mine';
    const response = await apiClient.get(url);
    return response.data;
  },

  getGroupDetail: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  },

  getGroupMembers: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}/members`);
    return response.data;
  },

  joinGroup: async (groupId: string, payload: JoinGroupPayload, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/groups/${groupId}/join/${id}` : `/api/groups/${groupId}/join`;
    const response = await apiClient.post(url, { invite_code: payload.invite_code });
    return response.data;
  },

  autoMatchGroup: async (payload: AutoMatchPayload) => {
    const userId = payload.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const body = { ...payload, user_id: userId };
    const response = await apiClient.post('/api/groups/match', body);
    return response.data;
  },

  setupDirectDebitMandate: async (groupId: string, payload?: MandatePayload, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/savings/setup/${id}` : `/api/groups/${groupId}/setup-debit`;
    const response = await apiClient.post(url, payload || {});
    return response.data;
  },

  createGroupPaymentForm: async (groupId: string, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const response = await apiClient.post(`/api/groups/grouppaymentform/${groupId}`, { user_id: id });
    return response.data;
  },

  createPersonalPaymentForm: async (groupId: string, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const response = await apiClient.post(`/api/groups/personalpayment/${groupId}`, { user_id: id });
    return response.data;
  },

  getBankList: async () => {
    const response = await apiClient.get('/api/banklist');
    return response.data;
  },

  generateReceiptId: async (groupId: string, data: { name: string; account_number: string; bank_code: string }, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const response = await apiClient.post(`/api/groups/generatereceipt/${id}/${groupId}`, data);
    return response.data;
  },

  groupWithdrawal: async (recipientId: string, groupId: string) => {
    const response = await apiClient.post(`/api/groups/Withdrawal/${recipientId}`, { group_id: groupId });
    return response.data;
  },

  activateGroup: async (groupId: string) => {
    const response = await apiClient.post(`/api/groups/activate/${groupId}`);
    return response.data;
  },

  getGroupContributionHistory: async (groupId: string, cycle: string = 'all') => {
    const response = await apiClient.get(`/api/groups/${groupId}/payments`, { params: { cycle } });
    return response.data;
  },

  createGroupVirtualAccount: async (groupId: string | number) => {
    const response = await apiClient.post('/api/user/groupvirtualaccounts', { group_id: groupId });
    return response.data;
  },

  initiateGroupPayment: async (userId: string | number, groupId: string | number) => {
    const response = await apiClient.post('/api/user/group_payment', { user_id: userId, group_id: groupId });
    return response.data;
  }
};
