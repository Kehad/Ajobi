"use client";

import Link from "next/link";
import { Plus, Search, Filter, Loader2, Target, Store, Flame, Banknote } from "lucide-react";

interface SavingsGoalsProps {
  goals: any[];
  loading: boolean;
  searchFilter: string;
  setSearchFilter: (v: string) => void;
  frequencyFilter: string;
  setFrequencyFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  openWithdrawModal: (goalId?: string) => void;
  openBreakModal: (goal: any) => void;
}

export default function SavingsGoals({
  goals,
  loading,
  searchFilter,
  setSearchFilter,
  frequencyFilter,
  setFrequencyFilter,
  statusFilter,
  setStatusFilter,
  openWithdrawModal,
  openBreakModal,
}: SavingsGoalsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Savings Goals</h2>
          <p className="text-sm text-gray-500">Track and manage your individual targeted savings goals.</p>
        </div>

        <Link
          href="/dashboard/savings/create"
          className="bg-[#006C49] hover:bg-[#005a3d] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(6,107,68,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-2 self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Goal
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals by name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Frequency:</span>
          </div>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
          >
            <option value="Any">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
          >
            <option value="Any">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_debit_setup">Pending Debit</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
            <Loader2 className="w-9 h-9 text-ajobi-green animate-spin" />
            <p className="text-sm font-medium text-gray-500">Loading your savings goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed space-y-3">
            <Target className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-gray-500 font-medium">No savings goals found matching your filters.</p>
            <Link href="/dashboard/savings/create" className="inline-block bg-ajobi-light text-ajobi-green px-4 py-2 rounded-xl text-sm font-bold">
              Create a Goal
            </Link>
          </div>
        ) : (
          goals.map((goal: any) => {
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
                    <div className="flex items-center gap-2">
                      <span className="bg-ajobi-light text-ajobi-green px-3 py-1 rounded-full text-xs font-bold capitalize">
                        {goal.status || 'Active'}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Link href={`/dashboard/savings/${goalId}`} className="block group">
                    <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-ajobi-green transition-colors">{goal.name || goal.title}</h4>
                    <p className="text-sm text-gray-500 mb-4">Target: ₦{(target || 0).toLocaleString()} • <span className="capitalize">{goal.frequency}</span></p>
                  </Link>

                  <div className="space-y-2 mb-6">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-ajobi-green rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-gray-900">Saved: ₦{(locked || 0).toLocaleString()}</span>
                      <span className="text-gray-500">₦{Math.max(0, target - locked).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openBreakModal(goal)}
                    className="flex-1 py-2.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-4 h-4" />
                    Break Goal
                  </button>
                  <button
                    onClick={() => openWithdrawModal(goalId)}
                    className="flex-1 py-2.5 px-3 bg-ajobi-light text-[#006C49] hover:bg-[#d1eee3] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Banknote className="w-4 h-4" />
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
