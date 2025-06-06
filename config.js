import path from "node:path";

export const DATA_DIR = path.resolve("./data/");
export const USERS_FILE = path.join(DATA_DIR, "users.json");
export const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
