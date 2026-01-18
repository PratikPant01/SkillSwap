"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the User type
interface User {
  id: number;
  email: string;
  username: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);  // ✅ Add type
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      // If no user data, redirect to login
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-4">
        <div className="text-center">
          <h2 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
            Welcome Back,
          </h2>
          <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            {user.username}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ready to swap some skills today?
          </p>
          
          {/* Quick Stats or Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Find Skills</h3>
              <p className="text-gray-600">Browse available skills</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-indigo-600 mb-2">Share Skills</h3>
              <p className="text-gray-600">Teach what you know</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-purple-600 mb-2">My Profile</h3>
              <p className="text-gray-600">Manage your account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}