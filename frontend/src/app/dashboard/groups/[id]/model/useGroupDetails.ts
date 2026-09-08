import { useState, useEffect } from "react";
import { groupsService } from "@/services/groupsService";
import { useAppDispatch, useAppSelector } from "@/store";
import { joinGroup as joinGroupThunk } from "@/store/slices/groupsSlice";
import {
  GroupDetails,
  GroupDetailsResponse,
  RotationMember,
  CycleContribution,
} from "../types";

export interface MemberData {
  id: string;
  name: string;
  initials: string;
  score: number;
  scoreTag: string;
  position: number;
  status: "Paid" | "Pending" | "Missed";
  statusDetail?: string;
  avatar?: string;
}

export interface HistoryItem {
  cycle: string;
  date: string;
  collected: string;
  disbursedTo: string;
  amount: string;
}

export const useGroupDetails = (groupId: string) => {
  const [isLoading, setIsLoading] = useState(true);

  // Main layout states
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    status: "",
    contribution: "",
    rotation: "",
    currentCycle: 0,
    totalCycles: 0,
    nextDisbursement: "",
    onTimeRate: "0%",
    inviteCode: ""
  });

  const [rotationTimeline, setRotationTimeline] = useState<any[]>([]);

  const [members, setMembers] = useState<MemberData[]>([]);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [userStatus, setUserStatus] = useState({
    paymentStatus: "Pending",
    paymentMethod: "N/A",
    methodActive: false,
    methodDetails: "Loading status..."
  });

  const [virtualAccount, setVirtualAccount] = useState<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null>(null);

  const [isJoining, setIsJoining] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Core Detailed Payload
      const detResp: GroupDetailsResponse = await groupsService.getGroupDetail(groupId);
      console.log("details", detResp);
      if (detResp.success && detResp.data) {
        const data: GroupDetails = detResp.data;
        setGroupInfo({
          name: data.name,
          status: data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : "",
          contribution: `₦${data.contribution_amount?.toLocaleString() || 0} Contribution`,
          rotation: `${data.frequency ? data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1) : ""} Rotation`,
          currentCycle: data.current_cycle,
          totalCycles: data.total_cycles,
          nextDisbursement: `₦${data.next_disbursement_amount?.toLocaleString() || ((data.contribution_amount || 0) * (data.rotation?.length || 0))} on ${data.next_disbursement_date ? new Date(data.next_disbursement_date).toLocaleDateString() : 'N/A'}`,
          onTimeRate: "100%",
          inviteCode: data.invitecode || data.invite_code || ""
        });

        // Map the rotation timeline avatars
        if (data.rotation) {
          const fallbackPics = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
          ];
          const mappedTimeline = data.rotation.map((r: RotationMember, idx: number) => ({
            id: r.user_id,
            name: r.name.split(' ')[0] + (r.name.split(' ')[1] ? ' ' + r.name.split(' ')[1][0] + '.' : ''),
            pos: `Pos ${r.position}`,
            completed: r.has_received,
            isNext: !!r.is_next,
            avatar: fallbackPics[idx % fallbackPics.length]
          }));
          setRotationTimeline(mappedTimeline);
        }

        // Map Members Table
        if (data.this_cycle_contributions) {
          const mappedMembers: MemberData[] = data.this_cycle_contributions.map((c: CycleContribution, idx: number): MemberData => {
            const rotData = data.rotation?.find((r: RotationMember) => r.user_id === c.user_id);
            // Scale 10-100 score standard from backend back up to visual frontend 100-1000
            const scaleScore = rotData?.ajo_score ? rotData.ajo_score * 10 : 650; 
            return {
              id: c.user_id,
              name: c.name,
              initials: c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2),
              score: scaleScore,
              scoreTag: scaleScore >= 750 ? 'Excellent' : scaleScore >= 600 ? 'Good' : 'Fair',
              position: rotData?.position || (idx + 1),
              status: c.status === 'paid' ? 'Paid' : c.status === 'missed' ? 'Missed' : 'Pending',
              statusDetail: c.paid_at ? `Paid ${new Date(c.paid_at).toLocaleDateString()}` : c.grace_period_ends ? `Grace ends ${new Date(c.grace_period_ends).toLocaleDateString()}` : "Awaiting status"
            };
          });
          setMembers(mappedMembers);

          // Update user status
          const currentUserId = user?.user_id || user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
          const myStatus = data.this_cycle_contributions.find((c: CycleContribution) => c.user_id === currentUserId);
          if (myStatus) {
            setUserStatus({
              paymentStatus: myStatus.status === 'paid' ? 'Paid' : myStatus.status === 'missed' ? 'Missed' : 'Pending',
              paymentMethod: data.direct_debit_active ? "Squad Direct Debit" : "Manual Transfer",
              methodActive: data.direct_debit_active || false,
              methodDetails: myStatus.status === 'paid' 
                ? `You successfully paid for this cycle on ${myStatus.paid_at ? new Date(myStatus.paid_at).toLocaleDateString() : ''}.` 
                : data.direct_debit_active 
                  ? `Your next contribution of ₦${data.contribution_amount.toLocaleString()} will be automatically deducted on ${new Date(data.next_contribution_date).toLocaleDateString()}.`
                  : `Please make your payment of ₦${data.contribution_amount.toLocaleString()} before the deadline.`
            });
          } else {
            setUserStatus({
              paymentStatus: "Pending",
              paymentMethod: "N/A",
              methodActive: false,
              methodDetails: "You are not a member of this cycle's rotation."
            });
          }

          // Check if user is already a member
          const memberCheck = data.rotation?.some((r: RotationMember) => r.user_id === currentUserId) ||
                              data.this_cycle_contributions?.some((c: CycleContribution) => c.user_id === currentUserId);
          setIsMember(!!memberCheck);

          // Handle virtual account details if they exist in the payload
          if (data.virtual_account) {
            setVirtualAccount({
              bankName: data.virtual_account.bank_name || data.virtual_account.bankName || 'Squad Bank',
              accountNumber: (data.virtual_account.account_number || data.virtual_account.accountNumber)!,
              accountName: (data.virtual_account.account_name || data.virtual_account.accountName)!
            });
          }
        }

        // 2. Fetch Table Audits
        try {
          const histResp = await groupsService.getGroupContributionHistory(groupId);
          if (histResp.success && histResp.data?.contributions) {
            const mappedHist = histResp.data.contributions.map((h: any) => ({
              cycle: `#${h.cycle}`,
              date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              collected: h.all_paid ? "100%" : "Partial",
              disbursedTo: h.disbursed_to || "N/A",
              amount: `₦${h.disbursement_amount.toLocaleString()}`
            }));
            setHistory(mappedHist);
          }
        } catch {
          // history fallback maintained implicitly
        }

      }
    } catch (e) {
      console.warn("Group details API failover to simulation", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [groupId]);

  const [isActivating, setIsActivating] = useState(false);

  const handleInitiatePayment = async () => {
    const currentUserId = user?.user_id || user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
    if (!currentUserId || !groupId) return;
    
    const isAwaiting = groupInfo.status.toLowerCase().includes('awaiting');
    if (isAwaiting) {
      alert("Awaiting members means there are not enough members yet, so you can't make a payment. You need to join the group first and wait for it to commence.");
      return;
    }

    setIsPaying(true);
    try {
      console.log(`Initiating personal payment for user ${currentUserId} in group ${groupId}`);
      const response = await groupsService.createPersonalPaymentForm(groupId, currentUserId);
      console.log("Personal payment form response:", response);

      const authUrl = response.authorization_url || response.url;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        // Fallback to group payment initiation endpoint if authorization_url is not in response
        const fallbackResp = await groupsService.initiateGroupPayment(currentUserId, groupId);
        if ((fallbackResp.success === 'true' || fallbackResp.success === true) && fallbackResp.url) {
          window.location.href = fallbackResp.url;
        } else {
          alert(response.message || fallbackResp.message || "Failed to initiate payment. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("Payment initiation failed", err);
      alert(err.message || "An error occurred while initiating your payment form.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleActivateGroup = async () => {
    if (!groupId) return false;
    setIsActivating(true);
    try {
      const response = await groupsService.activateGroup(groupId);
      console.log("Activate group response:", response);
      if (response.success === 'true' || response.success === true || response.message?.toLowerCase().includes("activated")) {
        setAlertInfo({
          title: "Group Activated!",
          description: response.message || "Group has been activated successfully.",
          variant: "success"
        });
        await fetchDetails();
        return true;
      } else {
        alert(response.message || "Failed to activate group.");
        return false;
      }
    } catch (err: any) {
      console.error("Group activation failed", err);
      alert(err.message || "An error occurred while activating the group.");
      return false;
    } finally {
      setIsActivating(false);
    }
  };

  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    description: string;
    variant?: "success" | "destructive" | "default";
  } | null>(null);

  const handleJoinGroup = async (inviteCode?: string) => {
    setIsJoining(true);
    setJoinError(null);
    try {
      const codeToUse = inviteCode || groupInfo.inviteCode || "";
      const resultAction = await dispatch(joinGroupThunk({ 
        groupId, 
        payload: { invite_code: codeToUse } 
      }));
      
      if (joinGroupThunk.fulfilled.match(resultAction)) {
        setIsMember(true);
        const currentUserId = user?.user_id || user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');
        
        // Generate Group Payment Form upon joining
        try {
          await groupsService.createGroupPaymentForm(groupId, currentUserId);
          console.log("Group payment form generated successfully on join");
        } catch (gpfError) {
          console.error("Failed to generate group payment form on join", gpfError);
        }

        await fetchDetails();
        setAlertInfo({
          title: "Group Joined Successfully!",
          description: `You have successfully joined ${groupInfo.name || 'this group'}. Your rotation position and membership are now active.`,
          variant: "success"
        });
        return true;
      } else {
        const errorMsg = (resultAction.payload as string) || "Failed to join group";
        setJoinError(errorMsg);
        return false;
      }
    } catch (err: any) {
      setJoinError(err.message || "Failed to join group");
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  return {
    isLoading,
    isJoining,
    joinError,
    isMember,
    groupInfo,
    rotationTimeline,
    members,
    history,
    userStatus,
    virtualAccount,
    isPaying,
    isActivating,
    alertInfo,
    setAlertInfo,
    handleInitiatePayment,
    handleActivateGroup,
    handleJoinGroup,
    refetchDetails: fetchDetails,
  };
};
