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
  login: async (credentials: any): Promise<LoginResponse> => {
    // const response = await apiClient.post<LoginResponse>('/api/auth/login', ...);
    const response = {
      success: true,
      data: {
        user_id: "usr_a1b2c3d4",
        full_name: "Emeka Obi",
        token: "eyJhbGciOiJIUzI1NiJ9...",
        email: credentials.email || "emeka@email.com",
        ajo_score: 68,
        score_tier: "Silver",
        onboarding_complete: true
      }
    };

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user_id);
    }
    return response as LoginResponse;
  },

  register: async (data: RegistrationFormValues): Promise<RegisterResponse> => {
    // const response = await apiClient.post<RegisterResponse>('/api/auth/register', payload);
    const response = {
      success: true,
      data: {
        user_id: "usr_a1b2c3d4",
        full_name: "Emeka Obi",
        phone: "08012345678",
        token: "eyJhbGciOiJIUzI1NiJ9...",
        onboarding_complete: false
      }
    };

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response as RegisterResponse;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: UserData }> => {
    // const response = await apiClient.get('/api/auth/me');
    return {
      success: true,
      data: {
        user_id: "usr_a1b2c3d4",
        full_name: "Emeka Obi",
        phone: "08012345678",
        email: "emeka@email.com",
        occupation: "Trader",
        state: "Lagos",
        lga: "Surulere",
        language: "English",
        ajo_score: 68,
        score_tier: "Silver",
        profile_photo: "https://storage.url/photo.jpg",
        onboarding_complete: true,
        member_since: "2024-01-15T00:00:00Z",
        squad_wallet_balance: 45000
      }
    };
  },
  
  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        // await apiClient.post('/api/logout');
      } catch (e) {
        console.error("Logout failed on server", e);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }
};
