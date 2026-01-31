"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
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

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-700 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Register
          </Link>
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
            >
              Skills
            </Link>
            <Link
              href="/"
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

          {/* Mobile Auth Buttons */}
          <div className="flex gap-4 pt-2">
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
          </div>
        </div>
      )}
    </nav>
  );
}
