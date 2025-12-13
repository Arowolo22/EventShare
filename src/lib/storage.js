import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Detect if we're in a serverless/production environment
const isServerless =
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NODE_ENV === "production";

// File-based storage (for localhost)
const dataDir = path.join(process.cwd(), "src", "data");
const eventsPath = path.join(dataDir, "events.json");
const photosPath = path.join(dataDir, "photos.json");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkaPsMiQIcpQa50kmCdeNBDFJBmkZzSto",
  authDomain: "event-share-8005c.firebaseapp.com",
  projectId: "event-share-8005c",
  storageBucket: "event-share-8005c.firebasestorage.app",
  messagingSenderId: "637355605609",
  appId: "1:637355605609:web:c918b61be6bbd90027ecf8",
  measurementId: "G-FFKF6T6EK1",
};

// Initialize Firebase (always initialize, but only use in serverless)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

// File-based storage helpers
const ensureFile = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]", "utf8");
  }
};

const readJson = async (filePath) => {
  await ensureFile(filePath);
  const file = await fs.readFile(filePath, "utf8");
  return JSON.parse(file || "[]");
};

const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};

const generateCode = () =>
  Array.from({ length: CODE_LENGTH }, () =>
    CODE_ALPHABET.charAt(Math.floor(Math.random() * CODE_ALPHABET.length))
  ).join("");

const normalizeCode = (code) => code.trim().toUpperCase();

// File-based storage functions
const fileGetEvents = async () => {
  return await readJson(eventsPath);
};

const fileFindEventByCode = async (code) => {
  const normalized = normalizeCode(code);
  const events = await fileGetEvents();
  return events.find((event) => event.code === normalized) || null;
};

const fileCreateEvent = async ({ name, description }) => {
  const events = await fileGetEvents();
  let code = generateCode();
  const existingCodes = new Set(events.map((event) => event.code));
  while (existingCodes.has(code)) {
    code = generateCode();
  }

  const newEvent = {
    id: randomUUID(),
    name,
    description: description || "",
    code,
    createdAt: new Date().toISOString(),
  };

  events.push(newEvent);
  await writeJson(eventsPath, events);
  return newEvent;
};

const fileAddPhotoRecord = async (eventCode, photo) => {
  const normalized = normalizeCode(eventCode);
  const photos = await readJson(photosPath);
  const record = {
    id: randomUUID(),
    eventCode: normalized,
    ...photo,
  };

  photos.push(record);
  await writeJson(photosPath, photos);
  return record;
};

const fileGetPhotosByEventCode = async (eventCode) => {
  const normalized = normalizeCode(eventCode);
  const photos = await readJson(photosPath);
  return photos.filter((photo) => photo.eventCode === normalized);
};

// Firestore-based storage functions
const firestoreGetEvents = async () => {
  try {
    const eventsSnapshot = await getDocs(collection(db, "events"));
    return eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

const firestoreFindEventByCode = async (code) => {
  try {
    const normalized = normalizeCode(code);
    const eventsSnapshot = await getDocs(
      query(collection(db, "events"), where("code", "==", normalized))
    );
    if (eventsSnapshot.empty) return null;
    const doc = eventsSnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error finding event by code:", error);
    return null;
  }
};

const firestoreCreateEvent = async ({ name, description }) => {
  try {
    const events = await firestoreGetEvents();
    let code = generateCode();
    const existingCodes = new Set(events.map((event) => event.code));
    let attempts = 0;
    while (existingCodes.has(code) && attempts < 10) {
      code = generateCode();
      attempts++;
    }

    if (attempts >= 10) {
      throw new Error("Failed to generate unique event code");
    }

    const newEvent = {
      name,
      description: description || "",
      code,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "events"), newEvent);
    return { id: docRef.id, ...newEvent };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const firestoreAddPhotoRecord = async (eventCode, photo) => {
  try {
    const normalized = normalizeCode(eventCode);
    const record = {
      eventCode: normalized,
      ...photo,
      uploadedAt: photo.uploadedAt || new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "photos"), record);
    return { id: docRef.id, ...record };
  } catch (error) {
    console.error("Error adding photo record:", error);
    throw error;
  }
};

const firestoreGetPhotosByEventCode = async (eventCode) => {
  try {
    const normalized = normalizeCode(eventCode);
    const photosSnapshot = await getDocs(
      query(collection(db, "photos"), where("eventCode", "==", normalized))
    );
    return photosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching photos by event code:", error);
    return [];
  }
};

// Export functions that use the appropriate storage based on environment
export const getEvents = isServerless ? firestoreGetEvents : fileGetEvents;

export const findEventByCode = isServerless
  ? firestoreFindEventByCode
  : fileFindEventByCode;

export const createEvent = isServerless
  ? firestoreCreateEvent
  : fileCreateEvent;

export const addPhotoRecord = isServerless
  ? firestoreAddPhotoRecord
  : fileAddPhotoRecord;

export const getPhotosByEventCode = isServerless
  ? firestoreGetPhotosByEventCode
  : fileGetPhotosByEventCode;

export const getPhotoCount = async (eventCode) => {
  const photos = await getPhotosByEventCode(eventCode);
  return photos.length;
};

export { normalizeCode };
