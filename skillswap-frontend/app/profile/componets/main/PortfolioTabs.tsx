"use client";

import { useState } from "react";
import { Briefcase, Calendar, ExternalLink, Plus, Edit2, ArrowUpRight, Globe, CheckCircle, Clock } from "lucide-react";

type PortfolioProject = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
};

type CompletedService = {
  id: number;
  title: string;
  category: string;
  description: string;
  owner_username: string;
  created_at: string;
};

type Props = {
  portfolio: PortfolioProject[];
  completedServices: CompletedService[];
  onAddProject: () => void;
  onEditProject: (project: PortfolioProject) => void;
  isPublic?: boolean;
};

export default function PortfolioTabs({ portfolio, completedServices, onAddProject, onEditProject, isPublic }: Props) {
  const [tab, setTab] = useState<"portfolio" | "services">("portfolio");

  const ensureProtocol = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
      <div className="flex flex-wrap gap-4 mb-8 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
        {[
          { key: "portfolio", label: "Portfolio" },
          { key: "services", label: "Completed Services" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as any)}
            className={`flex-1 py-4 text-sm font-bold transition-all ${tab === item.key
              ? "text-blue-600 border-b-2 border-blue-600 bg-white"
              : "text-slate-500 hover:bg-slate-100/50"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-6 relative min-h-[300px]">
        {tab === "portfolio" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" /> My Projects
              </h3>

              {!isPublic && (
                <button
                  onClick={onAddProject}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                  <Plus size={16} /> Add Project
                </button>
              )}
            </div>

            {portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.map((project) => (
                  <div
                    key={project.id}
                    className="group border border-slate-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all"
                  >
                    {project.image_url && (
                      <div className="aspect-video w-full bg-slate-100 overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>
                        {!isPublic && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditProject(project)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <a
                          href={ensureProtocol(project.project_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors group/link"
                        >
                          View Project
                          <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={32} className="text-blue-200" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No projects added yet.</p>
                <button onClick={onAddProject} className="mt-4 text-blue-600 font-bold text-sm hover:underline">
                  Add your first project
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" /> Successfully Completed
            </h3>
            {completedServices.length > 0 ? (
              <div className="space-y-4">
                {completedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="bg-green-100 p-3 rounded-xl">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 truncate">{service.title}</h4>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <CheckCircle size={12} /> Done for <span className="text-slate-600 font-bold">@{service.owner_username}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <Clock size={12} /> {new Date(service.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-slate-200" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No completed services yet.</p>
                <p className="text-slate-400 text-xs mt-1">Start exchanging skills to build your history!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
