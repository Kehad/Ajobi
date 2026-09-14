"use client";

import { Plus, Zap, RefreshCw, Calendar } from "lucide-react";

interface AutomationRulesProps {
  rules: any[];
  toggleRuleStatus: (id: string) => void;
  onOpenAddRuleModal: () => void;
}

export default function AutomationRules({
  rules,
  toggleRuleStatus,
  onOpenAddRuleModal,
}: AutomationRulesProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Automation Rules</h2>
          <p className="text-sm text-gray-500">Setup rules to automatically save money on schedule or with every transaction.</p>
        </div>

        <button
          onClick={onOpenAddRuleModal}
          className="bg-[#006C49] hover:bg-[#005a3d] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(6,107,68,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-2 self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Automation Rule
        </button>
      </div>

      {/* Info Callout */}
      <div className="bg-ajobi-light border border-[#b2e5d4] rounded-2xl p-5 flex items-start gap-4 text-[#005a3d]">
        <Zap className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm mb-1">How Automation Works</h4>
          <p className="text-xs leading-relaxed opacity-90">
            Automation rules automatically trigger direct debit transfers from your linked bank account straight into your designated savings vault, keeping your financial discipline effortless.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                {rule.name.toLowerCase().includes('round') ? <RefreshCw className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-gray-900 text-lg">{rule.name}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    rule.status === 'active' ? 'bg-ajobi-light text-ajobi-green' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {rule.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Amount: <span className="font-bold text-gray-900">₦{rule.amount.toLocaleString()}</span> • Schedule: {rule.frequency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => toggleRuleStatus(rule.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  rule.status === 'active'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-ajobi-green text-white hover:bg-ajobi-green-dark'
                }`}
              >
                {rule.status === 'active' ? 'Pause Rule' : 'Activate Rule'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
