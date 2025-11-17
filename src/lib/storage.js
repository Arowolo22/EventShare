import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const eventsPath = path.join(dataDir, "events.json");
const photosPath = path.join(dataDir, "photos.json");

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

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

export const getEvents = () => readJson(eventsPath);

export const saveEvents = (events) => writeJson(eventsPath, events);

export const findEventByCode = async (code) => {
  const normalized = normalizeCode(code);
  const events = await getEvents();
  return events.find((event) => event.code === normalized) || null;
};

export const createEvent = async ({ name, description }) => {
  const events = await getEvents();
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
  await saveEvents(events);
  return newEvent;
};

export const getPhotos = () => readJson(photosPath);

export const savePhotos = (photos) => writeJson(photosPath, photos);

export const addPhotoRecord = async (eventCode, photo) => {
  const normalized = normalizeCode(eventCode);
  const photos = await getPhotos();
  const record = {
    id: randomUUID(),
    eventCode: normalized,
    ...photo,
  };

  photos.push(record);
  await savePhotos(photos);
  return record;
};

export const getPhotosByEventCode = async (eventCode) => {
  const normalized = normalizeCode(eventCode);
  const photos = await getPhotos();
  return photos.filter((photo) => photo.eventCode === normalized);
};

export const getPhotoCount = async (eventCode) => {
  const photos = await getPhotosByEventCode(eventCode);
  return photos.length;
};

export { normalizeCode };

