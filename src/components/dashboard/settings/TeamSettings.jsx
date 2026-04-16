"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AddMemberModal from "@/components/dashboard/settings/AddMemberModal";

const TeamSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMember = (member) => {
    // In a real app, this would send an invite
    console.log("Inviting member:", member);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                <p className="text-sm text-gray-500">Manage who has access to your store.</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
                <Icon icon="mingcute:add-line" className="text-lg" />
                Add Member
            </button>
        </div>

        <div className="space-y-4">
            {[
                { name: "Alex Johnson", email: "alex.j@example.com", role: "Owner", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                { name: "Sarah Smith", email: "sarah.s@example.com", role: "Editor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                { name: "Mike Brown", email: "mike.b@example.com", role: "Viewer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            ].map((member, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                        <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{member.name}</p>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-[3.5rem] sm:pl-0">
                        <span className="text-sm text-gray-600">{member.role}</span>
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm">
                            <Icon icon="mingcute:more-2-fill" className="text-xl" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <AddMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMember}
      />
    </div>
  );
};

export default TeamSettings;
