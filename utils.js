import { DATA_DIR, REQUESTS_FILE } from "./config.js";
import { promises as fs } from "node:fs";

export async function ensureFile(file, defaultValues) {
  try {
    await fs.access(file);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(defaultValues, null, 2));
  }
}

export const readJson = async (f) => JSON.parse(await fs.readFile(f, "utf-8"));
export const writeJson = async (f, d) =>
  fs.writeFile(f, JSON.stringify(d, null, 2));

export const logStream = async (f, d) =>
  await writeFile(f, JSON.stringify(d, null, 2), { flag: "a" });
