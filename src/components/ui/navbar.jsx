"use client";
import { Camera } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [{ href: "/dashboard", label: "Dashboard" }];

  return (
    <header className="top-0 sticky z-50 bg-white border-b  w-full backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <Camera size={30} color="green" />
            </div>
            <Link
              href="/"
              className="text-lg sm:text-xl font-semibold tracking-wide text-black"
            >
              EventShare
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-black transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-black  focus:outline-none "
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded px-3 py-2 text-base font-medium text-black  hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
