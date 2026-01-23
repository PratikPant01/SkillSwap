"use client";
import { Search } from "lucide-react";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularSkills = [
    "Web Development",
    "Graphic Design",
    "Video Editing",
    "Digital Marketing",
    "Content Writing",
  ];

  const handleSkillClick = (skill: string) => {
    setSearchQuery(skill);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-36 pb-20 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-6 font-semibold">
            Find the perfect freelance services for your business
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Work with talented freelancers across Nepal
          </p>

          {/* 🔍 Search Bar */}
          <div className="bg-white rounded-lg shadow-2xl p-2 flex items-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Try 'Web Development' or 'Graphic Design'"
                className="w-full outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Popular skills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-blue-200 font-medium">Popular:</span>
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillClick(skill)}
                className="px-4 py-1.5 border border-white/40 rounded-full hover:bg-white/20 hover:border-white/60 transition-all duration-300 text-sm backdrop-blur-sm cursor-pointer"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;