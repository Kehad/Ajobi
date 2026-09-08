"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, ShieldCheck, X, Trash2, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface FinalStepProps {
  formData: any;
  updateForm: (key: string, value: any) => void;
  submitStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function FinalStep({ formData, updateForm, submitStep, prevStep, isSubmitting, error }: FinalStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (formData.profilePhoto instanceof File) {
      const url = URL.createObjectURL(formData.profilePhoto);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof formData.profilePhoto === 'string' && formData.profilePhoto) {
      setPreviewUrl(formData.profilePhoto);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.profilePhoto]);

  const validateAndSetFile = (file: File) => {
    setLocalError(null);

    const isImage = file.type.startsWith("image/") || /\.(jpeg|png|jpg|webp|gif|heic|heif)$/i.test(file.name);

    if (!isImage) {
      setLocalError("Please upload a valid image file (JPEG, PNG, WebP, or JPG).");
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      setLocalError("File size exceeds 5MB limit. Please select a smaller photo.");
      return;
    }

    updateForm("profilePhoto", file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
    e.target.value = "";
  };

  const handleRemovePhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateForm("profilePhoto", null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const displayError = localError || error;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Final Touches</h2>
        <p className="text-sm text-gray-500 mt-2">Personalize your experience to get started.</p>
      </div>

      <div className="space-y-8 mb-8">
        {/* Language Selection */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">Preferred language</label>
          <div className="grid grid-cols-2 gap-3">
            {["English", "Pidgin", "Yoruba", "Hausa", "Igbo"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateForm("language", option)}
                className={`text-center px-4 py-3.5 rounded-xl border text-[13px] font-medium transition-all ${
                  formData.language === option 
                    ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                    : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">Profile photo upload (optional)</label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <div className="border border-green-200 bg-[#EEF8F3]/60 rounded-2xl p-4 flex items-center justify-between transition-all">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-ajobi-green shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {formData.profilePhoto instanceof File ? formData.profilePhoto.name : "Uploaded Photo"}
                    </p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-ajobi-green shrink-0" />
                  </div>
                  {formData.profilePhoto instanceof File && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {formatFileSize(formData.profilePhoto.size)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-ajobi-green hover:bg-white px-3 py-1.5 rounded-lg border border-ajobi-green/30 transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                isDragging
                  ? 'border-ajobi-green bg-green-50/60 scale-[1.01]'
                  : 'border-gray-300 hover:border-ajobi-green/60 hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-ajobi-green" />
              </div>
              <p className="text-sm font-medium text-gray-700">Tap or drag to upload your photo</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">JPG, PNG UP TO 5MB</p>
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button 
          type="button"
          onClick={prevStep}
          className="text-sm font-bold text-ajobi-green hover:underline px-4 py-2"
        >
          Back
        </button>
        <button 
          type="button"
          onClick={submitStep}
          disabled={!formData.language || isSubmitting}
          className="w-full sm:w-[60%] flex justify-center items-center bg-ajobi-green hover:bg-ajobi-green-dark text-white px-4 py-3.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating...
            </>
          ) : (
            "Confirm and Generate My AjoScore"
          )}
        </button>
      </div>
    </div>
  );
}

