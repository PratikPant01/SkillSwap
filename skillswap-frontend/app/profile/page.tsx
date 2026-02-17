"use client";

import { SetStateAction, useState, useEffect } from "react";
import ProfileHeader from "./componets/main/ProfileHeader";
import AboutSection from "./componets/main/AboutSection";
import SkillsTeach from "./componets/skills/SkillsTeach";
import PortfolioTabs from "./componets/main/PortfolioTabs";
import Sidebar from "./componets/sidebar/Sidebar";
import Toast from "./componets/shared/Toast";
import EditProfileModal from "./componets/modals/EditProfileModal";

export default function SkillSwapProfile() {
    const [toast, setToast] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleEdit = (section: string) => {
        if (section === "profile-header" || section === "about") {
            setIsEditModalOpen(true);
        } else {
            setToast(section);
            setTimeout(() => setToast(null), 2500);
        }
    };

    const handleSaveProfile = async (updatedData: any) => {
        try {
            const res = await fetch(`${API_URL}/profile/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                setProfile((prev: any) => ({ ...prev, ...updatedData }));
                setIsEditModalOpen(false);
                setToast("Profile updated successfully!");
                setTimeout(() => setToast(null), 3000);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Error updating profile");
        }
    };

    if (!profile) return <div className="pt-24 text-center">Loading...</div>;

    return (
        <div className="pt-20 min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ProfileHeader onEdit={handleEdit} profile={profile} />
                        <AboutSection onEdit={handleEdit} bio={profile.bio} />
                        <SkillsTeach token={token} />
                        <PortfolioTabs onEdit={handleEdit} />
                    </div>

                    <Sidebar onEdit={handleEdit} />
                </div>
            </main>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
                initialData={profile}
            />
        </div>
    );
}
