const API_URL = "https://skillswapservice.up.railway.app";

export interface Skill {
  id: number;
  name: string;
  icon_url: string | null;
}

export interface UserSkill extends Skill {
  user_skill_id: number;
  type: "teach" | "learn";
  proficiency: number;
}

// Fetch all system skills
export const getAllSkills = async (): Promise<Skill[]> => {
  const res = await fetch(`${API_URL}/skills`);
  const data = await res.json();

  // Ensure we have an array and filter out any malformed entries
  if (!Array.isArray(data)) {
    console.error("getAllSkills: Expected array, got:", data);
    return [];
  }

  return data.filter(skill => skill && skill.id && skill.name);
};

// Fetch current user's skills
export const getUserSkills = async (token: string): Promise<UserSkill[]> => {
  const res = await fetch(`${API_URL}/user-skills`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  // Ensure we have an array and filter out any malformed entries
  if (!Array.isArray(data)) {
    console.error("getUserSkills: Expected array, got:", data);
    return [];
  }

  return data.filter(skill => skill && skill.user_skill_id && skill.name);
};

// Add skill for user
export const addUserSkill = async (
  token: string,
  skill_id: number,
  type: "teach" | "learn"
) => {
  const res = await fetch(`${API_URL}/user-skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ skill_id, type }),
  });
  return res.json();
};

// Remove skill for user
export const removeUserSkill = async (token: string, userSkillId: number) => {
  const res = await fetch(`${API_URL}/user-skills/${userSkillId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Create a new system skill
export const createSkill = async (name: string, icon_url: string | null = null) => {
  const res = await fetch(`${API_URL}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, icon_url }),
  });
  return res.json();
};
