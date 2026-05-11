"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import AccountEditProfileModal from "./AccountEditProfileModal";
import AccountChangePasswordModal from "./AccountChangePasswordModal";
import AccountForgotPasswordModal from "./AccountForgotPasswordModal";
import AccountAddAddressModal from "./AccountAddAddressModal";
import AccountEditAddressModal from "./AccountEditAddressModal";

const BORDER = "#d4d0c6";

export default function AccountProfileSettings() {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 222-333-4444",
    loading: true,
  });

  const [addresses, setAddresses] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/profile");
        const json = await res.json();
        if (json.success && json.data) {
          setProfile({
            fullName: json.data.full_name || "John Doe",
            email: json.data.email || "johndoe@example.com",
            phone: json.data.phone || "+1 222-333-4444",
            loading: false,
          });
        } else {
          setProfile((s) => ({ ...s, loading: false }));
        }

        // Fetch addresses
        const addrRes = await fetch("/api/account/addresses");
        const addrJson = await addrRes.json();
        if (addrJson.success) {
          setAddresses(addrJson.data || []);
        }
      } catch (err) {
        console.error("Error loading profile/addresses:", err);
        setProfile((s) => ({ ...s, loading: false }));
      }
    })();
  }, []);

  const handleSaveProfile = async (updatedProfile) => {
    // Optimistically update UI
    setProfile({ ...updatedProfile, loading: false });

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: updatedProfile.fullName,
          phone: updatedProfile.phone,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        console.error("Failed to save profile:", json.message);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEditAddressModalOpen(true);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      const res = await fetch(`/api/account/addresses/${editingAddress.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh addresses
        const addrRes = await fetch("/api/account/addresses");
        const addrJson = await addrRes.json();
        if (addrJson.success) setAddresses(addrJson.data);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh addresses
        const addrRes = await fetch("/api/account/addresses");
        const addrJson = await addrRes.json();
        if (addrJson.success) setAddresses(addrJson.data);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  if (profile.loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-[#555555]">
        <Icon icon="mingcute:loading-fill" className="size-6 animate-spin" aria-hidden />
        <span className="font-home-body text-sm">Loading profile…</span>
      </div>
    );
  }

  return (
    <section className="max-w-4xl" aria-labelledby="profile-settings-heading">
      <h2
        id="profile-settings-heading"
        className="font-home-body text-lg font-bold text-[#1a251f] sm:text-xl"
      >
        Profile settings
      </h2>

      <div className="mt-8 space-y-6">
        {/* Profile Info Card */}
        <div 
          className="rounded-sm border bg-[#FFFDF4] p-6 sm:p-8"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-3">
            <h3 className="font-home-body text-lg font-bold text-[#1a251f]">
              {profile.fullName}
            </h3>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1 text-sm font-medium text-[#4a524a] transition hover:text-[#1a251f]"
            >
              <Icon icon="mingcute:edit-2-line" className="size-4" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="font-home-body text-[13px] text-[#777777]">Email & password</p>
                <p className="mt-1 font-home-body text-[15px] font-medium text-[#1a251f]">
                  {profile.email}
                </p>
              </div>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-1.5 text-[14px] font-medium text-[#4a524a] transition hover:text-[#1a251f]"
              >
                <Icon icon="mingcute:edit-2-line" className="size-3.5" />
                <span>Change password</span>
              </button>
            </div>

            <div>
              <p className="font-home-body text-[13px] text-[#777777]">Phone number</p>
              <p className="mt-1 font-home-body text-[15px] font-medium text-[#1a251f]">
                {profile.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div 
          className="rounded-sm border bg-[#FFFDF4] p-6 sm:p-8"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-home-body text-lg font-bold text-[#1a251f]">Address</h3>
              <button 
                onClick={() => setIsAddAddressModalOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-[#4a524a] transition hover:text-[#1a251f]"
              >
                <Icon icon="mingcute:add-line" className="size-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {addresses.map((addr, idx) => (
              <div key={addr.id} className={idx > 0 ? "hidden sm:block" : ""}>
                <p className="font-home-body text-[13px] text-[#777777]">
                  {addr.isDefault ? "Default address" : "Secondary address"}
                </p>
                <div className="mt-3 space-y-0.5 font-home-body text-[15px] text-[#1a251f]">
                  <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.state}, {addr.city}, {addr.zipCode}</p>
                  <p>{addr.address}</p>
                  <p>{addr.country}</p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button 
                    onClick={() => handleEditAddress(addr)}
                    className="flex items-center gap-1.5 text-[14px] font-medium text-[#4a524a] transition hover:text-[#1a251f]"
                  >
                    <Icon icon="mingcute:edit-2-line" className="size-3.5" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this address?")) {
                        try {
                          const res = await fetch(`/api/account/addresses/${addr.id}`, { method: "DELETE" });
                          const json = await res.json();
                          if (json.success) {
                            setAddresses(addresses.filter(a => a.id !== addr.id));
                          }
                        } catch (error) {
                          console.error("Error deleting address:", error);
                        }
                      }
                    }}
                    className="flex items-center gap-1.5 text-[14px] font-medium text-red-600 transition hover:text-red-700"
                  >
                    <Icon icon="mingcute:delete-2-line" className="size-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6" style={{ borderColor: BORDER }}>
        <Link href="/privacy" className="text-[13px] text-[#4a524a] underline underline-offset-4 hover:text-[#1a251f]">
          Privacy policy
        </Link>
        <Link href="/terms" className="text-[13px] text-[#4a524a] underline underline-offset-4 hover:text-[#1a251f]">
          Terms of service
        </Link>
      </footer>

      <AccountEditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <AccountChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onForgotClick={() => {
          setIsPasswordModalOpen(false);
          setIsForgotModalOpen(true);
        }}
      />

      <AccountForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        email={profile.email}
      />

      <AccountAddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSave={handleAddAddress}
      />

      <AccountEditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={() => setIsEditAddressModalOpen(false)}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
    </section>
  );
}


