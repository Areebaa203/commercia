"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AddMemberModal from "@/components/dashboard/settings/AddMemberModal";
import TeamActionDropdown from "@/components/dashboard/settings/TeamActionDropdown";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TeamSettings = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({ open: false, member: null });
  // Deactivate Dialog State (Mocked as simple expired or similar)
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, member: null });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/settings/team");
      if (res.data.success) {
        setMembers(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch team members", error);
      toast({
        title: "Error",
        description: "Could not load team members.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (memberData) => {
    try {
      const res = await axios.post("/api/settings/team", memberData);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Member added successfully.",
        });
        fetchMembers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const confirmRemoveMember = async () => {
    if (!deleteDialog.member) return;
    try {
      const res = await axios.delete(`/api/settings/team/${deleteDialog.member.id}`);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Member removed from the team.",
        });
        fetchMembers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, member: null });
    }
  };

  const handleEditMember = (member) => {
      // For now, we reuse the add modal or could have a separate edit modal
      // This implementation plan focuses on getting dynamic functionality working
      toast({
          title: "Maintenance",
          description: "Role editing UI coming soon. For now, remove and re-add with new role.",
      });
  };

  if (loading) {
    return <div className="flex h-32 items-center justify-center">
      <Icon icon="mingcute:loading-fill" className="animate-spin text-2xl text-blue-600" />
    </div>;
  }

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
            {members.length > 0 ? members.map((member) => (
                <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                             <Icon icon="mingcute:user-3-line" />
                          </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{member.name}</p>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-[3.5rem] sm:pl-0">
                        <div className="flex items-center gap-3">
                            <span className={clsx(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                                member.status === "Active" ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-blue-50 text-blue-700 ring-blue-600/20"
                            )}>
                                {member.role}
                            </span>
                        </div>
                        <TeamActionDropdown 
                            member={member}
                            onEdit={handleEditMember}
                            onDelete={(m) => setDeleteDialog({ open: true, member: m })}
                            onDeactivate={(m) => setDeactivateDialog({ open: true, member: m })}
                        />
                    </div>
                </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Icon icon="mingcute:group-line" className="mb-2 text-4xl opacity-20" />
                <p className="text-sm">No team members found.</p>
              </div>
            )}
        </div>
      </div>

      <AddMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMember}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, member: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deleteDialog.member?.name} from your team. They will lose access to the dashboard immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveMember} className="bg-red-600 hover:bg-red-700">Delete Member</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* Deactivate dialog (Simple placeholder for now) */}
       <AlertDialog open={deactivateDialog.open} onOpenChange={(open) => !open && setDeactivateDialog({ open: false, member: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate team member?</AlertDialogTitle>
            <AlertDialogDescription>
              Deactivating will temporarily suspend their access without fully removing them from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                toast({ title: "Feature Pending", description: "Deactivation logic is being finalized." });
                setDeactivateDialog({ open: false, member: null });
            }}>Deactivate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

import { clsx } from "clsx";

export default TeamSettings;
