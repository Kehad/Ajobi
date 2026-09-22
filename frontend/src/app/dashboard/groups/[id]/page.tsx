"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGroupDetails } from "./model/useGroupDetails";
import GroupHeader from "./parts/GroupHeader";
import RotationTracker from "./parts/RotationTracker";
import MembersTable from "./parts/MembersTable";
import ContributionHistory from "./parts/ContributionHistory";
import StatusWidget from "./parts/StatusWidget";
import CreatorControls from "./parts/CreatorControls";
import TrustLevel from "./parts/TrustLevel";
import TopRightAlert from "@/components/ui/TopRightAlert";
import WithdrawalModal from "./parts/WithdrawalModal";

function GroupDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const searchParams = useSearchParams();
  const actionParam = searchParams?.get("action");

  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

  const {
    isLoading,
    groupInfo,
    rotationTimeline,
    members,
    history,
    userStatus,
    virtualAccount,
    isPaying,
    isActivating,
    handleInitiatePayment,
    handleActivateGroup,
    handleJoinGroup,
    isJoining,
    joinError,
    isMember,
    alertInfo,
    setAlertInfo,
    refetchDetails
  } = useGroupDetails(id);

  const [urlAlert, setUrlAlert] = useState<{ title: string; description: string; variant?: "success" | "default" | "destructive" } | null>(null);

  useEffect(() => {
    if (actionParam === "created") {
      setUrlAlert({
        title: "Group Created Successfully!",
        description: "Your Ajo group has been created and initialized. You can now invite members and manage rotation.",
        variant: "success"
      });
    } else if (actionParam === "joined") {
      setUrlAlert({
        title: "Group Joined Successfully!",
        description: "You have joined this Ajo group. Your rotation position and membership are now active.",
        variant: "success"
      });
    }
  }, [actionParam]);

  const activeAlert = alertInfo || urlAlert;

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
        <p className="text-[14px] font-bold text-gray-500">Loading group analytics...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12">
      {activeAlert && (
        <TopRightAlert 
          title={activeAlert.title}
          description={activeAlert.description}
          variant={activeAlert.variant || "success"}
          durationMs={15000}
          onClose={() => {
            setAlertInfo(null);
            setUrlAlert(null);
          }}
        />
      )}

      <WithdrawalModal
        groupId={id}
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        onSuccess={refetchDetails}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
        
        {/* Left: Core Group Data Modules */}
        <div className="lg:col-span-2 space-y-8">
          
          <GroupHeader 
            name={groupInfo.name}
            status={groupInfo.status}
            contribution={groupInfo.contribution}
            rotation={groupInfo.rotation}
            currentCycle={groupInfo.currentCycle}
            totalCycles={groupInfo.totalCycles}
            onJoin={handleJoinGroup}
            isJoining={isJoining}
            joinError={joinError}
            inviteCode={groupInfo.inviteCode}
            isMember={isMember}
            virtualAccount={virtualAccount}
            onPayment={handleInitiatePayment}
            isPaying={isPaying} 
          />

          <RotationTracker 
            nextDisbursement={groupInfo.nextDisbursement}
            timeline={rotationTimeline}
          />

          <MembersTable 
            members={members}
            onTimeRate={groupInfo.onTimeRate}
          />

          <ContributionHistory 
            history={history}
          />

        </div>

        {/* Right: User Actions & Status Widgets */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            <StatusWidget 
              paymentStatus={userStatus.paymentStatus}
              paymentMethod={userStatus.paymentMethod}
              methodActive={userStatus.methodActive}
              methodDetails={userStatus.methodDetails}
            />

            <CreatorControls 
              onActivateGroup={handleActivateGroup}
              onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
              isActivating={isActivating}
            />

            <TrustLevel />

          </div>
        </div>

      </div>

    </div>
  );
}

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
        <p className="text-[14px] font-bold text-gray-500">Loading group analytics...</p>
      </div>
    }>
      <GroupDetailsContent params={params} />
    </Suspense>
  );
}
