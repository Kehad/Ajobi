"use client";

import Image from "next/image";
import { 
  User, 
  Camera, 
  Edit3, 
  Award, 
  Share2, 
  MapPin, 
  Briefcase, 
  Calendar,
  Globe
} from "lucide-react";
import { UserProfile } from "../model/useSettings";

interface ProfileInformationProps {
  profile: UserProfile | null;
  isLoading: boolean;
  onEditClick: () => void;
}

export default function ProfileInformation({
  profile,
  isLoading,
  onEditClick,
}: ProfileInformationProps) {
  if (isLoading && !profile) {
    return (
      <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-10 border border-[#E8EFE8] flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3 text-[#066B44] font-medium">
          <div className="w-5 h-5 border-2 border-[#066B44] border-t-transparent rounded-full animate-spin" />
          <span>Loading profile details...</span>
        </div>
      </div>
    );
  }

  const defaultPhoto = "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=256&auto=format&fit=crop";

  return (
    <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8] mb-8">
      {/* Header & Edit Button */}
      <div className="flex items-center justify-between border-b border-[#DCE8E0] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Profile Information
          </h2>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 bg-[#066B44]/10 hover:bg-[#066B44]/20 text-[#066B44] px-4 py-2 rounded-xl text-[13px] font-bold transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Avatar & Score Badge Card */}
        <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">
          <div className="relative w-[110px] h-[110px]">
            <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-[3px] border-[#066B44] shadow-sm relative bg-[#E8EFE8]">
              <Image 
                src={profile?.profile_photo || defaultPhoto} 
                alt={profile?.full_name || "User Photo"} 
                fill 
                className="object-cover" 
                unoptimized
              />
            </div>
            <button className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-[#066B44] rounded-full flex items-center justify-center border-2 border-[#FAFCFB] text-white shadow-sm hover:scale-105 transition-transform">
              <Camera className="w-[14px] h-[14px]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Ajo Score Tier */}
          {profile?.ajo_score !== undefined && (
            <div className="mt-4 flex items-center gap-2 bg-[#EAF5EF] border border-[#C6E4D3] px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-[#066B44]" />
              <span className="text-[12px] font-bold text-[#066B44]">
                Ajo Score: {profile.ajo_score}
              </span>
              {profile.score_tier && (
                <span className="bg-[#066B44] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                  {profile.score_tier}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Profile Details Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {/* Full Name */}
          <div className="bg-[#F1F6F3] p-4 rounded-2xl">
            <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">
              Full Name
            </p>
            <p className="text-[14px] font-bold text-gray-900">
              {profile?.full_name || "N/A"}
            </p>
          </div>

          {/* Email Address */}
          <div className="bg-[#F1F6F3] p-4 rounded-2xl">
            <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">
              Email Address
            </p>
            <p className="text-[14px] font-bold text-gray-900 truncate">
              {profile?.email || "N/A"}
            </p>
          </div>

          {/* Phone Number */}
          <div className="bg-[#F1F6F3] p-4 rounded-2xl">
            <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">
              Phone Number
            </p>
            <p className="text-[14px] font-bold text-gray-900">
              {profile?.phone || "N/A"}
            </p>
          </div>

          {/* Occupation */}
          <div className="bg-[#F1F6F3] p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Occupation
              </p>
            </div>
            <p className="text-[14px] font-bold text-gray-900">
              {profile?.occupation || "Not Specified"}
            </p>
          </div>

          {/* Location (State & LGA) */}
          <div className="bg-[#F1F6F3] p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Location
              </p>
            </div>
            <p className="text-[14px] font-bold text-gray-900">
              {profile?.state || profile?.lga
                ? `${profile?.lga ? profile.lga + ", " : ""}${profile?.state || ""}`
                : "Not Specified"}
            </p>
          </div>

          {/* Language */}
          <div className="bg-[#F1F6F3] p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <Globe className="w-3.5 h-3.5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Language
              </p>
            </div>
            <p className="text-[14px] font-bold text-gray-900">
              {profile?.language || "English"}
            </p>
          </div>

          {/* Member Since */}
          {profile?.member_since && (
            <div className="bg-[#F1F6F3] p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  Member Since
                </p>
              </div>
              <p className="text-[14px] font-bold text-gray-900">
                {new Date(profile.member_since).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Referral Stats */}
          {profile?.referral_code && (
            <div className="bg-[#F1F6F3] p-4 rounded-2xl sm:col-span-2">
              <div className="flex items-center gap-1.5 text-[#066B44] mb-1">
                <Share2 className="w-3.5 h-3.5" />
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  Referral Info
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap mt-1">
                <div>
                  <span className="text-[12px] text-gray-500">Code: </span>
                  <span className="text-[14px] font-extrabold text-[#066B44] bg-white px-2 py-0.5 rounded border border-[#C6E4D3] font-mono">
                    {profile.referral_code}
                  </span>
                </div>
                <div className="text-[12px] text-gray-700 font-medium">
                  Count: <span className="font-bold text-gray-900">{profile.referral_count ?? 0}</span>
                </div>
                <div className="text-[12px] text-gray-700 font-medium">
                  Bonus Score: <span className="font-bold text-[#066B44]">+{profile.referral_score_bonus ?? 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
