"use client";

import { useState, FormEvent } from "react";
import { X, Sparkles, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SkillItem, AddSkillsPayload, AddSkillsResponseData } from "../model/useSettings";

interface AddSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: AddSkillsPayload) => Promise<any>;
  isAdding: boolean;
  skillsError: string | null;
  addSkillsSuccessData: AddSkillsResponseData | null;
}

export default function AddSkillsModal({
  isOpen,
  onClose,
  onSave,
  isAdding,
  skillsError,
  addSkillsSuccessData,
}: AddSkillsModalProps) {
  const [skillItems, setSkillItems] = useState<SkillItem[]>([
    { skill: "", years_experience: 1 },
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setSkillItems([...skillItems, { skill: "", years_experience: 1 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (skillItems.length === 1) return;
    setSkillItems(skillItems.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index: number, value: string) => {
    const updated = [...skillItems];
    updated[index].skill = value;
    setSkillItems(updated);
  };

  const handleExperienceChange = (index: number, value: number) => {
    const updated = [...skillItems];
    updated[index].years_experience = Math.max(0, value);
    setSkillItems(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate skills
    const validSkills = skillItems.filter((s) => s.skill.trim() !== "");
    if (validSkills.length === 0) {
      setValidationError("Please enter at least one skill name.");
      return;
    }

    try {
      await onSave({ skills: validSkills });
      setTimeout(() => {
        // Reset form & close
        setSkillItems([{ skill: "", years_experience: 1 }]);
        onClose();
      }, 1000);
    } catch (err: any) {
      // Error handled by Redux / local state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl border border-[#E8EFE8] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EFE8] bg-[#FAFCFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EAF5EF] flex items-center justify-center text-[#066B44]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
                Add Skills
              </h3>
              <p className="text-[12px] text-gray-500 font-medium">
                Add your professional skills and experience level
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {(skillsError || validationError) && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-700 p-3.5 rounded-xl text-[13px] border border-red-200 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{skillsError || validationError}</span>
            </div>
          )}

          {addSkillsSuccessData && (
            <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-[13px] border border-emerald-200 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Added {addSkillsSuccessData.skills_added} skills! Total skills now: {addSkillsSuccessData.total_skills}.
              </span>
            </div>
          )}

          {/* Dynamic Skill List */}
          <div className="space-y-3">
            {skillItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-[#F1F6F3] p-3 rounded-2xl border border-[#DCE8E0]">
                {/* Skill Name */}
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                    Skill #{index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="e.g. Web Design"
                    className="w-full bg-white border border-gray-200 focus:border-[#066B44] rounded-xl px-3 py-2 text-[13px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
                  />
                </div>

                {/* Years Experience */}
                <div className="w-[110px]">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                    Years Exp.
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={item.years_experience}
                    onChange={(e) => handleExperienceChange(index, parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 focus:border-[#066B44] rounded-xl px-3 py-2 text-[13px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all text-center"
                  />
                </div>

                {/* Remove Row Button */}
                {skillItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="mt-5 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Another Skill Button */}
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-2 text-[13px] font-bold text-[#066B44] hover:underline pt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add another skill</span>
          </button>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EFE8] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="flex items-center gap-2 bg-[#066B44] hover:bg-[#055737] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] disabled:opacity-50"
            >
              {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isAdding ? "Saving..." : "Submit Skills"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
