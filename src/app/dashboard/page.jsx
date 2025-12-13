"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/auth-server/firebase";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import { ExternalLink, Copy, Calendar } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchEvents();
      } else {
        router.push("/auth/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events?all=true");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events || []);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeEvents = events.filter((event) => {
      const createdAt = new Date(event.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;

    const totalPhotos = events.reduce((sum, event) => {
      return sum + (event.photoCount || 0);
    }, 0);

    return {
      totalEvents,
      activeEvents,
      totalPhotos,
    };
  }, [events]);

  // Copy event code to clipboard
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      // You can add a toast notification here if you want
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-gray-900 font-bold text-3xl">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your events and view analytics
            </p>
            {user && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <p className="text-sm text-gray-500">
                  Logged in as: {user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 shadow-md rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Events
              </h3>
              <p className="text-3xl font-bold text-green-900">
                {stats.totalEvents}
              </p>
            </div>

            <div className="bg-white p-6 shadow-md rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Active Events
              </h3>
              <p className="text-3xl font-bold text-green-900">
                {stats.activeEvents}
              </p>
            </div>

            <div className="bg-white p-6 shadow-md rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Photos
              </h3>
              <p className="text-3xl font-bold text-green-900">
                {stats.totalPhotos}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Events
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No events yet</p>
                <Link
                  href="/create"
                  className="inline-flex px-4 py-2 rounded-md bg-green-900 text-white hover:bg-green-800 transition"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {event.name}
                        </h3>
                        {event.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Code:</span>
                            <span className="font-mono font-semibold tracking-wider text-gray-900">
                              {event.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(event.code)}
                              className="text-green-900 hover:text-green-700 transition"
                              title="Copy code"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              {new Date(event.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {event.photoCount || 0}
                            </span>{" "}
                            {event.photoCount === 1 ? "photo" : "photos"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/gallery/${event.code}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-900 text-white hover:bg-green-800 transition text-sm"
                        >
                          <ExternalLink size={16} />
                          View Gallery
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
