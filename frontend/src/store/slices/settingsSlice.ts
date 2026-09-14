import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  settingsService,
  UserProfile,
  SecuritySettings,
  NotificationSettings,
  UpdateProfilePayload,
  AddSkillsPayload,
  AddSkillsResponseData
} from '@/services/settingsService';

interface SettingsState {
  profile: UserProfile | null;
  security: SecuritySettings | null;
  notifications: NotificationSettings | null;
  isLoading: boolean;
  isUpdatingProfile: boolean;
  isAddingSkills: boolean;
  error: string | null;
  updateError: string | null;
  skillsError: string | null;
  updateSuccessMessage: string | null;
  addSkillsSuccessData: AddSkillsResponseData | null;
}

const initialState: SettingsState = {
  profile: null,
  security: null,
  notifications: null,
  isLoading: false,
  isUpdatingProfile: false,
  isAddingSkills: false,
  error: null,
  updateError: null,
  skillsError: null,
  updateSuccessMessage: null,
  addSkillsSuccessData: null,
};

export const fetchProfile = createAsyncThunk(
  'settings/fetchProfile',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await settingsService.getProfile(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return response.data || null;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'settings/updateUserProfile',
  async (
    { payload, userId }: { payload: UpdateProfilePayload; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await settingsService.updateProfile(payload, userId);
      if (response.success) {
        return response.message || 'Profile Updated';
      }
      return rejectWithValue(response.message || 'Failed to update profile');
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to update profile');
    }
  }
);

export const addUserSkills = createAsyncThunk(
  'settings/addUserSkills',
  async (
    { payload, userId }: { payload: AddSkillsPayload; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await settingsService.addSkills(payload, userId);
      if (response.success) {
        return response.data as AddSkillsResponseData;
      }
      return rejectWithValue(response.message || 'Failed to add skills');
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to add skills');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsMessages: (state) => {
      state.updateError = null;
      state.skillsError = null;
      state.updateSuccessMessage = null;
      state.addSkillsSuccessData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile | null>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.updateError = null;
        state.updateSuccessMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<string>) => {
        state.isUpdatingProfile = false;
        state.updateSuccessMessage = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.updateError = action.payload as string;
      })
      // Add Skills
      .addCase(addUserSkills.pending, (state) => {
        state.isAddingSkills = true;
        state.skillsError = null;
        state.addSkillsSuccessData = null;
      })
      .addCase(addUserSkills.fulfilled, (state, action: PayloadAction<AddSkillsResponseData>) => {
        state.isAddingSkills = false;
        state.addSkillsSuccessData = action.payload;
      })
      .addCase(addUserSkills.rejected, (state, action) => {
        state.isAddingSkills = false;
        state.skillsError = action.payload as string;
      });
  },
});

export const { clearSettingsMessages } = settingsSlice.actions;
export default settingsSlice.reducer;

