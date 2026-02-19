"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Globe, Image as ImageIcon, Camera, Loader2 } from "lucide-react";

export type PortfolioProject = {
    id?: number;
    title: string;
    description: string;
    image_url: string;
    project_url: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: PortfolioProject) => void;
    onDelete?: (id: number) => void;
    initialData?: PortfolioProject | null;
};

export default function EditPortfolioModal({ isOpen, onClose, onSave, onDelete, initialData }: Props) {
    const [project, setProject] = useState<PortfolioProject>({
        title: "",
        description: "",
        image_url: "",
        project_url: "",
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setProject(initialData);
        } else {
            setProject({
                title: "",
                description: "",
                image_url: "",
                project_url: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/profile/portfolio/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setProject({ ...project, image_url: data.imageUrl });
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Connection error during upload");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = () => {
        if (project.title.trim()) {
            onSave(project);
            onClose();
        } else {
            alert("Title is required");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {initialData ? "Edit Project" : "Add Portfolio Project"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title *</label>
                        <input
                            type="text"
                            placeholder="My Awesome Project"
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={project.title}
                            onChange={(e) => setProject({ ...project, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                        <textarea
                            placeholder="Briefly describe what you did..."
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            value={project.description}
                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Image</label>
                        <div className="flex flex-col gap-3">
                            {project.image_url ? (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-100 group">
                                    <img
                                        src={project.image_url}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]"
                                    >
                                        <Camera size={24} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Change Image</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
                                >
                                    {isUploading ? (
                                        <Loader2 size={32} className="animate-spin text-blue-500" />
                                    ) : (
                                        <>
                                            <div className="p-3 bg-slate-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                                <Plus size={24} />
                                            </div>
                                            <span className="text-sm font-semibold">Upload Project Screenshot</span>
                                        </>
                                    )}
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Live Project Link</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="https://myproject.com"
                                className="w-full border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={project.project_url}
                                onChange={(e) => setProject({ ...project, project_url: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    {initialData && onDelete && initialData.id && (
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this project?")) {
                                    onDelete(initialData.id!);
                                    onClose();
                                }
                            }}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                        >
                            <Trash2 size={18} /> Delete Project
                        </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            {initialData ? "Save Changes" : "Add to Portfolio"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
