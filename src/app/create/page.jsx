/* eslint-disable react/no-unescaped-entities */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/navbar";

export default function Create() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = useMemo(() => eventName.trim().length > 0, [eventName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName, description }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to create event.");
      }

      const { event } = await response.json();
      setCreatedEvent(event);
      setIsModalOpen(true);
      setEventName("");
      setDescription("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!createdEvent?.code) return;
    try {
      await navigator.clipboard.writeText(createdEvent.code);
    } catch (_error) {
      // noop
    }
  };

  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl text-center  mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-gray-900 font-bold text-3xl">
            Create Your Event
          </h1>
          <p className="text-gray-600 mt-2">
            Set up a shared photo pool for your guests
          </p>

          <form
            className="mt-8 max-w-2xl mx-auto text-left"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <label
                htmlFor="eventName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Arowolo's Wedding"
                className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your favorite moments from our special day!"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {errorMessage && (
              <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="w-full bg-green-900 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </section>

      {isModalOpen && createdEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Event Created!</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Share this code with your guests so they can join and upload
                  photos
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl bg-[#fbfcf7] p-6">
              <div className="text-sm text-gray-500">Event Name</div>
              <div className="text-lg font-semibold text-gray-900">
                {createdEvent.name}
              </div>
              <div className="text-sm text-gray-500">Event Code</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg border border-gray-200 bg-white py-3 text-center text-2xl font-bold tracking-[0.35em] text-gray-900">
                  {createdEvent.code}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  if (createdEvent?.code) {
                    router.push(`/gallery/${createdEvent.code}`);
                    setIsModalOpen(false);
                  }
                }}
                className="rounded-lg border border-green-900 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
              >
                Go to Gallery
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-green-900 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
