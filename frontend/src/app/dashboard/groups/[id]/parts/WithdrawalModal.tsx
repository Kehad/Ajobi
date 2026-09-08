"use client";

import { useState, useEffect } from "react";
import { X, Building2, Wallet, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { groupsService } from "@/services/groupsService";
import TopRightAlert from "@/components/ui/TopRightAlert";

interface Bank {
  name: string;
  code: string;
}

interface WithdrawalModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WithdrawalModal({ groupId, isOpen, onClose, onSuccess }: WithdrawalModalProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [recipientId, setRecipientId] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [alertState, setAlertState] = useState<{ title: string; description: string; variant?: "success" | "destructive" } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchBanks = async () => {
        setIsLoadingBanks(true);
        try {
          const resp = await groupsService.getBankList();
          if (resp.data && Array.isArray(resp.data)) {
            setBanks(resp.data.map((b: any) => ({ name: b.name || b.bank_name, code: b.code || b.bank_code })));
          } else if (Array.isArray(resp)) {
            setBanks(resp.map((b: any) => ({ name: b.name || b.bank_name, code: b.code || b.bank_code })));
          } else {
            // Fallback default list if mock or empty
            setBanks([
              { name: "Access Bank", code: "044" },
              { name: "Guaranty Trust Bank (GTB)", code: "058" },
              { name: "First Bank of Nigeria", code: "011" },
              { name: "Zenith Bank", code: "057" },
              { name: "Kuda Bank", code: "50211" },
              { name: "OPay", code: "999992" },
              { name: "Palmpay", code: "999991" },
              { name: "United Bank for Africa (UBA)", code: "033" }
            ]);
          }
        } catch {
          setBanks([
            { name: "Access Bank", code: "044" },
            { name: "Guaranty Trust Bank (GTB)", code: "058" },
            { name: "First Bank of Nigeria", code: "011" },
            { name: "Zenith Bank", code: "057" },
            { name: "Kuda Bank", code: "50211" },
            { name: "United Bank for Africa (UBA)", code: "033" }
          ]);
        } finally {
          setIsLoadingBanks(false);
        }
      };
      fetchBanks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountName || !selectedBankCode) {
      setAlertState({
        title: "Missing Details",
        description: "Please fill in all bank details before generating receipt ID.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setAlertState(null);
    try {
      const resp = await groupsService.generateReceiptId(groupId, {
        name: accountName,
        account_number: accountNumber,
        bank_code: selectedBankCode
      });

      console.log("Generate receipt response:", resp);
      const recId = resp.recipient_ID || resp.recipient_id || resp.data?.recipient_code;
      if ((resp.status === true || resp.success === true || recId) && recId) {
        setRecipientId(recId);
        setStep("confirm");
        setAlertState({
          title: "Recipient ID Generated!",
          description: "Transfer recipient created successfully. Please confirm to initiate withdrawal.",
          variant: "success"
        });
      } else {
        setAlertState({
          title: "Failed to Create Recipient",
          description: resp.message || "Could not generate receipt ID. Please check bank details.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      setAlertState({
        title: "Error Generating Receipt",
        description: err.message || "An unexpected error occurred while generating receipt ID.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (!recipientId) return;

    setIsWithdrawing(true);
    setAlertState(null);
    try {
      const resp = await groupsService.groupWithdrawal(recipientId, groupId);
      console.log("Group withdrawal response:", resp);

      if (resp.status === true || resp.success === true || resp.message?.toLowerCase().includes("queued")) {
        setAlertState({
          title: "Withdrawal Queued!",
          description: resp.message || "Transfer has been queued successfully. Funds will be sent to your account shortly.",
          variant: "success"
        });
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 3000);
      } else {
        setAlertState({
          title: "Withdrawal Failed",
          description: resp.message || "Could not complete withdrawal queue. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      setAlertState({
        title: "Withdrawal Error",
        description: err.message || "An unexpected error occurred during withdrawal processing.",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {alertState && (
        <TopRightAlert
          title={alertState.title}
          description={alertState.description}
          variant={alertState.variant}
          durationMs={10000}
          onClose={() => setAlertState(null)}
        />
      )}

      <div className="bg-white w-full max-w-lg rounded-[28px] border border-[#E8EFE8] shadow-2xl overflow-hidden p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#F1F6F3] text-[#066B44] rounded-2xl flex items-center justify-center shrink-0 border border-[#DCE8E0]">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[18px] font-black text-gray-900 leading-tight">Group Payout Withdrawal</h3>
            <p className="text-[12px] text-gray-500 font-bold">Transfer group funds directly to your bank account</p>
          </div>
        </div>

        {step === "form" ? (
          <form onSubmit={handleGenerateReceipt} className="space-y-5">
            {/* Select Bank */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                Select Destination Bank
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  disabled={isLoadingBanks}
                  className="w-full bg-[#FAFCFB] border border-[#E8EFE8] rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold text-gray-800 outline-none focus:border-[#066B44] transition-all appearance-none"
                  required
                >
                  <option value="">{isLoadingBanks ? "Loading banks..." : "-- Select Bank --"}</option>
                  {banks.map((b, idx) => (
                    <option key={idx} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. 0123456789"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-[#FAFCFB] border border-[#E8EFE8] rounded-xl px-4 py-3 text-[13px] font-bold text-gray-800 outline-none focus:border-[#066B44] transition-all"
                required
              />
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                Account Holder Name
              </label>
              <input
                type="text"
                placeholder="e.g. James Okon"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full bg-[#FAFCFB] border border-[#E8EFE8] rounded-xl px-4 py-3 text-[13px] font-bold text-gray-800 outline-none focus:border-[#066B44] transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-6 bg-[#066B44] hover:bg-[#055737] text-white py-3.5 rounded-xl text-[14px] font-extrabold shadow-md shadow-[#066B44]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Receipt...
                </>
              ) : (
                <>
                  Proceed to Confirmation <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#F8FBF8] border border-[#E8EFE8] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#066B44] font-extrabold text-[13px]">
                <CheckCircle2 className="w-4 h-4" /> Recipient ID Ready
              </div>
              <div className="text-[12px] space-y-1 text-gray-600 font-medium">
                <p><span className="font-bold text-gray-800">Account Name:</span> {accountName}</p>
                <p><span className="font-bold text-gray-800">Account Number:</span> {accountNumber}</p>
                <p><span className="font-bold text-gray-800">Recipient Code:</span> {recipientId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={isWithdrawing}
                className="w-1/3 py-3 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={isWithdrawing}
                className="w-2/3 bg-[#066B44] hover:bg-[#055737] text-white py-3.5 rounded-xl text-[14px] font-extrabold shadow-md shadow-[#066B44]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Queueing Transfer...
                  </>
                ) : (
                  <>
                    Confirm & Withdraw Payout
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
