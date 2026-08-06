import { apiClient } from './apiClient';

export const adminService = {
  getTransactions: async (userId?: string, params?: { page?: number; type?: string; date?: string }) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/admin/transactions/${id}` : '/api/admin/transactions';
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  getDisputedEscrows: async (userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/admin/disputed/${id}` : '/api/admin/escrow/disputed';
    const response = await apiClient.get(url);
    return response.data;
  },

  releaseEscrow: async (escrowId: string | number, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/admin/escrow/${escrowId}/release/${id}` : `/api/admin/escrow/${escrowId}/release`;
    const response = await apiClient.get(url);
    return response.data;
  },

  refundEscrow: async (escrowId: string | number) => {
    const response = await apiClient.post(`/api/admin/escrow/${escrowId}/refund`);
    return response.data;
  },

  getUsers: async (userId?: string, params?: { page?: number }) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/admin/users/${id}` : '/api/admin/users';
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  banUser: async (targetUserId: string | number, adminUserId?: string) => {
    const id = adminUserId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/admin/users/${targetUserId}/ban/${id}` : `/api/admin/users/${targetUserId}/ban`;
    const response = await apiClient.get(url);
    return response.data;
  }
};
