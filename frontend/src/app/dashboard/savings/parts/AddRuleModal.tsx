"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (rule: { name: string; amount: number; frequency: string }) => void;
}

export default function AddRuleModal({ isOpen, onClose, onSaveRule }: AddRuleModalProps) {
  const [newRule, setNewRule] = useState({
    name: "",
    amount: "",
    frequency: "Weekly (Every Monday)",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.amount) return;
    onSaveRule({
      name: newRule.name,
      amount: parseFloat(newRule.amount) || 0,
      frequency: newRule.frequency,
    });
    setNewRule({ name: "", amount: "", frequency: "Weekly (Every Monday)" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-900">Create Automation Rule</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase">Rule Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Stash, Emergency Fund"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase">Amount (₦)</label>
            <input
              type="number"
              required
              placeholder="10000"
              value={newRule.amount}
              onChange={(e) => setNewRule({ ...newRule, amount: e.target.value })}
              className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase">Frequency Schedule</label>
            <select
              value={newRule.frequency}
              onChange={(e) => setNewRule({ ...newRule, frequency: e.target.value })}
              className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
            >
              <option value="Weekly (Every Monday)">Weekly (Every Monday)</option>
              <option value="Monthly (1st of month)">Monthly (1st of month)</option>
              <option value="Monthly (25th Payday)">Monthly (25th Payday)</option>
              <option value="Daily Auto Stash">Daily Auto Stash</option>
              <option value="Per Transaction Roundup">Per Transaction Roundup</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#006C49] hover:bg-[#005a3d] text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
