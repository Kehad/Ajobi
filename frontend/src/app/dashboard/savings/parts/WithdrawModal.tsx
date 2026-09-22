"use client";

import { useState } from "react";
import { Banknote, X, AlertCircle, CheckCircle2, Loader2, CreditCard } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: any[];
  bankList: any[];
  selectedGoalId: string;
  setSelectedGoalId: (id: string) => void;
  isCreatingRecipient: boolean;
  isWithdrawing: boolean;
  onExecuteWithdrawal: (goalId: string, name: string, accountNumber: string, bankCode: string) => Promise<void>;
  errorState: string | null;
  successState: string | null;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  goals,
  bankList,
  selectedGoalId,
  setSelectedGoalId,
  isCreatingRecipient,
  isWithdrawing,
  onExecuteWithdrawal,
  errorState,
  successState,
}: WithdrawModalProps) {
  const [recipientForm, setRecipientForm] = useState({
    name: "",
    account_number: "",
    bank_code: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetGoalId = selectedGoalId || (goals.length > 0 ? (goals[0].goal_id || goals[0].id) : "");
    onExecuteWithdrawal(targetGoalId, recipientForm.name, recipientForm.account_number, recipientForm.bank_code);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ajobi-light text-ajobi-green flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Withdraw / Transfer</h3>
              <p className="text-xs text-gray-500">Create recipient & queue withdrawal to your bank</p>
            </div>
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

        {successState ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Transfer Queued!</h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">{successState}</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#006C49] text-white rounded-xl font-bold text-sm hover:bg-[#005a3d] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Select Savings Goal</label>
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
              >
                {goals.map((g: any) => {
                  const gId = g.goal_id || g.id;
                  const bal = g.locked_balance ?? g.current_amount ?? 0;
                  return (
                    <option key={gId} value={gId}>
                      {g.name || g.title} (Available: ₦{bal.toLocaleString()})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Account Holder Name</label>
              <input
                type="text"
                required
                placeholder="e.g. James Oluwaseun"
                value={recipientForm.name}
                onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
              />
            </div>

            {/* Account Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Account Number (10 digits)</label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="2902839380"
                value={recipientForm.account_number}
                onChange={(e) => setRecipientForm({ ...recipientForm, account_number: e.target.value })}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green font-mono"
              />
            </div>

            {/* Bank Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Select Bank</label>
              <select
                required
                value={recipientForm.bank_code}
                onChange={(e) => setRecipientForm({ ...recipientForm, bank_code: e.target.value })}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ajobi-green"
              >
                <option value="">-- Choose Bank --</option>
                {bankList.length > 0 ? (
                  bankList.map((b: any, idx: number) => {
                    const code = b.code || b.bank_code || b.id;
                    return (
                      <option key={idx} value={code}>
                        {b.name} ({code})
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="011">First Bank of Nigeria (011)</option>
                    <option value="058">GTBank (058)</option>
                    <option value="044">Access Bank (044)</option>
                    <option value="033">United Bank for Africa (033)</option>
                    <option value="057">Zenith Bank (057)</option>
                    <option value="999992">OPay (999992)</option>
                    <option value="50211">Kuda Bank (50211)</option>
                  </>
                )}
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
                disabled={isCreatingRecipient || isWithdrawing}
                className="flex-1 py-3 bg-[#006C49] hover:bg-[#005a3d] text-white rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreatingRecipient || isWithdrawing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4" />
                    Withdraw Funds
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
