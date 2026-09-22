"use client";

import { LayoutDashboard, Target, Settings, History, Zap } from "lucide-react";

interface SavingsSidebarProps {
  activeTab: 'overview' | 'goals' | 'history' | 'rules';
  setActiveTab: (tab: 'overview' | 'goals' | 'history' | 'rules') => void;
  goalsCount: number;
  activeRulesCount: number;
}

export default function SavingsSidebar({
  activeTab,
  setActiveTab,
  goalsCount,
  activeRulesCount,
}: SavingsSidebarProps) {
  return (
    <div className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-ajobi-green">Savings hub</h2>
        </div>
        <div className="p-3 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-ajobi-green text-white shadow-sm font-bold'
                : 'text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </div>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
              activeTab === 'goals'
                ? 'bg-ajobi-green text-white shadow-sm font-bold'
                : 'text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green'
            }`}
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5" />
              Savings Goals
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'goals'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {goalsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
              activeTab === 'rules'
                ? 'bg-ajobi-green text-white shadow-sm font-bold'
                : 'text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              Automation Rules
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'rules'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {activeRulesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
              activeTab === 'history'
                ? 'bg-ajobi-green text-white shadow-sm font-bold'
                : 'text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5" />
              History
            </div>
          </button>
        </div>
      </div>

      {/* Daily Tip Card */}
      <div className="bg-[#006C49] rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-ajobi-light text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-300" /> Daily Tip
          </p>
          <p className="font-medium text-sm leading-relaxed">
            Automate your savings with weekly rules to reach your target goals 3x faster without breaking a sweat!
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white opacity-10 rotate-45 transform"></div>
      </div>
    </div>
  );
}
