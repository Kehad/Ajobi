import { apiClient } from './apiClient';

export interface UserProfile {
  full_name: string;
  phone: string;
  email: string;
  photo_url?: string;
}

export interface SecuritySettings {
  biometric_enabled: boolean;
  transaction_pin_set: boolean;
}

export interface NotificationSettings {
  push_notifications: boolean;
  sms_alerts: boolean;
}

export const settingsService = {
  getProfile: async () => {
    // const response = await apiClient.get('/api/settings/profile');
    return {
      success: true,
      data: {
        user_id: "usr_001",
        full_name: "Emeka Obi",
        phone: "08012345678",
        email: "emeka@email.com",
        occupation: "Artisan",
        state: "Lagos",
        lga: "Surulere",
        language: "English",
        profile_photo: "https://storage.url/photo.jpg",
        member_since: "2024-01-15T00:00:00Z",
        ajo_score: 68,
        score_tier: "Silver",
        skills: [
          { skill: "Graphic Design", years_experience: 3 },
          { skill: "Logo Design", years_experience: 3 }
        ],
        availability: "Part time",
        rate: "₦15,000 per project",
        referral_code: "EMEKA-2024",
        referral_count: 2,
        referral_score_bonus: 6,
        notifications: {
          ajo_contributions: true,
          score_changes: true,
          job_matches: true,
          escrow_updates: true,
          loan_reminders: true
        }
      }
    };
  },

  updateProfile: async (payload: Partial<UserProfile>) => {
    // const response = await apiClient.put('/api/settings/profile', payload);
    return { success: true, message: "Profile updated successfully", data: { updated: true } };
  },

  getSecuritySettings: async () => {
    // const response = await apiClient.get('/api/settings/security');
    return { success: true, data: { biometric_enabled: true, transaction_pin_set: true } };
  },

  updateSecuritySettings: async (payload: Partial<SecuritySettings>) => {
    // const response = await apiClient.put('/api/settings/security', payload);
    return { success: true, message: "Security settings updated" };
  },

  getNotificationSettings: async () => {
    // const response = await apiClient.get('/api/settings/notifications');
    return { success: true, data: { push_notifications: true, sms_alerts: true } };
  },

  updateNotificationSettings: async (payload: Partial<NotificationSettings>) => {
    // const response = await apiClient.put('/api/settings/notifications', payload);
    return { success: true, message: "Notification settings updated" };
  }
};
