"use client";

import { Languages } from "lucide-react";

interface RegionalSectionProps {
  language?: string;
  onEditClick: () => void;
}

export default function RegionalSection({
  language = "English",
  onEditClick,
}: RegionalSectionProps) {
  return (
    <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8] mb-8">
      <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-4 mb-6">
        <Languages className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Regional & Language Settings
        </h2>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl">
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">
            Preferred Language
          </label>
          <p className="text-[14px] font-bold text-gray-900">
            {language}
          </p>
        </div>
        <button
          onClick={onEditClick}
          className="text-[13px] font-bold text-[#066B44] hover:underline px-3 py-1 bg-[#EAF5EF] rounded-xl transition-all"
        >
          Change Language
        </button>
      </div>
    </div>
  );
}
