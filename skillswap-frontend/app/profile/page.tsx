"use client";

import { SetStateAction, useState } from "react";


import ProfileHeader from "./componets/main/ProfileHeader";
import AboutSection from "./componets/main/AboutSection";
import SkillsTeach from "./componets/skills/SkillsTeach";
import PortfolioTabs from "./componets/main/PortfolioTabs";
import Sidebar from "./componets/sidebar/Sidebar";
import Toast from "./componets/shared/Toast";

export default function SkillSwapProfile() {
    const [toast, setToast] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const handleEdit = (section: string) => {
        setToast(section);
        setTimeout(() => setToast(null), 2500);
    };

    return (
        <div className="pt-20 min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 font-sans">


            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ProfileHeader onEdit={handleEdit} />
                        <AboutSection onEdit={handleEdit} />
                        <SkillsTeach token={token}/>
                        <PortfolioTabs onEdit={handleEdit} />

                    </div>

                    <Sidebar onEdit={handleEdit} />
                </div>
            </main>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}
