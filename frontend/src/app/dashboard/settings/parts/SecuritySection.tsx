"use client";

import { ShieldCheck, KeyRound, Fingerprint } from "lucide-react";
import { useState } from "react";

export default function SecuritySection() {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8] mb-8">
      <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-4 mb-6">
        <ShieldCheck className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Security & Access
        </h2>
      </div>

      <div className="space-y-4">
        {/* Transaction PIN */}
        <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl border border-transparent hover:border-[#DCE8E0] transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-[#066B44]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">
                Transaction PIN
              </p>
              <p className="text-[12px] text-gray-500">
                Used for verifying all transfers & withdrawals
              </p>
            </div>
          </div>
          <button className="text-[13px] font-bold text-[#066B44] hover:underline px-3 py-1 bg-[#EAF5EF] rounded-xl transition-all">
            Change PIN
          </button>
        </div>

        {/* Biometric Login */}
        <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl border border-transparent hover:border-[#DCE8E0] transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-[#066B44]">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">
                Biometric Login
              </p>
              <p className="text-[12px] text-gray-500">
                Unlock app using Face ID or Fingerprint
              </p>
            </div>
          </div>
          <button
            onClick={() => setBiometricsEnabled(!biometricsEnabled)}
            className={`w-[48px] h-[26px] rounded-full relative cursor-pointer shadow-inner focus:outline-none transition-all ${
              biometricsEnabled ? "bg-[#066B44]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all ${
                biometricsEnabled ? "left-[25px]" : "left-[3px]"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
