import { User } from "lucide-react";
import Link  from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-black text-center">Login</h2>

        {/* Email input with icon */}
        <div className="relative w-full">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-3 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Login button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
          Login
        </button>
        <h4 className="text-center text-gray-900 text-sm">Don't have an SkillSwap Account?</h4>
        <div className="flex justify-center">
          <Link href="/auth/register" className="rounded-md border-2 border-blue-600 px-20 py-2 text-base font-medium text-blue-600  hover:text-blue-900 hover:border-blue-900 transition">Register</Link>
        </div>

      </div>
    </div>
    
  );
}

