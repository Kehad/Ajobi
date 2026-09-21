"use client";

import { ShieldCheck } from "lucide-react";
import useSettings from "./model/useSettings";
import ProfileInformation from "./parts/ProfileInformation";
import SkillsSection from "./parts/SkillsSection";
import EditProfileModal from "./parts/EditProfileModal";
import AddSkillsModal from "./parts/AddSkillsModal";
import SecuritySection from "./parts/SecuritySection";
import NotificationSection from "./parts/NotificationSection";
import RegionalSection from "./parts/RegionalSection";

export default function SettingsPage() {
  const {
    profile,
    isLoading,
    isUpdatingProfile,
    isAddingSkills,
    updateError,
    skillsError,
    updateSuccessMessage,
    addSkillsSuccessData,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddSkillsModalOpen,
    setIsAddSkillsModalOpen,
    updateProfile,
    addSkills,
    clearMessages,
  } = useSettings();

  const handleOpenEditModal = () => {
    clearMessages();
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    clearMessages();
  };

  const handleOpenAddSkillsModal = () => {
    clearMessages();
    setIsAddSkillsModalOpen(true);
  };

  const handleCloseAddSkillsModal = () => {
    setIsAddSkillsModalOpen(false);
    clearMessages();
  };

  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#066B44] mb-2 tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-[14px] text-gray-600 font-medium">
          Manage your digital identity, profile details, skills, and account preferences.
        </p>
      </div>

      {/* Profile Information Section */}
      <ProfileInformation
        profile={profile}
        isLoading={isLoading}
        onEditClick={handleOpenEditModal}
      />

      {/* Skills Section */}
      <SkillsSection
        skills={profile?.skills}
        onAddSkillsClick={handleOpenAddSkillsModal}
      />

      {/* Security & Access Section */}
      <SecuritySection />

      {/* Notification Preferences Section */}
      <NotificationSection />

      {/* Regional & Language Settings Section */}
      <RegionalSection
        language={profile?.language}
        onEditClick={handleOpenEditModal}
      />

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        profile={profile}
        onSave={updateProfile}
        isUpdating={isUpdatingProfile}
        updateError={updateError}
        updateSuccessMessage={updateSuccessMessage}
      />

      <AddSkillsModal
        isOpen={isAddSkillsModalOpen}
        onClose={handleCloseAddSkillsModal}
        onSave={addSkills}
        isAdding={isAddingSkills}
        skillsError={skillsError}
        addSkillsSuccessData={addSkillsSuccessData}
      />

      {/* Footer Note */}
      <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 opacity-90 pb-6">
        <ShieldCheck className="w-[14px] h-[14px] text-[#066B44]" />
        <p className="text-[12px] font-medium tracking-wide">
          Your profile data is encrypted and secure with AjoBI bank-grade security.
        </p>
      </div>
    </div>
  );
}
