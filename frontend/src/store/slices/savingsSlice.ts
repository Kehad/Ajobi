import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  savingsService, 
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
  AutomationRule, 
  SavingsActivity 
} from '@/services/savingsService';

interface SavingsState {
  balance: number;
  balanceDiff: number;
  overview: any | null;
  goals: SavingsGoal[];
  currentGoalDetail: SavingsGoalDetailData | null;
  bankList: BankItem[];
  automationRules: AutomationRule[];
  activities: SavingsActivity[];
  isLoading: boolean;
  isCreating: boolean;
  isSettingUpDebit: boolean;
  isBreaking: boolean;
  isCreatingRecipient: boolean;
  isWithdrawing: boolean;
  error: string | null;
  createError: string | null;
  setupDebitError: string | null;
  breakError: string | null;
  recipientError: string | null;
  withdrawError: string | null;
  lastCreatedGoal: CreateSavingsGoalResponse | null;
  setupDebitResult: SetupDebitResponse | null;
  breakGoalResult: BreakGoalResponse | null;
  recipientResult: SavingsRecipientResponse | null;
  withdrawResult: WithdrawalResponse | null;
}

const initialState: SavingsState = {
  balance: 0,
  balanceDiff: 0,
  overview: null,
  goals: [],
  currentGoalDetail: null,
  bankList: [],
  automationRules: [
    { id: '1', name: 'Weekly Stash', amount: 5000, frequency: 'Weekly (Every Monday)', status: 'active' },
    { id: '2', name: 'Spare Change Roundup', amount: 100, frequency: 'Per Transaction', status: 'active' },
    { id: '3', name: 'Payday Auto-Save', amount: 25000, frequency: 'Monthly (25th)', status: 'active' }
  ],
  activities: [
    { id: '1', description: 'Interest Earned', date: 'Oct 30, 2026', amount: 14200.50, type: 'interest' },
    { id: '2', description: 'Deposit: Weekly Stash', date: 'Oct 27, 2026', amount: 5000.00, type: 'deposit' },
    { id: '3', description: 'Deposit: New Laptop Savings', date: 'Oct 25, 2026', amount: 50000.00, type: 'deposit' },
    { id: '4', description: 'Bonus Interest', date: 'Oct 20, 2026', amount: 2500.00, type: 'interest' },
    { id: '5', description: 'Deposit: Emergency Stash', date: 'Oct 15, 2026', amount: 15000.00, type: 'deposit' }
  ],
  isLoading: false,
  isCreating: false,
  isSettingUpDebit: false,
  isBreaking: false,
  isCreatingRecipient: false,
  isWithdrawing: false,
  error: null,
  createError: null,
  setupDebitError: null,
  breakError: null,
  recipientError: null,
  withdrawError: null,
  lastCreatedGoal: null,
  setupDebitResult: null,
  breakGoalResult: null,
  recipientResult: null,
  withdrawResult: null,
};

// export const fetchSavingsOverview = createAsyncThunk(
//   'savings/fetchOverview',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await savingsService.getOverview();
//       if (response.success || response.status) {
//         return response.data || response;
//       }
//       return null;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error?.message || error.message);
//     }
//   }
// );

