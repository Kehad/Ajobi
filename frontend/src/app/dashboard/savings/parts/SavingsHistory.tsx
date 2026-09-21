"use client";

import { useState } from "react";
import { Download, Search, TrendingUp, Banknote } from "lucide-react";

interface SavingsHistoryProps {
  activities: any[];
  handleDownloadStatement: () => void;
}

export default function SavingsHistory({
  activities,
  handleDownloadStatement,
}: SavingsHistoryProps) {
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<'all' | 'deposit' | 'interest'>('all');
  const [historySearch, setHistorySearch] = useState("");

  const filteredHistory = activities.filter((act) => {
    if (historyCategoryFilter !== 'all' && act.type !== historyCategoryFilter) return false;
    if (historySearch) {
      const q = historySearch.toLowerCase();
      return act.description.toLowerCase().includes(q) || act.date.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Savings History</h2>
          <p className="text-sm text-gray-500">Complete log of all deposits, interest credits, and transfers.</p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="bg-ajobi-light hover:bg-[#d1eee3] text-[#006C49] px-5 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 self-start md:self-auto text-sm"
        >
          <Download className="w-4 h-4" />
          Download Statement
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setHistoryCategoryFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              historyCategoryFilter === 'all' ? 'bg-[#006C49] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setHistoryCategoryFilter('deposit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              historyCategoryFilter === 'deposit' ? 'bg-[#006C49] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setHistoryCategoryFilter('interest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              historyCategoryFilter === 'interest' ? 'bg-[#006C49] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Interest
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter history..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Type</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Description</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 text-right border-b border-gray-100">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No history found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        act.type === 'interest' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {act.type === 'interest' ? <TrendingUp className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                        {act.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{act.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{act.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#006C49] text-right">+₦{act.amount.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
