"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faMagnifyingGlass,
  faUser,
  faChevronDown,
  faRightFromBracket,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get auth state directly from context - no need for mounted state
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  console.log(user);


  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SkillSwap
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/skills"
            className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
          >
            Skills
          </Link>
          <Link
            href="/browse"
            className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
          >
            Find Work
          </Link>
          <Link
            href="/"
            className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/"
            className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
          >
            Why Us?
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block relative flex-1 max-w-sm mx-6">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          />
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full rounded-md border border-gray-200 bg-gray-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Desktop Auth / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden text-white font-semibold text-sm">
                  {user.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    user.name ? getInitials(user.name) : "U"
                  )}
                </div>

                {/* Username */}
                <span className="text-sm font-medium text-slate-900">
                  {user.name || "User"}
                </span>

                {/* ⭐ Credits Display */}
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
                  <span className="text-yellow-600">🪙</span>
                  <span className="text-sm font-semibold text-yellow-700">
                    {user.credits ?? 0}
                  </span>
                </div>

                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-gray-600 text-xs transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />

              </button>


              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg py-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-900 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faGauge} className="text-blue-600" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-900 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                    Profile
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition text-left"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-600 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-md rounded-b-2xl px-6 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-3">
            <Link
              href="/skills"
              className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Skills
            </Link>
            <Link
              href="/browse"
              className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Find Work
            </Link>
            <Link
              href="/"
              className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/"
              className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Why Us?
            </Link>
          </div>

          {/* Mobile Auth/User Section */}
          {isAuthenticated && user ? (
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center gap-3 pb-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden text-white font-semibold">
                  {user.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    user.name ? getInitials(user.name) : "U"
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-slate-900 font-medium hover:text-blue-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faGauge} />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-slate-900 font-medium hover:text-blue-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faUser} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors w-full text-left"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4 pt-2">
              <Link
                href="/auth/login"
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
