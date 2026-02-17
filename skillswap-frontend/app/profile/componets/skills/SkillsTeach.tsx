"use client";

import { useEffect, useState } from "react";
import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";
import SkillBadge from "./SkillBadge";
import {
  getAllSkills,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  createSkill,
  Skill,
  UserSkill,
} from "./SkillService";
import {
  FaReact, FaNodeJs, FaAws, FaDocker, FaHtml5, FaCss3Alt, FaGitAlt, FaGithub, FaLinux, FaJava, FaPhp, FaPython, FaRust, FaSwift, FaAngular, FaVuejs, FaSass, FaBootstrap, FaFigma, FaAndroid, FaApple, FaWindows, FaDatabase
} from "react-icons/fa";
import {
  SiJavascript, SiTypescript, SiMongodb, SiPostgresql, SiMysql, SiRedis, SiFirebase, SiGraphql,
  SiNextdotjs, SiTailwindcss, SiPrisma, SiDjango, SiFlask, SiSpringboot, SiKotlin, SiGo,
  SiRuby, SiRubyonrails, SiDart, SiFlutter, SiTensorflow, SiPytorch,
  SiPandas, SiNumpy, SiKubernetes, SiNginx, SiApache, SiJenkins, SiGitlab, SiBitbucket,
  SiJira, SiTrello, SiSlack, SiNotion, SiAdobephotoshop, SiAdobeillustrator, SiAdobexd,
  SiSketch, SiInvision, SiOracle, SiSqlite, SiSupabase
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";

interface Props {
  token: string;
  onEdit?: (message: string) => void;
}

const skillIconMap: Record<string, React.ReactNode> = {
  // Frontend
  "React": <FaReact className="text-sky-500" />,
  "React.js": <FaReact className="text-sky-500" />,
  "Next.js": <SiNextdotjs className="text-black" />,
  "Angular": <FaAngular className="text-red-600" />,
  "Vue.js": <FaVuejs className="text-green-500" />,
  "HTML": <FaHtml5 className="text-orange-500" />,
  "CSS": <FaCss3Alt className="text-blue-500" />,
  "JavaScript": <SiJavascript className="text-yellow-500" />,
  "TypeScript": <SiTypescript className="text-blue-600" />,
  "Tailwind CSS": <SiTailwindcss className="text-cyan-400" />,
  "Sass": <FaSass className="text-pink-500" />,
  "Bootstrap": <FaBootstrap className="text-purple-600" />,

  // Backend
  "Node.js": <FaNodeJs className="text-green-600" />,
  "Python": <FaPython className="text-yellow-400" />,
  "Java": <FaJava className="text-red-500" />,
  "C#": <span className="font-bold text-purple-600 border border-purple-600 rounded px-1 text-xs">C#</span>,
  "C++": <span className="font-bold text-blue-700 border border-blue-700 rounded px-1 text-xs">C++</span>,
  "PHP": <FaPhp className="text-indigo-500" />,
  "Go": <SiGo className="text-cyan-500" />,
  "Rust": <FaRust className="text-orange-700" />,
  "Ruby": <SiRuby className="text-red-600" />,
  "Rails": <SiRubyonrails className="text-red-700" />,
  "Django": <SiDjango className="text-green-800" />,
  "Flask": <SiFlask className="text-gray-500" />,
  "Spring": <SiSpringboot className="text-green-500" />,
  "Kotlin": <SiKotlin className="text-purple-500" />,
  "Swift": <FaSwift className="text-orange-500" />,
  "Dart": <SiDart className="text-blue-400" />,

  // Database
  "MongoDB": <SiMongodb className="text-green-500" />,
  "PostgreSQL": <SiPostgresql className="text-indigo-600" />,
  "MySQL": <SiMysql className="text-blue-600" />,
  "Redis": <SiRedis className="text-red-500" />,
  "SQLite": <SiSqlite className="text-blue-400" />,
  "Oracle": <SiOracle className="text-red-600" />,
  "Firebase": <SiFirebase className="text-yellow-500" />,
  "Supabase": <SiSupabase className="text-green-400" />,
  "Prisma": <SiPrisma className="text-blue-900" />,
  "GraphQL": <SiGraphql className="text-pink-600" />,

  // DevOps & Cloud
  "AWS": <FaAws className="text-orange-500" />,
  "Docker": <FaDocker className="text-blue-500" />,
  "Kubernetes": <SiKubernetes className="text-blue-600" />,
  "Linux": <FaLinux className="text-black" />,
  "Nginx": <SiNginx className="text-green-600" />,
  "Jenkins": <SiJenkins className="text-red-600" />,
  "Git": <FaGitAlt className="text-orange-600" />,
  "GitHub": <FaGithub className="text-black" />,
  "GitLab": <SiGitlab className="text-orange-500" />,

  // Mobile
  "Flutter": <SiFlutter className="text-blue-400" />,
  "React Native": <FaReact className="text-sky-500" />,
  "Android": <FaAndroid className="text-green-500" />,
  "iOS": <FaApple className="text-black" />,

  // AI/ML
  "TensorFlow": <SiTensorflow className="text-orange-500" />,
  "PyTorch": <SiPytorch className="text-red-500" />,
  "Pandas": <SiPandas className="text-blue-800" />,
  "NumPy": <SiNumpy className="text-blue-400" />,

  // Design & Tools
  "Figma": <FaFigma className="text-purple-500" />,
  "Photoshop": <SiAdobephotoshop className="text-blue-800" />,
  "Illustrator": <SiAdobeillustrator className="text-orange-700" />,
  "VS Code": <TbBrandVscode className="text-blue-500" />,
  "Jira": <SiJira className="text-blue-600" />,
  "Slack": <SiSlack className="text-purple-500" />,
};

export default function SkillsTeach({ token, onEdit }: Props) {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (token) fetchSkills();
  }, [token]);

  const fetchSkills = async () => {
    try {
      const skills = await getAllSkills();
      const userSkillsData = await getUserSkills(token);

      // Filter out any malformed skills (missing id or name)
      const validSkills = skills.filter(s => s && s.id && s.name);
      const validUserSkills = userSkillsData.filter(s => s && s.user_skill_id && s.name);

      setAllSkills(validSkills);
      setUserSkills(validUserSkills);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleAddSkill = async (skill: Skill) => {
    console.log("🎨 handleAddSkill called with:", skill);
    console.log("👥 Current userSkills:", userSkills);

    // prevent duplicates
    const alreadyExists = userSkills.some(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
    );

    console.log("🔄 Already exists?", alreadyExists);

    if (alreadyExists) return;

    try {
      console.log("📡 Calling addUserSkill API...");
      const res = await addUserSkill(token, skill.id, "teach");
      console.log("✅ API response:", res);

      setUserSkills([
        ...userSkills,
        { ...skill, user_skill_id: res.id, type: "teach", proficiency: 0 },
      ]);

      console.log("✨ Skill added to state");

      if (onEdit) onEdit(`${skill.name} added`);
    } catch (err) {
      console.error("❌ Error adding skill:", err);
    }
  };

  const handleRemoveSkill = async (userSkillId: number) => {
    const removedSkill = userSkills.find(
      (s) => s.user_skill_id === userSkillId
    );

    try {
      await removeUserSkill(token, userSkillId);
      setUserSkills(
        userSkills.filter((s) => s.user_skill_id !== userSkillId)
      );
      if (onEdit && removedSkill)
        onEdit(`${removedSkill.name} removed`);
    } catch (err) {
      console.error("Error removing skill:", err);
    }
  };

  // Helper to get icon case-insensitively
  const getSkillIcon = (name: string) => {
    // Try exact match first
    if (skillIconMap[name]) return skillIconMap[name];

    // Try case-insensitive match
    const lowerName = name.toLowerCase();
    const key = Object.keys(skillIconMap).find(k => k.toLowerCase() === lowerName);
    return key ? skillIconMap[key] : null;
  };

  // Helper to capitalize skill names
  const capitalizeSkill = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleManualAdd = async () => {
    if (!newSkill.trim()) return;

    // Capitalize the input
    const formattedSkill = capitalizeSkill(newSkill.trim());

    console.log("🔍 handleManualAdd called with:", formattedSkill);
    console.log("📋 Current allSkills:", allSkills);

    let skillToAdd = allSkills.find(
      (s) => s?.name?.toLowerCase() === formattedSkill.toLowerCase()
    );

    console.log("🎯 Found existing skill?", skillToAdd);

    try {
      if (!skillToAdd) {
        console.log("➕ Creating new skill:", formattedSkill);
        // Create new skill in system
        skillToAdd = await createSkill(formattedSkill);
        console.log("✅ Skill created:", skillToAdd);
        setAllSkills((prev) => [...prev, skillToAdd!]);
      }

      if (skillToAdd) {
        console.log("🚀 Adding skill to user:", skillToAdd);
        await handleAddSkill(skillToAdd);
        setNewSkill("");
      }
    } catch (err) {
      console.error("❌ Error creating/adding skill:", err);
      if (!skillToAdd) {
        alert("Failed to create new skill.");
      }
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
      {!isEditing && (
        <EditButton
          onClick={() => setIsEditing(true)}
          title="Edit Skills"
        />
      )}

      <SectionTitle>Skills to Teach</SectionTitle>

      {isEditing ? (
        <div className="mt-4 space-y-6">
          {/* Section: Your Current Skills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userSkills.length > 0 ? (
                userSkills.map((skill) => (
                  <SkillBadge
                    key={`user-skill-${skill.user_skill_id}`}
                    name={capitalizeSkill(skill.name)}
                    icon={getSkillIcon(skill.name)}
                    onRemove={() => handleRemoveSkill(skill.user_skill_id)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No skills added yet.</p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Add New */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Add New Skill</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type a skill (e.g. React, Python)..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
              />
              <button
                onClick={handleManualAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section: Suggestions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {allSkills
                .filter(
                  (s) =>
                    !userSkills.some(
                      (us) => us.name.toLowerCase() === s.name.toLowerCase()
                    )
                )
                .map((skill) => (
                  <button
                    key={`suggestion-${skill.id}`}
                    onClick={() => handleAddSkill(skill)}
                    className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 border border-gray-200 text-sm transition-colors"
                  >
                    + {capitalizeSkill(skill.name)}
                  </button>
                ))}
            </div>
          </div>

          <button
            onClick={() => setIsEditing(false)}
            className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 font-medium"
          >
            Done Editing
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 mt-4">
          {userSkills.map((skill) => (
            <SkillBadge
              key={skill.user_skill_id}
              name={capitalizeSkill(skill.name)}
              icon={getSkillIcon(skill.name)}
              onRemove={() =>
                handleRemoveSkill(skill.user_skill_id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
