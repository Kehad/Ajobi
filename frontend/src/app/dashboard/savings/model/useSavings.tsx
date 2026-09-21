import { useState, useMemo, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
//   fetchSavingsOverview,
  fetchSavingsGoals,
  fetchSavingsGoalDetail,
  createSavingsGoal,
  setupSavingsDebit,
  breakSavingsGoal,
  fetchBankList,
  createSavingsRecipient,
  withdrawSavings,
  clearSavingsErrors,
  resetSavingsActionResult,
} from "@/store/slices/savingsSlice";
import {
  SavingsGoal,
  SavingsGoalDetailData,
  CreateSavingsGoalPayload,
  CreateSavingsGoalResponse,
  SetupDebitResponse,
  BreakGoalResponse,
  BankItem,
  SavingsRecipientPayload,
  SavingsRecipientResponse,
  WithdrawalResponse,
  savingsService,
} from "@/services/savingsService";

export type {
  SavingsGoal,
  SavingsGoalDetailData,
  CreateSavingsGoalPayload,
  CreateSavingsGoalResponse,
  SetupDebitResponse,
  BreakGoalResponse,
  BankItem,
  SavingsRecipientPayload,
  SavingsRecipientResponse,
  WithdrawalResponse,
};

export const useSavings = () => {
  const dispatch = useAppDispatch();
  const savingsState = useAppSelector((state) => state.savings);

  const {
    balance,
    balanceDiff,
    overview,
    goals,
    currentGoalDetail,
    bankList,
    automationRules,
    activities,
    isLoading,
    isCreating,
    isSettingUpDebit,
    isBreaking,
    isCreatingRecipient,
    isWithdrawing,
    error,
    createError,
    setupDebitError,
    breakError,
    recipientError,
    withdrawError,
    lastCreatedGoal,
    setupDebitResult,
    breakGoalResult,
    recipientResult,
    withdrawResult,
  } = savingsState;

  // Local UI & Search States
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'history' | 'rules'>('overview');
  const [searchFilter, setSearchFilter] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("Any");
  const [statusFilter, setStatusFilter] = useState<string>("Any");

  // Get logged in userId from localStorage if available
  const getUserId = useCallback((): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || "";
    }
    return "";
  }, []);

  // Initial Fetch: Load savings overview, user's goals, and bank list
  useEffect(() => {
    const userId = getUserId();
    // dispatch(fetchSavingsOverview());
    dispatch(fetchSavingsGoals(userId || undefined));
    dispatch(fetchBankList());
  }, [dispatch, getUserId]);

  // Action Handlers
  const handleFetchMyGoals = useCallback(
    async (userId?: string) => {
      const targetUserId = userId || getUserId();
      return await dispatch(fetchSavingsGoals(targetUserId || undefined)).unwrap();
    },
    [dispatch, getUserId]
  );

  const handleFetchGoalDetail = useCallback(
    async (goalId: string, userId?: string) => {
      const targetUserId = userId || getUserId();
      return await dispatch(fetchSavingsGoalDetail({ goalId, userId: targetUserId || undefined })).unwrap();
    },
    [dispatch, getUserId]
  );

  const handleCreateSavingsGoal = useCallback(
    async (payload: CreateSavingsGoalPayload, userId?: string): Promise<CreateSavingsGoalResponse> => {
      const targetUserId = userId || getUserId();
      const result = await dispatch(
        createSavingsGoal({ payload, userId: targetUserId || undefined })
      ).unwrap();
      // Refresh goals list after creating a goal
      dispatch(fetchSavingsGoals(targetUserId || undefined));
      return result;
    },
    [dispatch, getUserId]
  );

  const handleSetupDebit = useCallback(
    async (userId?: string): Promise<SetupDebitResponse> => {
      const targetUserId = userId || getUserId();
      return await dispatch(setupSavingsDebit(targetUserId || undefined)).unwrap();
    },
    [dispatch, getUserId]
  );

  const handleBreakGoal = useCallback(
    async (goalId: string, userId?: string): Promise<BreakGoalResponse> => {
      const targetUserId = userId || getUserId();
      const result = await dispatch(
        breakSavingsGoal({ goalId, userId: targetUserId || undefined })
      ).unwrap();
      // Refresh goals list after breaking a goal
      dispatch(fetchSavingsGoals(targetUserId || undefined));
      return result;
    },
    [dispatch, getUserId]
  );

  const handleFetchBankList = useCallback(async (): Promise<BankItem[]> => {
    return await dispatch(fetchBankList()).unwrap();
  }, [dispatch]);

  const handleCreateRecipient = useCallback(
    async (
      goalId: string,
      payload: SavingsRecipientPayload,
      userId?: string
    ): Promise<SavingsRecipientResponse> => {
      const targetUserId = userId || getUserId();
      return await dispatch(
        createSavingsRecipient({ goalId, payload, userId: targetUserId || undefined })
      ).unwrap();
    },
    [dispatch, getUserId]
  );

  const handleWithdraw = useCallback(
    async (recipientId: string, goalId: string): Promise<WithdrawalResponse> => {
      const result = await dispatch(withdrawSavings({ recipientId, goalId })).unwrap();
      // Refresh goals list after initiating withdrawal
      dispatch(fetchSavingsGoals(getUserId() || undefined));
      return result;
    },
    [dispatch, getUserId]
  );

  const handleClearErrors = useCallback(() => {
    dispatch(clearSavingsErrors());
  }, [dispatch]);

  const handleResetActionResults = useCallback(() => {
    dispatch(resetSavingsActionResult());
  }, [dispatch]);

  // Client-side Filtered Goals logic
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        const goalName = (goal.name || goal.title || "").toLowerCase();
        if (!goalName.includes(lower)) return false;
      }
      if (frequencyFilter !== "Any") {
        if (goal.frequency?.toLowerCase() !== frequencyFilter.toLowerCase()) return false;
      }
      if (statusFilter !== "Any") {
        if (goal.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [goals, searchFilter, frequencyFilter, statusFilter]);

  return {
    // State
    balance,
    balanceDiff,
    overview,
    goals,
    filteredGoals,
    currentGoalDetail,
    bankList,
    automationRules,
    activities,
    isLoading,
    isCreating,
    isSettingUpDebit,
    isBreaking,
    isCreatingRecipient,
    isWithdrawing,
    error,
    createError,
    setupDebitError,
    breakError,
    recipientError,
    withdrawError,
    lastCreatedGoal,
    setupDebitResult,
    breakGoalResult,
    recipientResult,
    withdrawResult,

    // Filter Controls
    activeTab,
    setActiveTab,
    searchFilter,
    setSearchFilter,
    frequencyFilter,
    setFrequencyFilter,
    statusFilter,
    setStatusFilter,

    // Actions / Fetching logic methods
    fetchGoals: handleFetchMyGoals,
    fetchGoalDetail: handleFetchGoalDetail,
    createGoal: handleCreateSavingsGoal,
    setupDebit: handleSetupDebit,
    breakGoal: handleBreakGoal,
    fetchBankList: handleFetchBankList,
    createRecipient: handleCreateRecipient,
    withdraw: handleWithdraw,
    clearErrors: handleClearErrors,
    resetActionResults: handleResetActionResults,
  };
};

export default useSavings;
