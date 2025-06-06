import express from "express";
import { USERS_FILE, REQUESTS_FILE } from "./config.js";
import {
  listUsers,
  createUser,
  deleteUser,
  findUser,
  updateUser,
  validateUser,
  generateToken,
  verifyToken,
} from "./middlewares.js";
import { ensureFile, readJson, writeJson } from "./utils.js";
import morgan from "morgan";
import "dotenv/config";

const PORT = process.env.PORT;

const app = express();

app.use(async (req, res, next) => {
  await ensureFile(USERS_FILE, []);
  await ensureFile(REQUESTS_FILE, []);
  next();
});

app.use(express.json());

app.use(
  morgan(async (tokens, req, res) => {
    const new_request = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      response_time: tokens["response-time"](req, res) + "ms",
      timestamp: new Date().toISOString(),
    };
    const requests = await readJson(REQUESTS_FILE);
    requests.push(new_request);
    writeJson(REQUESTS_FILE, requests);
  })
);

app.get("/", listUsers, (req, res) => {});

app.post("/", [verifyToken, validateUser, createUser], (req, res) => {});

app.put("/:id", [verifyToken, validateUser, updateUser], (req, res) => {});

app.delete("/:id", [verifyToken, deleteUser], (req, res) => {});

app.get("/:id", findUser, (req, res) => {});

app.post("/login", generateToken, (req, res) => {});

app.listen(PORT, () => {
  console.log(`El servidor esta escuchando el puerto ${PORT}`);
});
