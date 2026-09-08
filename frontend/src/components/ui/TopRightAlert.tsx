"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export interface TopRightAlertProps {
  title: string;
  description: string;
  variant?: "default" | "destructive" | "success";
  durationMs?: number; // defaults to 10000ms (10 seconds)
  onClose?: () => void;
}

export default function TopRightAlert({
  title,
  description,
  variant = "success",
  durationMs = 10000,
  onClose,
}: TopRightAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] max-w-md w-full sm:w-[420px] animate-in slide-in-from-top-5 fade-in duration-300 shadow-2xl">
      <Alert
        variant={variant === "success" ? "default" : variant}
        className={`relative p-5 rounded-2xl shadow-2xl flex items-start gap-3.5 pr-10 border-2 ${
          variant === "destructive"
            ? "bg-red-50 border-red-200 text-red-900"
            : "bg-[#F1F6F3] border-[#066B44]/20 text-gray-900"
        }`}
      >
        {variant === "destructive" ? (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#066B44] shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <AlertTitle className="text-[14px] font-black tracking-tight leading-tight mb-1 text-gray-900">
            {title}
          </AlertTitle>
          <AlertDescription className="text-[12px] font-semibold text-gray-600 leading-relaxed">
            {description}
          </AlertDescription>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-black/5"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </Alert>
    </div>
  );
}
