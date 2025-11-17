"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/navbar";

export default function Join() {
  const router = useRouter();
  const [eventCode, setEventCode] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCode = eventCode.trim().toUpperCase();
    if (!trimmedCode) {
      setErrorMessage("Please enter a valid event code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/events?code=${trimmedCode}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to find event.");
      }

      const guestQuery = guestName
        ? `?guest=${encodeURIComponent(guestName)}`
        : "";
      router.push(`/gallery/${trimmedCode}${guestQuery}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-33">
        <div className="max-w-7xl text-center  mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-gray-900 font-bold text-3xl">Join Your Event</h1>
          <p className="text-gray-600 mt-2">
            Enter the event code to start sharing photos
          </p>

          <form
            className="mt-8 max-w-2xl mx-auto text-left"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <label
                htmlFor="eventCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Code
              </label>
              <input
                type="text"
                id="eventCode"
                name="eventCode"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                placeholder="ABCD123"
                className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition uppercase tracking-[0.3em]"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="guestName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name (optional)
              </label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Emmanuel Arowolo"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
              />
            </div>

            {errorMessage && (
              <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Event"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
