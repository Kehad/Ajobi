"use client";

import Link from "next/link";
import { Plus, RefreshCcw, ArrowUpRight, Loader2, Store, Calendar, TrendingUp, Banknote } from "lucide-react";

interface SavingsOverviewProps {
  overview: any;
  goals: any[];
  rules: any[];
  activities: any[];
  loading: boolean;
  setActiveTab: (tab: any) => void;
  openWithdrawModal: (goalId?: string) => void;
  openBreakModal: (goal: any) => void;
}

export default function SavingsOverview({
  overview,
  goals,
  rules,
  activities,
  loading,
  setActiveTab,
  openWithdrawModal,
  openBreakModal,
}: SavingsOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Total Savings Balance Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Savings Balance</p>
          <div className="flex items-end gap-3 mb-2">
            <h2 className="text-4xl md:text-5xl font-bold text-[#006C49] tracking-tight">
              {loading ? (
                <span className="flex items-center gap-2 py-1">
                  <Loader2 className="w-8 h-8 text-[#006C49] animate-spin" />
                </span>
              ) : (
                `₦${(overview?.total_saved || 0).toLocaleString()}`
              )}
            </h2>
          </div>
          <p className="text-sm font-medium text-[#006C49] flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> {loading ? "Loading growth..." : `+${overview?.percentage_growth || 8.4}% this month`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/savings/create"
            className="bg-[#006C49] hover:bg-[#005a3d] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_4px_14px_rgba(6,107,68,0.2)] hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Save Now
          </Link>
          <button
            onClick={() => openWithdrawModal()}
            className="bg-ajobi-light hover:bg-[#d1eee3] text-[#006C49] px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Withdraw / Transfer
          </button>
        </div>
      </div>

      {/* Savings Goals Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Savings Goals</h3>
          <button
            onClick={() => setActiveTab('goals')}
            className="text-[#006C49] font-medium text-sm flex items-center gap-1 hover:underline"
          >
            View All ({goals.length}) <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm gap-2">
              <Loader2 className="w-7 h-7 text-ajobi-green animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading savings goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-8 bg-white rounded-2xl border border-gray-100 border-dashed">
              No savings goals yet. <Link href="/dashboard/savings/create" className="text-ajobi-green underline font-medium">Create one now.</Link>
            </div>
          ) : (
            goals.slice(0, 4).map((goal: any) => {
              const goalId = goal.goal_id || goal.id;
              const locked = goal.locked_balance ?? goal.current_amount ?? 0;
              const target = goal.target_amount || 1;
              const progress = target > 0 ? (locked / target) * 100 : 0;

              return (
                <div
                  key={goalId}
                  className="bg-white hover:border-ajobi-green hover:shadow-md transition-all rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <Link href={`/dashboard/savings/${goalId}`} className="w-10 h-10 rounded-xl bg-ajobi-light flex items-center justify-center text-ajobi-green hover:opacity-80 transition-opacity">
                        <Store className="w-5 h-5" />
                      </Link>
                      <span className="bg-ajobi-light text-ajobi-green px-3 py-1 rounded-full text-xs font-bold">
                        {progress.toFixed(0)}% Achieved
                      </span>
                    </div>
                    <Link href={`/dashboard/savings/${goalId}`} className="block group">
                      <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-ajobi-green transition-colors">{goal.name || goal.title}</h4>
                      <p className="text-sm text-gray-500 mb-4">Target: ₦{(target || 0).toLocaleString()}</p>
                    </Link>

                    <div className="space-y-2 mb-6">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-ajobi-green rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">₦{(locked || 0).toLocaleString()}</span>
                        <span className="text-gray-500">₦{Math.max(0, target - locked).toLocaleString()} left</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions: Break Goal & Withdraw */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openBreakModal(goal)}
                      className="flex-1 py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      Break Goal
                    </button>
                    <button
                      onClick={() => openWithdrawModal(goalId)}
                      className="flex-1 py-2 px-3 bg-ajobi-light text-[#006C49] hover:bg-[#d1eee3] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Automation Rules Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Automation Rules</h3>
          <button
            onClick={() => setActiveTab('rules')}
            className="text-[#006C49] font-medium text-sm flex items-center gap-1 hover:underline"
          >
            Manage Rules <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {rules.slice(0, 2).map((rule) => (
            <div key={rule.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{rule.name}</h4>
                  <p className="text-sm text-gray-500">₦{rule.amount.toLocaleString()} • {rule.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  rule.status === 'active' ? 'bg-ajobi-light text-ajobi-green' : 'bg-gray-100 text-gray-500'
                }`}>
                  {rule.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Activity Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-ajobi-green font-medium text-sm hover:underline flex items-center gap-1"
          >
            View Full History <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Description</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 text-right border-b border-gray-100">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.slice(0, 4).map((act) => (
                <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {act.type === 'interest' ? (
                        <TrendingUp className="w-4 h-4 text-ajobi-green" />
                      ) : (
                        <Banknote className="w-4 h-4 text-ajobi-green" />
                      )}
                      <span className="font-medium text-gray-900">{act.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{act.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#006C49] text-right">+₦{act.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