export const fetchSavingsGoals = createAsyncThunk(
  'savings/fetchGoals',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await savingsService.getGoals(userId);
      if (response.success || response.status) {
        const rawData = response.data ?? response.goals;
        if (Array.isArray(rawData)) {
          return rawData;
        } else if (rawData && typeof rawData === 'object') {
          return [rawData];
        }
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchSavingsGoalDetail = createAsyncThunk(
  'savings/fetchGoalDetail',
  async ({ goalId, userId }: { goalId: string; userId?: string }, { rejectWithValue }) => {
    try {
      const response = await savingsService.getGoalDetail(goalId, userId);
      if (response.success || response.status) {
        return {
          goal: response.goal || response.data?.goal || response.data,
          progress_percentage: response.progress_percentage ?? response.data?.progress_percentage ?? 0,
          instalments: response.instalments || response.data?.instalments || [],
        };
      }
      return rejectWithValue(response.message || 'Failed to fetch savings goal detail');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const createSavingsGoal = createAsyncThunk(
  'savings/createGoal',
  async ({ payload, userId }: { payload: CreateSavingsGoalPayload; userId?: string }, { rejectWithValue }) => {
    try {
      const response = await savingsService.createGoal(payload, userId);
      if (response.success || response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to create savings goal');
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.data.message || error.response?.data?.error?.message || error.message );
    }
  }
);

export const setupSavingsDebit = createAsyncThunk(
  'savings/setupDebit',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await savingsService.setupDebit(userId);
      if (response.success || response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to setup debit mandate');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const breakSavingsGoal = createAsyncThunk(
  'savings/breakGoal',
  async ({ goalId, userId }: { goalId: string; userId?: string }, { rejectWithValue }) => {
    try {
      const response = await savingsService.breakGoal(goalId, userId);
      if (response.success || response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to break savings goal');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchBankList = createAsyncThunk(
  'savings/fetchBankList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await savingsService.getBankList();
      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.banks && Array.isArray(response.banks)) {
        return response.banks;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const createSavingsRecipient = createAsyncThunk(
  'savings/createRecipient',
  async ({ goalId, payload, userId }: { goalId: string; payload: SavingsRecipientPayload; userId?: string }, { rejectWithValue }) => {
    try {
      const response = await savingsService.createSavingsRecipient(goalId, payload, userId);
      if (response.status === 'true' || response.status === true || response.success) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to create savings recipient');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const withdrawSavings = createAsyncThunk(
  'savings/withdraw',
  async ({ recipientId, goalId }: { recipientId: string; goalId: string }, { rejectWithValue }) => {
    try {
      const response = await savingsService.savingsWithdrawal(recipientId, goalId);
      if (response.status === true || response.status === 'true' || response.success) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to initiate withdrawal');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    clearSavingsErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.setupDebitError = null;
      state.breakError = null;
      state.recipientError = null;
      state.withdrawError = null;
    },
    resetSavingsActionResult: (state) => {
      state.lastCreatedGoal = null;
      state.setupDebitResult = null;
      state.breakGoalResult = null;
      state.recipientResult = null;
      state.withdrawResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Overview
      // .addCase(fetchSavingsOverview.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(fetchSavingsOverview.fulfilled, (state, action: PayloadAction<any>) => {
      //   state.isLoading = false;
      //   state.overview = action.payload;
      //   if (action.payload) {
      //     state.balance = action.payload.balance ?? action.payload.total_saved ?? state.balance;
      //     state.balanceDiff = action.payload.balance_diff ?? state.balanceDiff;
      //   }
      // })
      // .addCase(fetchSavingsOverview.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      // })

      // Goals List
      .addCase(fetchSavingsGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavingsGoals.fulfilled, (state, action: PayloadAction<SavingsGoal[]>) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(fetchSavingsGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Goal Detail
      .addCase(fetchSavingsGoalDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavingsGoalDetail.fulfilled, (state, action: PayloadAction<SavingsGoalDetailData>) => {
        state.isLoading = false;
        state.currentGoalDetail = action.payload;
      })
      .addCase(fetchSavingsGoalDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Goal
      .addCase(createSavingsGoal.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createSavingsGoal.fulfilled, (state, action: PayloadAction<CreateSavingsGoalResponse>) => {
        state.isCreating = false;
        state.lastCreatedGoal = action.payload;
      })
      .addCase(createSavingsGoal.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Setup Debit
      .addCase(setupSavingsDebit.pending, (state) => {
        state.isSettingUpDebit = true;
        state.setupDebitError = null;
      })
      .addCase(setupSavingsDebit.fulfilled, (state, action: PayloadAction<SetupDebitResponse>) => {
        state.isSettingUpDebit = false;
        state.setupDebitResult = action.payload;
      })
      .addCase(setupSavingsDebit.rejected, (state, action) => {
        state.isSettingUpDebit = false;
        state.setupDebitError = action.payload as string;
      })

      // Break Goal
      .addCase(breakSavingsGoal.pending, (state) => {
        state.isBreaking = true;
        state.breakError = null;
      })
      .addCase(breakSavingsGoal.fulfilled, (state, action: PayloadAction<BreakGoalResponse>) => {
        state.isBreaking = false;
        state.breakGoalResult = action.payload;
      })
      .addCase(breakSavingsGoal.rejected, (state, action) => {
        state.isBreaking = false;
        state.breakError = action.payload as string;
      })

      // Bank List
      .addCase(fetchBankList.fulfilled, (state, action: PayloadAction<BankItem[]>) => {
        state.bankList = action.payload;
      })

      // Create Recipient
      .addCase(createSavingsRecipient.pending, (state) => {
        state.isCreatingRecipient = true;
        state.recipientError = null;
      })
      .addCase(createSavingsRecipient.fulfilled, (state, action: PayloadAction<SavingsRecipientResponse>) => {
        state.isCreatingRecipient = false;
        state.recipientResult = action.payload;
      })
      .addCase(createSavingsRecipient.rejected, (state, action) => {
        state.isCreatingRecipient = false;
        state.recipientError = action.payload as string;
      })

      // Withdraw
      .addCase(withdrawSavings.pending, (state) => {
        state.isWithdrawing = true;
        state.withdrawError = null;
      })
      .addCase(withdrawSavings.fulfilled, (state, action: PayloadAction<WithdrawalResponse>) => {
        state.isWithdrawing = false;
        state.withdrawResult = action.payload;
      })
      .addCase(withdrawSavings.rejected, (state, action) => {
        state.isWithdrawing = false;
        state.withdrawError = action.payload as string;
      });
  },
});

export const { clearSavingsErrors, resetSavingsActionResult } = savingsSlice.actions;

export default savingsSlice.reducer;

