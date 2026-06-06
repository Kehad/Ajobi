import { apiClient } from './apiClient';
import { LoginFormValues } from '@/models/auth/useLoginForm';
import { RegistrationFormValues } from '@/models/auth/useRegistrationForm';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string;
  };
  token?: string;
}

export interface UserData {
  user_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  occupation?: string;
  state?: string;
  lga?: string;
  language?: string;
  token?: string;
  ajo_score?: number;
  score_tier?: string;
  profile_photo?: string;
  onboarding_complete: boolean;
  member_since?: string;
  squad_wallet_balance?: number;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user_id: string;
    full_name: string;
    token: string;
    email: string;
    ajo_score: number;
    score_tier: string;
    onboarding_complete: boolean | string;
  };
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user_id: string;
    full_name: string;
    phone: string;
    token: string;
    onboarding_complete: boolean | string;
  };
}

export const authService = {
  /**
   * Submits user credentials to authenticate and retrieves a Bearer token.
   */
  login: async (credentials: any): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email: credentials.email, 
      password: credentials.password
    });
    console.log(response.data);

    if (response.data?.success && response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user_id);
    }

    return response.data;
  },

  /**
   * Registers a new user account and retrieves a Bearer token.
   */
  register: async (data: RegistrationFormValues): Promise<RegisterResponse> => {
    const payload: any = {
      full_name: data.fullName,
      phone: data.phoneNumber,
      password: data.password,
      email: data.email,
    };

    const response = await apiClient.post<RegisterResponse>('/api/auth/register', payload);

    if (response.data?.success && response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }

    return response.data;
  },

  /**
   * Retrieves the current authenticated user profile.
   */
  getCurrentUser: async (): Promise<{ success: boolean; data: UserData }> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
  
  /**
   * Cleans up local session data and terminates the backend session.
   */
  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        await apiClient.post('/api/logout');
      } catch (e) {
        console.error("Logout failed on server", e);
      }
      localStorage.removeItem('token');
    }
  }
};
