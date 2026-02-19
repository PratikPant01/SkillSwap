"use client";

import { SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./componets/main/ProfileHeader";
import AboutSection from "./componets/main/AboutSection";
import SkillsTeach from "./componets/skills/SkillsTeach";
import PortfolioTabs from "./componets/main/PortfolioTabs";
import Sidebar from "./componets/sidebar/Sidebar";
import Toast from "./componets/shared/Toast";
import EditProfileModal from "./componets/modals/EditProfileModal";
import EditEducationModal from "./componets/modals/EditEducationModal";
import EditLanguagesModal from "./componets/modals/EditLanguagesModal";
import EditPortfolioModal, { PortfolioProject } from "./componets/modals/EditPortfolioModal";

export default function SkillSwapProfile() {
    const router = useRouter();
    const [toast, setToast] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        if (!token) {
            router.push('/');
            return;
        }
        fetchProfile();
    }, [token]);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                // Token expired or invalid — redirect to login
                localStorage.removeItem('token');
                router.push('/');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            } else {
                const errData = await res.json().catch(() => ({}));
                setError(errData.message || `Server error (${res.status})`);
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError("Could not connect to the server. Make sure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (section: string) => {
        if (section === "profile-header" || section === "about") {
            setIsEditModalOpen(true);
        } else if (section === "education") {
            setIsEduModalOpen(true);
        } else if (section === "languages") {
            setIsLangModalOpen(true);
        } else {
            setToast(section);
            setTimeout(() => setToast(null), 2500);
        }
    };

    const handleSaveProfile = async (updatedData: any) => {
        try {
            const body = { ...profile, ...updatedData };

            const res = await fetch(`${API_URL}/profile/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...profile, ...updatedData })
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

    const handleSavePortfolio = async (projectData: PortfolioProject) => {
        try {
            const method = projectData.id ? "PUT" : "POST";
            const url = projectData.id
                ? `${API_URL}/profile/portfolio/${projectData.id}`
                : `${API_URL}/profile/portfolio`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(projectData)
            });

            if (res.ok) {
                fetchProfile();
                setIsPortfolioModalOpen(false);
                setToast(projectData.id ? "Project updated!" : "Project added!");
                setTimeout(() => setToast(null), 3000);
            } else {
                alert("Failed to save project");
            }
        } catch (error) {
            console.error("Error saving portfolio", error);
            alert("Error saving portfolio");
        }
    };

    const handleDeletePortfolio = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/profile/portfolio/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchProfile();
                setToast("Project deleted");
                setTimeout(() => setToast(null), 3000);
            } else {
                alert("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting portfolio", error);
            alert("Error deleting portfolio");
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("photo", file);

            const res = await fetch(`${API_URL}/profile/upload-photo`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProfile((prev: any) => ({ ...prev, profile_picture_url: data.photoUrl }));
                setToast("Profile picture updated!");
                setTimeout(() => setToast(null), 3000);
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image", error);
            alert("Error uploading image");
        }
    };

    if (isLoading) return <div className="pt-24 text-center text-gray-500">Loading profile...</div>;
    if (error) return (
        <div className="pt-24 text-center">
            <p className="text-red-500 font-semibold mb-2">Failed to load profile</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button onClick={fetchProfile} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Retry
            </button>
        </div>
    );
    if (!profile) return <div className="pt-24 text-center text-gray-500">No profile data found.</div>;

    return (
        <div className="pt-20 min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ProfileHeader onEdit={handleEdit} profile={profile} onImageUpload={handleImageUpload} />
                        <AboutSection onEdit={handleEdit} bio={profile.bio} />
                        <SkillsTeach token={token} />
                        <PortfolioTabs
                            portfolio={profile.portfolio || []}
                            completedServices={profile.completed_services || []}
                            onAddProject={() => {
                                setEditingProject(null);
                                setIsPortfolioModalOpen(true);
                            }}
                            onEditProject={(project) => {
                                setEditingProject(project);
                                setIsPortfolioModalOpen(true);
                            }}
                        />
                    </div>

                    <Sidebar onEdit={handleEdit} profile={profile} />
                </div>
            </main>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
                initialData={profile}
            />

            <EditEducationModal
                isOpen={isEduModalOpen}
                onClose={() => setIsEduModalOpen(false)}
                onSave={handleSaveProfile}
                initialData={profile?.education}
            />

            <EditLanguagesModal
                isOpen={isLangModalOpen}
                onClose={() => setIsLangModalOpen(false)}
                onSave={handleSaveProfile}
                initialData={profile?.languages}
            />

            <EditPortfolioModal
                isOpen={isPortfolioModalOpen}
                onClose={() => setIsPortfolioModalOpen(false)}
                onSave={handleSavePortfolio}
                onDelete={handleDeletePortfolio}
                initialData={editingProject}
            />
        </div>
    );
}
