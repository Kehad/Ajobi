import { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProfile,
  updateUserProfile,
  addUserSkills,
  clearSettingsMessages,
} from "@/store/slices/settingsSlice";
import {
  UserProfile,
  SkillItem,
  UpdateProfilePayload,
  AddSkillsPayload,
  AddSkillsResponseData,
} from "@/services/settingsService";

export type {
  UserProfile,
  SkillItem,
  UpdateProfilePayload,
  AddSkillsPayload,
  AddSkillsResponseData,
};

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector((state) => state.settings);

  const {
    profile,
    isLoading,
    isUpdatingProfile,
    isAddingSkills,
    error,
    updateError,
    skillsError,
    updateSuccessMessage,
    addSkillsSuccessData,
  } = settingsState;

  // Modal Visibility States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillsModalOpen, setIsAddSkillsModalOpen] = useState(false);

  const getUserId = useCallback((): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || "";
    }
    return "";
  }, []);

  // Initial Fetch on mount
  useEffect(() => {
    const userId = getUserId();
    dispatch(fetchProfile(userId || undefined));
  }, [dispatch, getUserId]);

  const handleRefetchProfile = useCallback(
    async (userId?: string) => {
      const targetUserId = userId || getUserId();
      return await dispatch(fetchProfile(targetUserId || undefined)).unwrap();
    },
    [dispatch, getUserId]
  );

  const handleUpdateProfile = useCallback(
    async (payload: UpdateProfilePayload, userId?: string) => {
      const targetUserId = userId || getUserId();
      const res = await dispatch(
        updateUserProfile({ payload, userId: targetUserId || undefined })
      ).unwrap();
      // Re-fetch profile to reflect updated values
      dispatch(fetchProfile(targetUserId || undefined));
      return res;
    },
    [dispatch, getUserId]
  );

  const handleAddSkills = useCallback(
    async (payload: AddSkillsPayload, userId?: string) => {
      const targetUserId = userId || getUserId();
      const res = await dispatch(
        addUserSkills({ payload, userId: targetUserId || undefined })
      ).unwrap();
      // Re-fetch profile to reflect newly added skills
      dispatch(fetchProfile(targetUserId || undefined));
      return res;
    },
    [dispatch, getUserId]
  );

  const handleClearMessages = useCallback(() => {
    dispatch(clearSettingsMessages());
  }, [dispatch]);

  return {
    // State
    profile,
    isLoading,
    isUpdatingProfile,
    isAddingSkills,
    error,
    updateError,
    skillsError,
    updateSuccessMessage,
    addSkillsSuccessData,

    // Modal States
    isEditModalOpen,
    setIsEditModalOpen,
    isAddSkillsModalOpen,
    setIsAddSkillsModalOpen,

    // Action Methods
    refetchProfile: handleRefetchProfile,
    updateProfile: handleUpdateProfile,
    addSkills: handleAddSkills,
    clearMessages: handleClearMessages,
  };
};

export default useSettings;
