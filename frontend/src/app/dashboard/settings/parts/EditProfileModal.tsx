"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, User, Briefcase, MapPin, Globe, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { UserProfile, UpdateProfilePayload } from "../model/useSettings";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSave: (payload: UpdateProfilePayload) => Promise<any>;
  isUpdating: boolean;
  updateError: string | null;
  updateSuccessMessage: string | null;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  isUpdating,
  updateError,
  updateSuccessMessage,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [language, setLanguage] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill form when profile changes or modal opens
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setOccupation(profile.occupation || "");
      setState(profile.state || "");
      setLga(profile.lga || "");
      setLanguage(profile.language || "");
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const payload: UpdateProfilePayload = {};
    if (fullName.trim() && fullName !== profile?.full_name) payload.full_name = fullName.trim();
    if (occupation.trim() && occupation !== profile?.occupation) payload.occupation = occupation.trim();
    if (state.trim() && state !== profile?.state) payload.state = state.trim();
    if (lga.trim() && lga !== profile?.lga) payload.lga = lga.trim();
    if (language.trim() && language !== profile?.language) payload.language = language.trim();

    // If nothing changed, send all non-empty fields or current fields
    if (Object.keys(payload).length === 0) {
      if (fullName) payload.full_name = fullName;
      if (occupation) payload.occupation = occupation;
      if (state) payload.state = state;
      if (lga) payload.lga = lga;
      if (language) payload.language = language;
    }

    try {
      await onSave(payload);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setSubmitError(err || "Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl border border-[#E8EFE8] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EFE8] bg-[#FAFCFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EAF5EF] flex items-center justify-center text-[#066B44]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
                Update Profile
              </h3>
              <p className="text-[12px] text-gray-500 font-medium">
                Modify your personal and location details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(updateError || submitError) && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-700 p-3.5 rounded-xl text-[13px] border border-red-200 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{updateError || submitError}</span>
            </div>
          )}

          {updateSuccessMessage && (
            <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-[13px] border border-emerald-200 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{updateSuccessMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tomiwa Soyombo"
                className="w-full bg-[#F1F6F3] border border-transparent focus:border-[#066B44] rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
              Occupation
            </label>
            <div className="relative">
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Trader, Software Engineer"
                className="w-full bg-[#F1F6F3] border border-transparent focus:border-[#066B44] rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* State & LGA Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Lagos"
                className="w-full bg-[#F1F6F3] border border-transparent focus:border-[#066B44] rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
                LGA (Local Govt)
              </label>
              <input
                type="text"
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                placeholder="e.g. Ikeja"
                className="w-full bg-[#F1F6F3] border border-transparent focus:border-[#066B44] rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
              Preferred Language
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English, Pidgin, Yoruba"
              className="w-full bg-[#F1F6F3] border border-transparent focus:border-[#066B44] rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EFE8] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 bg-[#066B44] hover:bg-[#055737] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] disabled:opacity-50"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
