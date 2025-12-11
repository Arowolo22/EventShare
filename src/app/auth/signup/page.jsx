"use client";

import React from "react";
import Navbar from "@/components/ui/navbar";

export default function Signup() {
  return (
    <>
      <Navbar />
      <section className="bg-gray-50 w-full py-12 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gray-900 font-bold text-3xl">Sign Up</h1>
          <p className="text-gray-600 mt-4">
            Organizer self-signup isn't enabled yet. If you need access, please
            contact the admin team to create an account for you.
          </p>
        </div>
      </section>
    </>
  );
}
