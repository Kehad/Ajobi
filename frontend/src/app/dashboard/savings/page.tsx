"use client";

import { useState } from "react";
import { useSavings } from "./model/useSavings";
import SavingsSidebar from "./parts/SavingsSidebar";
import SavingsOverview from "./parts/SavingsOverview";
import SavingsGoals from "./parts/SavingsGoals";
import AutomationRules from "./parts/AutomationRules";
import SavingsHistory from "./parts/SavingsHistory";
import AddRuleModal from "./parts/AddRuleModal";
import WithdrawModal from "./parts/WithdrawModal";
import BreakGoalModal from "./parts/BreakGoalModal";

export default function SavingsPage() {
  const {
    overview,
    goals,
    filteredGoals,
    automationRules,
    activities,
    bankList,
    isLoading: loading,
    isBreaking,
    isCreatingRecipient,
    isWithdrawing,
    activeTab,
    setActiveTab,
    searchFilter,
    setSearchFilter,
    frequencyFilter,
    setFrequencyFilter,
    statusFilter,
    setStatusFilter,
    breakGoal,
    fetchBankList,
    createRecipient,
    withdraw,
    fetchGoals
  } = useSavings();

  // Local state for automation rules
  const [rules, setRules] = useState(automationRules);

  // Modals state
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawGoalId, setWithdrawGoalId] = useState("");
  const [withdrawErrorState, setWithdrawErrorState] = useState<string | null>(null);
  const [withdrawSuccessState, setWithdrawSuccessState] = useState<string | null>(null);

  const [showBreakModal, setShowBreakModal] = useState(false);
  const [selectedGoalForBreak, setSelectedGoalForBreak] = useState<any | null>(null);
  const [breakResultState, setBreakResultState] = useState<any | null>(null);
  const [breakErrorState, setBreakErrorState] = useState<string | null>(null);

  const toggleRuleStatus = (ruleId: string) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId
          ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
          : rule
      )
    );
  };

  const handleSaveRule = (newRuleObj: { name: string; amount: number; frequency: string }) => {
    const ruleObj = {
      id: Date.now().toString(),
      name: newRuleObj.name,
      amount: newRuleObj.amount,
      frequency: newRuleObj.frequency,
      status: 'active' as const
    };
    setRules([ruleObj, ...rules]);
  };

  const openWithdrawModal = (goalId?: string) => {
    fetchBankList();
    if (goalId) {
      setWithdrawGoalId(goalId);
    } else if (goals.length > 0) {
      setWithdrawGoalId(goals[0].goal_id || goals[0].id || "");
    }
    setWithdrawErrorState(null);
    setWithdrawSuccessState(null);
    setShowWithdrawModal(true);
  };

  const openBreakModal = (goal: any) => {
    setSelectedGoalForBreak(goal);
    setBreakErrorState(null);
    setBreakResultState(null);
    setShowBreakModal(true);
  };

  const handleExecuteWithdrawal = async (
    goalId: string,
    name: string,
    accountNumber: string,
    bankCode: string
  ) => {
    setWithdrawErrorState(null);
    setWithdrawSuccessState(null);

    try {
      const recipientRes = await createRecipient(goalId, {
        name,
        account_number: accountNumber,
        bank_code: bankCode
      });

      const recipientCode =
        recipientRes.data?.recipient_code ||
        recipientRes.data?.recipient_id ||
        recipientRes.data?.id ||
        (typeof recipientRes.data === 'string' ? recipientRes.data : "RCP_TRANSFER_01");

      const withdrawRes = await withdraw(recipientCode, goalId);

      setWithdrawSuccessState(
        withdrawRes.message || recipientRes.message || "Transfer recipient created & withdrawal has been queued successfully!"
      );
      fetchGoals();
    } catch (err: any) {
      setWithdrawErrorState(err.message || err || "Failed to complete withdrawal request.");
    }
  };

  const handleConfirmBreakGoal = async () => {
    if (!selectedGoalForBreak) return;
    setBreakErrorState(null);
    setBreakResultState(null);

    const goalId = selectedGoalForBreak.goal_id || selectedGoalForBreak.id;
    console.log('goal id, ' ,goalId)

    try {
      const res = await breakGoal(goalId);
      if (res.success || res.status) {
        setBreakResultState({
          message: res.message || "Goal broken successfully",
          released_balance: res.released_balance || selectedGoalForBreak.locked_balance || selectedGoalForBreak.target_amount,
          ajo_penalty: res.ajo_penalty ?? 0.3,
          response: res.response
        });
        fetchGoals();
      } else {
        setBreakErrorState(res.message || "Failed to break goal");
      }
    } catch (err: any) {
      setBreakErrorState(err.message || err || "An error occurred while breaking goal");
    }
  };

  const handleDownloadStatement = () => {
    const csvHeader = "Description,Date,Type,Amount\n";
    const csvRows = activities.map((a) => `"${a.description}","${a.date}","${a.type}","₦${a.amount}"`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ajobi-savings-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12">
      {/* Left Navigation Sidebar */}
      <SavingsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        goalsCount={goals.length}
        activeRulesCount={rules.filter((r) => r.status === 'active').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {activeTab === 'overview' && (
          <SavingsOverview
            overview={overview}
            goals={goals}
            rules={rules}
            activities={activities}
            loading={loading}
            setActiveTab={setActiveTab}
            openWithdrawModal={openWithdrawModal}
            openBreakModal={openBreakModal}
          />
        )}

        {activeTab === 'goals' && (
          <SavingsGoals
            goals={filteredGoals}
            loading={loading}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            frequencyFilter={frequencyFilter}
            setFrequencyFilter={setFrequencyFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            openWithdrawModal={openWithdrawModal}
            openBreakModal={openBreakModal}
          />
        )}

        {activeTab === 'rules' && (
          <AutomationRules
            rules={rules}
            toggleRuleStatus={toggleRuleStatus}
            onOpenAddRuleModal={() => setShowAddRuleModal(true)}
          />
        )}

        {activeTab === 'history' && (
          <SavingsHistory
            activities={activities}
            handleDownloadStatement={handleDownloadStatement}
          />
        )}
      </div>

      {/* Modals */}
      <AddRuleModal
        isOpen={showAddRuleModal}
        onClose={() => setShowAddRuleModal(false)}
        onSaveRule={handleSaveRule}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        goals={goals}
        bankList={bankList}
        selectedGoalId={withdrawGoalId}
        setSelectedGoalId={setWithdrawGoalId}
        isCreatingRecipient={isCreatingRecipient}
        isWithdrawing={isWithdrawing}
        onExecuteWithdrawal={handleExecuteWithdrawal}
        errorState={withdrawErrorState}
        successState={withdrawSuccessState}
      />

      <BreakGoalModal
        isOpen={showBreakModal}
        onClose={() => setShowBreakModal(false)}
        goal={selectedGoalForBreak}
        isBreaking={isBreaking}
        onConfirmBreak={handleConfirmBreakGoal}
        breakResult={breakResultState}
        errorState={breakErrorState}
      />
    </div>
  );
}
