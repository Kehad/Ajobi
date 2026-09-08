"use client";

import Image from "next/image";
import Link from "next/link";
import { GroupItem } from "../model/useGroups";

export default function MyGroups({ groups, setActiveTab }: { groups: GroupItem[], setActiveTab: (tab: 'browse') => void }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid": return "bg-[#F1F6F3] text-[#066B44]";
      case "Pending": return "bg-[#FFF5F5] text-[#FF4D4D]";
      case "Missed": return "bg-red-50 text-red-600";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[24px] border border-[#E8EFE8]">
        <div className="w-16 h-16 rounded-full bg-[#F1F6F3] flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-[#066B44]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h4 className="text-[18px] font-bold text-gray-900 mb-1">No groups yet</h4>
        <p className="text-[13px] text-gray-500 max-w-sm mb-6">
          You haven't joined or created any contribution groups yet.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className="px-5 py-2.5 rounded-full bg-[#066B44] text-white text-[13px] font-bold hover:bg-[#055837] transition-colors"
        >
          Explore Groups
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-[24px] p-6 border border-[#E8EFE8] shadow-sm relative flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[16px] text-gray-900 leading-tight">{group.name}</h4>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">{group.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getStatusStyle(group.status)}`}>
                  {group.status}
                </span>
              </div>

              <h3 className="text-[28px] font-black text-[#066B44] mb-6 tracking-tight">{group.contribution}</h3>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#E8EFE8] mb-6">
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase">
                    {group.nextPayout === 'Awaiting start' ? 'Next Recipient' : 'Next Payout'}
                  </p>
                  <p className="text-[13px] font-bold text-gray-800 mt-0.5">
                    {group.nextPayout === 'Awaiting start' ? (group as any).nextRecipient : group.nextPayout}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase">Position</p>
                  <p className="text-[13px] font-bold text-gray-800 mt-0.5">{group.position}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.avatars.map((url, idx) => (
                    <div key={idx} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative bg-gray-200">
                      <Image src={url} alt="member" fill className="object-cover" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-[#F1F6F3] flex items-center justify-center text-[10px] font-extrabold text-[#066B44]">
                    +{group.members - group.avatars.length}
                  </div>
                </div>
                <span className="text-[12px] font-bold text-gray-500">{group.members} members</span>
              </div>

              <Link
                href={`./groups/${group.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F1F6F3] hover:bg-[#E2EFE7] text-[#066B44] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors duration-150"
              >
                Visit Group
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}