"use client";

import { UserPlus, Power, Wallet, RefreshCw, ChevronRight, Loader2 } from "lucide-react";

interface CreatorControlsProps {
  onActivateGroup?: () => void;
  onOpenWithdrawal?: () => void;
  isActivating?: boolean;
}

export default function CreatorControls({ onActivateGroup, onOpenWithdrawal, isActivating }: CreatorControlsProps) {
  const actions = [
    { 
      label: "Activate Group", 
      subtitle: "Commence rotation & active status", 
      icon: Power, 
      color: "text-[#066B44] bg-[#F1F6F3]",
      onClick: onActivateGroup,
      loading: isActivating
    },
    { 
      label: "Withdraw Payout", 
      subtitle: "Queue group transfer recipient", 
      icon: Wallet, 
      color: "text-purple-600 bg-purple-50",
      onClick: onOpenWithdrawal
    },
    { 
      label: "Invite Member", 
      subtitle: "Share invite code with new members", 
      icon: UserPlus, 
      color: "text-emerald-600 bg-emerald-50" 
    },
    { 
      label: "Edit Rotation", 
      subtitle: "Swap member positions", 
      icon: RefreshCw, 
      color: "text-blue-500 bg-blue-50" 
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border-2 border-dashed border-[#E8EFE8] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
      <h3 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
        🛠️ Creator Controls
      </h3>

      <div className="space-y-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button 
              key={i}
              onClick={act.onClick}
              disabled={act.loading}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#F1F6F3] hover:border-[#066B44]/20 bg-white hover:bg-[#F9FCF9] transition-all text-left group cursor-pointer disabled:opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                  {act.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-gray-800 group-hover:text-[#066B44] transition-colors">{act.label}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{act.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 group-hover:text-[#066B44] transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
