import { apiClient } from './apiClient';

export interface SkillItem {
  skill: string;
  years_experience: number;
}

export interface UserProfile {
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  occupation?: string;
  state?: string;
  lga?: string;
  language?: string;
  profile_photo?: string;
  member_since?: string;
  ajo_score?: number;
  score_tier?: string;
  skills?: SkillItem[];
  availability?: string;
  rate?: string;
  referral_code?: string;
  referral_count?: number;
  referral_score_bonus?: number;
}

export interface UpdateProfilePayload {
  full_name?: string;
  occupation?: string;
  state?: string;
  lga?: string;
  language?: string;
}

export interface AddSkillsPayload {
  skills: SkillItem[];
}

export interface AddSkillsResponseData {
  skills_added: number;
  total_skills: number;
}

export interface SecuritySettings {
  biometric_enabled: boolean;
  transaction_pin_set: boolean;
}

export interface NotificationSettings {
  push_notifications: boolean;
  sms_alerts: boolean;
}

const getUserId = (userId?: string): string => {
  if (userId) return userId;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId') || '';
  }
  return '';
};

export const settingsService = {
  getProfile: async (userId?: string) => {
    const targetId = getUserId(userId);
    const url = targetId ? `/api/profile/${targetId}` : '/api/profile';
    const response = await apiClient.get(url);
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload, userId?: string) => {
    const targetId = getUserId(userId);
    const url = targetId ? `/api/updateProfile/${targetId}` : '/api/updateProfile';
    const response = await apiClient.post(url, payload);
    return response.data;
  },

  addSkills: async (payload: AddSkillsPayload, userId?: string) => {
    const targetId = getUserId(userId);
    const url = targetId ? `/api/updateskills/${targetId}` : '/api/updateskills';
    const response = await apiClient.post(url, payload);
    return response.data;
  },

  getSecuritySettings: async () => {
    const response = await apiClient.get('/api/settings/security');
    return response.data;
  },

  updateSecuritySettings: async (payload: Partial<SecuritySettings>) => {
    const response = await apiClient.put('/api/settings/security', payload);
    return response.data;
  },

  getNotificationSettings: async () => {
    const response = await apiClient.get('/api/settings/notifications');
    return response.data;
  },

  updateNotificationSettings: async (payload: Partial<NotificationSettings>) => {
    const response = await apiClient.put('/api/settings/notifications', payload);
    return response.data;
  }
};

