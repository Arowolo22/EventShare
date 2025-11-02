"use client";

import Navbar from "@/components/ui/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    // For now, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl text-center mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-gray-900 font-bold text-3xl">Organizer Login</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your events</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 max-w-2xl mx-auto text-left"
          >
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/auth/signup"
                className="text-green-900 font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
