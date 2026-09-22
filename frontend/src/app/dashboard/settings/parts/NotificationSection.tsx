"use client";

import { Bell, Check } from "lucide-react";
import { useState } from "react";

export default function NotificationSection() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  return (
    <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8] mb-8">
      <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-4 mb-6">
        <Bell className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Notification Preferences
        </h2>
      </div>

      <div className="space-y-4">
        {/* Push Notifications */}
        <div
          onClick={() => setPushEnabled(!pushEnabled)}
          className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl cursor-pointer hover:border-[#DCE8E0] border border-transparent transition-all"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                pushEnabled ? "bg-[#066B44] text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {pushEnabled && <Check className="w-4 h-4" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">
                Push Notifications
              </p>
              <p className="text-[12px] text-gray-500">
                Account alerts, contribution cycle reminders, and payment updates
              </p>
            </div>
          </div>
          <span className="text-[12px] font-semibold text-gray-500">
            {pushEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* SMS Alerts */}
        <div
          onClick={() => setSmsEnabled(!smsEnabled)}
          className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl cursor-pointer hover:border-[#DCE8E0] border border-transparent transition-all"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                smsEnabled ? "bg-[#066B44] text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {smsEnabled && <Check className="w-4 h-4" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">
                SMS Alerts
              </p>
              <p className="text-[12px] text-gray-500">
                Security notifications, OTPs, and urgent account alerts
              </p>
            </div>
          </div>
          <span className="text-[12px] font-semibold text-gray-500">
            {smsEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}
