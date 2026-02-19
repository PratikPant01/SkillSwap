"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Coins, LayoutGrid, PlusSquare, Compass } from "lucide-react";
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

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SkillSwap
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/browse"
            className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2 rounded-lg"
          >
            <Compass size={15} strokeWidth={2} />
            Explore
          </Link>
          <Link
            href="/post/create"
            className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2 rounded-lg"
          >
            <PlusSquare size={15} strokeWidth={2} />
            Create Post
          </Link>
          <Link
            href="/#how-it-works"
            className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2 rounded-lg"
          >
            <LayoutGrid size={15} strokeWidth={2} />
            Browse
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block relative flex-1 max-w-sm mx-6">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full rounded-md border border-gray-200 bg-gray-100 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:bg-white transition"
          />
        </div>

        {/* Desktop Auth / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-gray-200 px-3 py-2 hover:bg-gray-50 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden text-white font-semibold text-xs">
                  {user.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : user.name ? (
                    getInitials(user.name)
                  ) : (
                    "U"
                  )}
                </div>

                <span className="text-sm font-medium text-slate-900">
                  {user.name || "User"}
                </span>

                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                  <Coins className="text-yellow-500" size={12} strokeWidth={2} />
                  <span className="text-xs font-semibold text-yellow-600">
                    {user.credits ?? 0}
                  </span>
                </div>

                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-gray-400 text-[10px] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faGauge} className="text-blue-500 w-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="text-blue-500 w-3.5" />
                    Profile
                  </Link>
                  <hr className="my-1.5 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition text-left"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
            />
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full rounded-full border border-gray-200 bg-gray-100 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
            <Link
              href="/posts/explore"
              className="flex items-center gap-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2.5 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <Compass size={16} strokeWidth={1.75} className="text-slate-400" />
              Explore
            </Link>
            <Link
              href="/posts/create"
              className="flex items-center gap-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2.5 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <PlusSquare size={16} strokeWidth={1.75} className="text-slate-400" />
              Create Post
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2.5 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutGrid size={16} strokeWidth={1.75} className="text-slate-400" />
              Browse
            </Link>
          </div>

          {/* Mobile Auth/User Section */}
          {isAuthenticated && user ? (
            <div className="border-t border-gray-100 pt-4 space-y-1">
              <div className="flex items-center gap-3 px-3 pb-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden text-white font-semibold text-sm">
                  {user.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : user.name ? (
                    getInitials(user.name)
                  ) : (
                    "U"
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                  <Coins className="text-yellow-500" size={12} strokeWidth={2} />
                  <span className="text-xs font-semibold text-yellow-600">
                    {user.credits ?? 0}
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="flex items-center gap-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2.5 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faGauge} className="text-slate-400 w-3.5" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2.5 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faUser} className="text-slate-400 w-3.5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 font-medium hover:bg-red-50 transition-colors w-full text-left px-3 py-2.5 rounded-lg"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                href="/auth/login"
                className="flex-1 text-center rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex-1 text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
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