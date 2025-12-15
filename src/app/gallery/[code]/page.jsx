"use client";

import {
  use as usePromise,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Navbar from "@/components/ui/navbar";
import { Upload } from "lucide-react";

export default function GalleryPage({ params, searchParams }) {
  const resolvedParams = usePromise(params);
  const resolvedSearchParams = usePromise(searchParams);
  const codeParam = decodeURIComponent(
    resolvedParams?.code || ""
  ).toUpperCase();
  const guestName = resolvedSearchParams?.guest;
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?code=${codeParam}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to load event.");
      }
      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [codeParam]);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch(`/api/photos?code=${codeParam}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to load photos.");
      }
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [codeParam]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");
    fetchEvent();
    fetchPhotos();
  }, [fetchEvent, fetchPhotos]);

  const handleUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    setUploadError("");

    // Limit how many uploads run at the same time so we don't overload the server
    const CONCURRENCY_LIMIT = 4;

    const uploadSingle = async (file) => {
      const formData = new FormData();
      formData.append("eventCode", codeParam);
      formData.append("file", file);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed.");
      }

      const { photo } = await response.json();
      return photo;
    };

    try {
      const queue = [...files];
      const inFlight = new Set();
      const uploadedPhotos = [];

      while (queue.length > 0 || inFlight.size > 0) {
        while (queue.length > 0 && inFlight.size < CONCURRENCY_LIMIT) {
          const file = queue.shift();
          const promise = uploadSingle(file)
            .then((photo) => {
              uploadedPhotos.push(photo);
            })
            .catch((error) => {
              // Capture the first error; others will still continue
              if (!uploadError) {
                setUploadError(error.message);
              }
            })
            .finally(() => {
              inFlight.delete(promise);
            });

          inFlight.add(promise);
        }

        // Wait for at least one upload to finish before continuing
        if (inFlight.size > 0) {
          await Promise.race(inFlight);
        }
      }

      if (uploadedPhotos.length > 0) {
        // Add new photos to the top of the gallery
        setPhotos((current) => [...uploadedPhotos, ...current]);
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    void handleUpload(files);
    event.target.value = "";
  };

  const photoCount = useMemo(() => photos.length, [photos]);

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 w-full py-12 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white relative p-8 shadow">
            {loading ? (
              <p className="text-gray-500">Loading gallery...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {guestName && (
                      <p className="text-sm text-gray-500">
                        Welcome, {guestName}!
                      </p>
                    )}

                    <h1 className="text-3xl font-semibold text-gray-900">
                      {event?.name}
                    </h1>
                    <p className="text-gray-600">
                      Code:{" "}
                      <span className="font-semibold tracking-[0.3em]">
                        {codeParam}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-900">
                      {photoCount}
                    </p>
                    <p className="text-sm text-gray-500">
                      {photoCount === 1 ? "Photo" : "Photos"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <label
                    htmlFor="photo-upload"
                    className="fixed right-6 bottom-6 z-20 cursor-pointer"
                  >
                    <div className="bg-green-900 flex items-center justify-center text-white h-14 w-14 rounded-full shadow-lg">
                      <Upload className="h-6 w-6" />
                    </div>

                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploadError && (
                  <p className="mt-4 text-sm text-red-600">{uploadError}</p>
                )}

                <div className="mt-10">
                  {photos.length === 0 ? (
                    <p className="text-center text-gray-500">No photos yet.</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {photos.map((photo) => (
                        <figure
                          key={photo.id}
                          className="overflow-hidden rounded-xl border border-gray-100 bg-gray-100"
                        >
                          <img
                            src={photo.url}
                            alt={`Upload ${photo.id}`}
                            className="h-64 w-full object-cover"
                            loading="lazy"
                          />
                          <figcaption className="px-4 py-3 text-xs text-gray-500">
                            Uploaded on{" "}
                            {new Date(photo.uploadedAt).toLocaleString()}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
