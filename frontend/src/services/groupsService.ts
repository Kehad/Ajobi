import { apiClient } from './apiClient';

export interface CreateGroupPayload {
  name: string;
  contribution_amount: number;
  frequency: 'weekly' | 'monthly';
  max_members: number;
  min_ajo_score: number;
  rotation_type: 'random' | 'manual';
  grace_period_hours: 24 | 48;
  description?: string;
}

export interface BrowseGroupsParams {
  frequency?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
}

export interface JoinGroupPayload {
  invite_code: string;
}

export interface AutoMatchPayload {
  contribution_amount: number;
  frequency: 'weekly' | 'monthly';
  user_id: string;
}

export interface MandatePayload {
  bank_account_number: string;
  bank_code: string;
}

export const groupsService = {
  createGroup: async (payload: CreateGroupPayload) => {
    // const response = await apiClient.post('/api/groups', payload);
    return {
      success: true,
      data: {
        group_id: "grp_x1y2z3",
        name: "Sunshine Traders Group",
        invite_link: "https://ajobi.app/groups/join/grp_x1y2z3",
        invite_code: "SUN-2024",
        status: "awaiting_members",
        created_at: "2024-05-29T10:00:00Z"
      }
    };
  },

  browseGroups: async (params?: BrowseGroupsParams) => {
    // const response = await apiClient.get('/api/groups/browse', { params });
    return {
      success: true,
      data: {
        groups: [
          {
            group_id: "grp_x1y2z3",
            name: "Sunshine Traders Group",
            contribution_amount: 10000,
            frequency: "weekly",
            current_members: 7,
            max_members: 10,
            min_ajo_score: 55,
            creator_name: "Mama Ngozi",
            creator_score: 74,
            spots_remaining: 3,
            next_contribution_date: "2024-06-05T00:00:00Z",
            tier: "Bronze",
            locked: false
          }
        ],
        total: 24,
        page: 1,
        limit: 10
      }
    };
  },

  getMyGroups: async (userId: string) => {
    // const response = await apiClient.get(`/api/mygroups/${userId}`);
    return {
      success: true,
      data: {
        groups: [
          {
            group_id: "grp_x1y2z3",
            name: "Sunshine Traders Group",
            contribution_amount: 10000,
            frequency: "weekly",
            my_rotation_position: 4,
            my_contribution_status: "paid",
            next_contribution_date: "2024-06-05T00:00:00Z",
            next_recipient: "Bola Adeyemi",
            my_payout_date: "2024-07-03T00:00:00Z",
            my_payout_amount: 100000,
            current_cycle: 3,
            total_cycles: 10,
            direct_debit_active: true
          }
        ]
      }
    };
  },

  getGroupDetail: async (groupId: string) => {
    // const response = await apiClient.get(`/api/groups/${groupId}`);
    return {
      success: true,
      data: {
        group_id: "grp_x1y2z3",
        name: "Sunshine Traders Group",
        contribution_amount: 10000,
        frequency: "weekly",
        status: "active",
        current_cycle: 3,
        total_cycles: 10,
        next_contribution_date: "2024-06-05T00:00:00Z",
        next_disbursement_date: "2024-06-05T00:00:00Z",
        next_disbursement_amount: 100000,
        rotation: [
          {
            position: 1,
            user_id: "usr_001",
            name: "Mama Ngozi",
            ajo_score: 74,
            has_received: true,
            received_date: "2024-04-10T00:00:00Z"
          },
          {
            position: 2,
            user_id: "usr_002",
            name: "Bola Adeyemi",
            ajo_score: 68,
            has_received: false,
            is_next: true
          },
          {
            position: 3,
            user_id: "usr_003",
            name: "Emeka Obi",
            ajo_score: 71,
            has_received: false,
            is_next: false
          }
        ],
        this_cycle_contributions: [
          {
            user_id: "usr_001",
            name: "Mama Ngozi",
            status: "paid",
            paid_at: "2024-05-29T08:00:00Z"
          },
          {
            user_id: "usr_002",
            name: "Bola Adeyemi",
            status: "pending"
          },
          {
            user_id: "usr_003",
            name: "Emeka Obi",
            status: "missed",
            grace_period_ends: "2024-05-30T08:00:00Z"
          }
        ]
      }
    };
  },

  joinGroup: async (groupId: string, payload: JoinGroupPayload) => {
    // const response = await apiClient.post(`/api/groups/${groupId}/join`, payload);
    return {
      success: true,
      data: {
        joined: true,
        group_id: "grp_x1y2z3",
        rotation_position: 8,
        first_contribution_date: "2024-06-05T00:00:00Z",
        mandate_setup_required: true,
        mandate_setup_url: "https://squad.co/mandate/setup/..."
      }
    };
  },

  autoMatchGroup: async (payload: AutoMatchPayload) => {
    // const response = await apiClient.post('/api/groups/match', payload);
    return {
      success: true,
      data: {
        matches: [
          {
            match_id: "match_001",
            compatibility_score: 94,
            contribution_amount: 10000,
            frequency: "weekly",
            proposed_members: [
              {
                name: "Tunde Bakare",
                ajo_score: 71,
                contribution_consistency: "96%",
                location: "Lagos"
              },
              {
                name: "Chisom Eze",
                ajo_score: 65,
                contribution_consistency: "88%",
                location: "Lagos"
              }
            ],
            estimated_start_date: "2024-06-10T00:00:00Z"
          }
        ]
      }
    };
  },

  setupDirectDebitMandate: async (groupId: string, payload: MandatePayload) => {
    // const response = await apiClient.post(`/api/groups/${groupId}/mandate`, payload);
    return {
      success: true,
      data: {
        mandate_id: "mnd_abc123",
        squad_reference: "SQD_REF_001",
        status: "active",
        first_debit_date: "2024-06-05T00:00:00Z",
        amount: 10000
      }
    };
  },

  getGroupContributionHistory: async (groupId: string, cycle: string = 'all') => {
    // const response = await apiClient.get(`/api/groups/${groupId}/contributions`, { params: { cycle } });
    return {
      success: true,
      data: {
        contributions: [
          {
            cycle: 1,
            date: "2024-04-03T00:00:00Z",
            total_collected: 100000,
            disbursed_to: "Mama Ngozi",
            disbursement_amount: 100000,
            all_paid: true
          },
          {
            cycle: 2,
            date: "2024-04-10T00:00:00Z",
            total_collected: 90000,
            disbursed_to: "Bola Adeyemi",
            disbursement_amount: 90000,
            all_paid: false,
            missed_members: ["Emeka Obi"]
          }
        ]
      }
    };
  },

  createGroupVirtualAccount: async (groupId: string | number) => {
    // const response = await apiClient.post('/api/user/groupvirtualaccounts', { group_id: groupId });
    return { status: "success", data: { account_number: "0123456789", bank_name: "Mock Bank" } };
  },

  initiateGroupPayment: async (userId: string | number, groupId: string | number) => {
    // const response = await apiClient.post('/api/user/group_payment', { user_id: userId, group_id: groupId });
    return { success: true, url: "https://sandbox.squadco.com/pay/123" };
  }
};
