import { apiClient } from './apiClient';

export interface ProfileData {
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
  skills?: Array<{ skill: string; years_experience: number }>;
  availability?: string;
  rate?: string;
  referral_code?: string;
  referral_count?: number;
  referral_score_bonus?: number;
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
}

export interface UpdateProfilePayload {
  full_name?: string;
  occupation?: string;
  state?: string;
  lga?: string;
  language?: string;
}

export interface SkillItem {
  skill: string;
  years_experience: number;
}

export const profileService = {
  getProfileDetails: async (userId?: string): Promise<ProfileResponse> => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/profile/${id}` : '/api/profile/me';
    const response = await apiClient.get<ProfileResponse>(url);
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload, userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/updateProfile/${id}` : '/api/updateProfile';
    const response = await apiClient.post(url, payload);
    return response.data;
  },

  addSkills: async (skills: SkillItem[], userId?: string) => {
    const id = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    const url = id ? `/api/updateskills/${id}` : '/api/updateskills';
    const response = await apiClient.post(url, { skills });
    return response.data;
  }
};
