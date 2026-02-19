"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileHeader from "../componets/main/ProfileHeader";
import AboutSection from "../componets/main/AboutSection";
import SkillsTeach from "../componets/skills/SkillsTeach";
import PortfolioTabs from "../componets/main/PortfolioTabs";
import Sidebar from "../componets/sidebar/Sidebar";
import Toast from "../componets/shared/Toast";

export default function PublicProfilePage() {
    const { username } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = "http://localhost:5000";

    useEffect(() => {
        if (username) {
            fetchPublicProfile();
        }
    }, [username]);

    const fetchPublicProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/profile/${username}`);
            if (res.ok) {
                const data = await res.json();
                // Map the nested user object back to the flat profile structure
                // similar to what /profile/me returns for component compatibility
                const flatProfile = {
                    ...data,
                    username: data.user.username,
                    email: data.user.email,
                };
                setProfile(flatProfile);
            } else {
                const errData = await res.json().catch(() => ({}));
                setError(errData.message || `Profile not found`);
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 px-4">
                <div className="max-w-7xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
                    <p className="text-slate-500 mb-6">{error || "User not found"}</p>
                    <button
                        onClick={() => router.push('/browse')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Back to Browse
                    </button>
                </div>
            </div>
        );
    }

    const noop = () => { };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                    {/* Main Content Area */}
                    <div className="space-y-8">
                        <ProfileHeader
                            onEdit={noop}
                            profile={profile}
                            onImageUpload={noop}
                            isPublic={true}
                        />
                        <AboutSection onEdit={noop} bio={profile.bio} isPublic={true} />
                        <SkillsTeach token="" isPublic={true} />
                        <PortfolioTabs
                            portfolio={profile.portfolio || []}
                            completedServices={profile.completed_services || []}
                            onAddProject={noop}
                            onEditProject={noop}
                            isPublic={true}
                        />
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <Sidebar onEdit={noop} profile={profile} isPublic={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
