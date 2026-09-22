"use client";

import { Sparkles, Plus, Award } from "lucide-react";
import { SkillItem } from "../model/useSettings";

interface SkillsSectionProps {
  skills?: SkillItem[];
  onAddSkillsClick: () => void;
}

export default function SkillsSection({
  skills = [],
  onAddSkillsClick,
}: SkillsSectionProps) {
  return (
    <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8] mb-8">
      <div className="flex items-center justify-between border-b border-[#DCE8E0] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Skills & Experience
          </h2>
        </div>
        <button
          onClick={onAddSkillsClick}
          className="flex items-center gap-2 bg-[#066B44] hover:bg-[#055737] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.15)] hover:shadow-[0_6px_20px_rgba(6,107,68,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skills</span>
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 bg-[#F1F6F3] rounded-2xl border border-dashed border-[#DCE8E0]">
          <Award className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-[14px] font-bold text-gray-700">No skills added yet</p>
          <p className="text-[12px] text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Showcase your skills and years of experience to boost your credibility on AjoBI.
          </p>
          <button
            onClick={onAddSkillsClick}
            className="inline-flex items-center gap-2 bg-[#066B44] text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-[#055737] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Skill</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl border border-transparent hover:border-[#C6E4D3] transition-colors"
            >
              <div>
                <p className="text-[14px] font-bold text-gray-900 mb-0.5">
                  {item.skill}
                </p>
                <p className="text-[12px] font-medium text-[#066B44]">
                  {item.years_experience} {item.years_experience === 1 ? 'year' : 'years'} experience
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EAF5EF] flex items-center justify-center text-[#066B44] shrink-0 font-bold text-[12px]">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
