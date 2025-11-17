import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {
  addPhotoRecord,
  findEventByCode,
  getPhotosByEventCode,
  normalizeCode,
} from "@/lib/storage";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (
  !CLOUDINARY_CLOUD_NAME ||
  !CLOUDINARY_API_KEY ||
  !CLOUDINARY_API_SECRET
) {
  console.warn(
    "Cloudinary environment variables are missing. Photo uploads will fail until they are provided."
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

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
    return NextResponse.json(
      { error: "Event not found." },
      { status: 404 }
    );
  }

  const photos = await getPhotosByEventCode(normalizedCode);
  return NextResponse.json({ photos });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const eventCode = formData.get("eventCode");
    const file = formData.get("file");

    if (!eventCode) {
      return NextResponse.json(
        { error: "Event code is required." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A valid file is required." },
        { status: 400 }
      );
    }

    const normalizedCode = normalizeCode(eventCode);
    const event = await findEventByCode(normalizedCode);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `event-share/${normalizedCode}`,
          tags: [normalizedCode],
          context: { event_code: normalizedCode },
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const photoRecord = await addPhotoRecord(normalizedCode, {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ photo: photoRecord }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload photo:", error);
    return NextResponse.json(
      { error: "Unable to upload photo. Please try again." },
      { status: 500 }
    );
  }
}

