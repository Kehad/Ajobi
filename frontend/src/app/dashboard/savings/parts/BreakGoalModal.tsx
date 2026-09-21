"use client";

import { Flame, X, AlertCircle, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface BreakGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: any | null;
  isBreaking: boolean;
  onConfirmBreak: () => Promise<void>;
  breakResult: any | null;
  errorState: string | null;
}

export default function BreakGoalModal({
  isOpen,
  onClose,
  goal,
  isBreaking,
  onConfirmBreak,
  breakResult,
  errorState,
}: BreakGoalModalProps) {
  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Break Savings Goal</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorState && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorState}</span>
          </div>
        )}

        {breakResult ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{breakResult.message}</h4>

            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Released Balance:</span>
                <span className="font-bold text-gray-900">₦{Number(breakResult.released_balance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">AjoScore Penalty:</span>
                <span className="font-bold text-red-600">-{breakResult.ajo_penalty} pts</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#006C49] text-white rounded-xl font-bold text-sm hover:bg-[#005a3d] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm mb-1">Early Withdrawal Warning</p>
                Breaking <span className="font-bold">{goal.name || goal.title}</span> early will release your locked funds but will apply an AjoScore penalty of <span className="font-bold text-red-600">-0.3 points</span>.
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Goal Name:</span>
                <span className="font-bold text-gray-900">{goal.name || goal.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Locked Balance:</span>
                <span className="font-bold text-emerald-700">₦{(goal.locked_balance ?? goal.target_amount ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmBreak}
                disabled={isBreaking}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isBreaking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Breaking...
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    Confirm Break
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
