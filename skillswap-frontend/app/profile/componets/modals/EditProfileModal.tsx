import { useState, useEffect } from "react";

type ProfileData = {
    headline: string;
    bio: string;
    location: string;
    profile_picture_url: string;
    portfolio_url: string;
    linkedin_url: string;
    github_url: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProfileData) => void;
    initialData: ProfileData;
};

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [formData, setFormData] = useState<ProfileData>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-md">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline || ""}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Full Stack Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio URL</label>
                            <input
                                type="url"
                                name="portfolio_url"
                                value={formData.portfolio_url || ""}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin_url"
                                value={formData.linkedin_url || ""}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
                            <input
                                type="url"
                                name="github_url"
                                value={formData.github_url || ""}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
