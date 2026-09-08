export type GroupStatus = "active" | "completed" | "paused" | "pending";

export type ContributionFrequency = "daily" | "weekly" | "monthly";

export type ContributionStatus = "paid" | "pending" | "missed";

export interface RotationMember {
  position: number;
  user_id: string;
  name: string;
  ajo_score: number;
  has_received: boolean;
  is_next?: boolean;
  received_date?: string;
}

export interface CycleContribution {
  user_id: string;
  name: string;
  status: ContributionStatus;
  paid_at?: string;
  grace_period_ends?: string;
}

export interface GroupDetails {
  group_id: string;
  name: string;
  contribution_amount: number;
  frequency: ContributionFrequency;
  status: GroupStatus;
  current_cycle: number;
  total_cycles: number;
  next_contribution_date: string;
  next_disbursement_date: string;
  next_disbursement_amount: number;
  rotation: RotationMember[];
  this_cycle_contributions: CycleContribution[];
  invitecode?: string;
  invite_code?: string;
  direct_debit_active?: boolean;
  virtual_account?: {
    bank_name?: string;
    bankName?: string;
    account_number?: string;
    accountNumber?: string;
    account_name?: string;
    accountName?: string;
  };
}

export interface GroupDetailsResponse {
  success?: boolean;
  message?: string;
  data: GroupDetails;
}