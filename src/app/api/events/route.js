import { NextResponse } from "next/server";
import {
  createEvent,
  findEventByCode,
  getPhotoCount,
  normalizeCode,
} from "@/lib/storage";

export async function POST(request) {
  try {
    const { eventName, description } = await request.json();

    if (!eventName || !eventName.trim()) {
      return NextResponse.json(
        { error: "Event name is required." },
        { status: 400 }
      );
    }

    const event = await createEvent({
      name: eventName.trim(),
      description: description?.trim() ?? "",
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { 
        error: error.message || "Unable to create event. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Event code is required." },
      { status: 400 }
    );
  }

  const normalizedCode = normalizeCode(code);
  const event = await findEventByCode(normalizedCode);

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const photoCount = await getPhotoCount(normalizedCode);

  return NextResponse.json({
    event: {
      ...event,
      photoCount,
    },
  });
}

