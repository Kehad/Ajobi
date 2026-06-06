import { apiClient } from './apiClient';

export interface ScoreBreakdownItem {
  score: number;
  weight: number;
  label: string;
  explanation: string;
}

export interface LockedFeature {
  feature: string;
  required_score: number;
  current_score: number;
  unlocked: boolean;
  points_needed?: number;
}

export interface AjoScoreData {
  score: number;
  tier: string | { name: string; color: string; next: string; points_to_next: number };
  tier_color: string;
  next_tier: string;
  points_to_next_tier: number;
  breakdown: {
    savings_consistency: ScoreBreakdownItem;
    repayment_behaviour: ScoreBreakdownItem;
    escrow_completion: ScoreBreakdownItem;
    transaction_history: ScoreBreakdownItem;
    account_maturity: ScoreBreakdownItem;
    community_standing: ScoreBreakdownItem;
  };
  unlocked_features: string[];
  locked_features: LockedFeature[];
  improvement_tips: string[];
}

export interface ScoreHistoryItem {
  date: string;
  score: number;
}

export interface ScoreEvent {
  event_id: string;
  event_type: string;
  points: number;
  direction: 'up' | 'down';
  reason: string;
  created_at: string;
}

export interface EligibilityData {
  loan_eligible: boolean;
  loan_conditions: {
    score_met: { required: number; current: number; passed: boolean };
    tenure_met: { required_days: number; current_days: number; passed: boolean; days_remaining: number };
    ajo_member: { passed: boolean };
    consistency_met: { required_percent: number; current_percent: number; passed: boolean };
    no_disputes: { passed: boolean };
    no_default: { passed: boolean };
  };
  loan_eligibility_message: string;
  group_tiers_available: string[];
  escrow_eligible: boolean;
  instalment_eligible: boolean;
  insurance_eligible: boolean;
}

export const scoreService = {
  getAjoScore: async (userId: string) =>  {
    // const response = await apiClient.get(`/api/score/${userId}`);
    return {
      success: true,
      data: {
        score: 68,
        tier: "Silver",
        tier_color: "#C0C0C0",
        next_tier: "Gold",
        points_to_next_tier: 8,
        breakdown: {
          savings_consistency: {
            score: 82,
            weight: 0.25,
            label: "Savings Consistency",
            explanation: "You have contributed on time in 9 of 11 cycles"
          },
          repayment_behaviour: {
            score: 50,
            weight: 0.25,
            label: "Repayment Behaviour",
            explanation: "No loan history yet. Take and repay a loan to improve this."
          },
          escrow_completion: {
            score: 90,
            weight: 0.20,
            label: "Escrow Completion",
            explanation: "All your escrows completed without dispute"
          },
          transaction_history: {
            score: 45,
            weight: 0.15,
            label: "Transaction History",
            explanation: "Transact more through AjoBI to improve this component"
          },
          account_maturity: {
            score: 60,
            weight: 0.10,
            label: "Account Maturity",
            explanation: "Account is 3 months old. Score grows with time."
          },
          community_standing: {
            score: 70,
            weight: 0.05,
            label: "Community Standing",
            explanation: "2 successful referrals. No disputes raised against you."
          }
        },
        unlocked_features: [
          "ajo_groups_bronze",
          "marketplace_browse",
          "escrow_basic",
          "instalment_escrow"
        ],
        locked_features: [
          {
            feature: "loans",
            required_score: 61,
            current_score: 68,
            unlocked: true
          },
          {
            feature: "premium_groups",
            required_score: 76,
            current_score: 68,
            unlocked: false,
            points_needed: 8
          }
        ],
        improvement_tips: [
          "Your repayment behaviour has the most room to grow. Apply for a small loan and repay on time.",
          "Increase your transaction history by making more purchases through the marketplace."
        ]
      }
    };
  },

  getScoreHistory: async (userId: string, days: 30 | 60 | 90 = 30) => {
    // const response = await apiClient.get(`/api/score/${userId}/history`, { params: { days } });
    return {
      success: true,
      data: {
        period_days: 30,
        history: [
          { date: "2024-05-01", score: 55 },
          { date: "2024-05-08", score: 57 },
          { date: "2024-05-15", score: 62 },
          { date: "2024-05-22", score: 65 },
          { date: "2024-05-29", score: 68 }
        ]
      }
    };
  },

  getScoreEvents: async (userId: string, limit: number = 20, offset: number = 0) => {
    // const response = await apiClient.get(`/api/score/${userId}/events`, { params: { limit, offset } });
    return {
      success: true,
      data: {
        events: [
          {
            event_id: "evt_001",
            event_type: "contribution_on_time",
            points: 2,
            direction: "up",
            reason: "On-time contribution to Sunshine Group",
            created_at: "2024-05-29T10:00:00Z"
          },
          {
            event_id: "evt_002",
            event_type: "escrow_completed",
            points: 5,
            direction: "up",
            reason: "Escrow completed without dispute — Logo Design Job",
            created_at: "2024-05-25T14:30:00Z"
          },
          {
            event_id: "evt_003",
            event_type: "contribution_missed",
            points: -5,
            direction: "down",
            reason: "Missed contribution — Market Women Group",
            created_at: "2024-05-20T09:00:00Z"
          }
        ],
        total: 45,
        limit: 20,
        offset: 0
      }
    };
  },

  getEligibility: async (userId: string) => {
    // const response = await apiClient.get(`/api/score/${userId}/eligibility`);
    return {
      success: true,
      data: {
        loan_eligible: false,
        loan_conditions: {
          score_met: { required: 61, current: 68, passed: true },
          tenure_met: { required_days: 60, current_days: 34, passed: false, days_remaining: 26 },
          ajo_member: { passed: true },
          consistency_met: { required_percent: 80, current_percent: 81, passed: true },
          no_disputes: { passed: true },
          no_default: { passed: true }
        },
        loan_eligibility_message: "You qualify on 5 of 6 conditions. Stay active for 26 more days to unlock your loan offer.",
        group_tiers_available: ["Starter", "Bronze"],
        escrow_eligible: true,
        instalment_eligible: true,
        insurance_eligible: false
      }
    };
  }
};
