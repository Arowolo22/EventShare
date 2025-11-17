"use client";

import {
  use as usePromise,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Navbar from "@/components/ui/navbar";

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

    try {
      for (const file of files) {
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
        setPhotos((current) => [photo, ...current]);
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
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow">
            {loading ? (
              <p className="text-gray-500">Loading gallery...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-green-800">
                      Gallery
                    </p>
                    <h1 className="text-3xl font-semibold text-gray-900">
                      {event?.name}
                    </h1>
                    <p className="text-gray-600">
                      Code:{" "}
                      <span className="font-semibold tracking-[0.3em]">
                        {codeParam}
                      </span>
                    </p>
                    {guestName && (
                      <p className="text-sm text-gray-500">
                        Welcome, {guestName}!
                      </p>
                    )}
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

                <div className="mt-8 rounded-xl border border-dashed border-green-900/40 bg-green-50/50 p-6 text-center">
                  <p className="text-lg font-medium text-gray-900">
                    Add your pictures
                  </p>
                  <p className="text-sm text-gray-500">
                    Upload directly to this shared gallery. Cloudinary will host
                    every image securely.
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer rounded-lg bg-green-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      {uploading ? "Uploading..." : "Select Photos"}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      JPG, PNG or HEIC • up to 10MB each
                    </p>
                  </div>
                  {uploadError && (
                    <p className="mt-4 text-sm text-red-600">{uploadError}</p>
                  )}
                </div>

                <div className="mt-10">
                  {photos.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No photos yet. Be the first to add one!
                    </p>
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
