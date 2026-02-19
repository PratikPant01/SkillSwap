"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

export default function LoginPage() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // Get login function from context

  const handlelogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please Enter email and password");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Server Response: ", data);

      if (res.ok) {
        console.log(data.user); 
        login(
          {
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            credits: data.user.credits
          },
          data.token,
        );

        // Give React a moment to update state before navigating
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login error: ", err);
      setError("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-black text-center">Login</h2>
        {/* Email input */}
        <div className="relative w-full">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-3 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* Login button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          onClick={handlelogin}
        >
          Login
        </button>
        <h4 className="text-center text-gray-900 text-sm">
          Dont have an SkillSwap Account?
        </h4>
        <div className="flex justify-center">
          <Link
            href="/auth/register"
            className="rounded-md border-2 border-blue-600 px-20 py-2 text-base font-medium text-blue-600 hover:text-blue-900 hover:border-blue-900 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
