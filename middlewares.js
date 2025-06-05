import { USERS_FILE } from "./config.js";
import { userSchema } from "./schemas.js";
import { readJson, writeJson } from "./utils.js";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./utils.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await readJson(USERS_FILE);
    res.status(200).json({ usuarios: users });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
  next();
};

export const validateUser = async (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: messages });
  }
  const users = await readJson(USERS_FILE);
  const { id } = req.params;
  const emailExists = users.some(
    (user) => user.email === req.body.email && user.id !== id
  );
  if (emailExists)
    return res.status(409).json({ message: "El correo ya está registrado" });
  next();
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const new_user = {
      id: randomUUID(),
      name: req.body.name,
      email: req.body.email,
      password: await hashPassword(req.body.password),
      role: req.body.role,
      fechaRegistro: new Date().toISOString().split("T")[0],
    };
    const users = await readJson(USERS_FILE);
    users.push(new_user);
    await writeJson(USERS_FILE, users);
    return res.status(201).json({ new_user: new_user });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
  next();
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await readJson(USERS_FILE);
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    const index = users.indexOf(user);
    const { name, email, password, role } = req.body;

    const new_user = {
      id: user.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      fechaRegistro: user.fechaRegistro,
    };

    users.splice(index, 1, new_user);
    await writeJson(USERS_FILE, users);
    return res
      .status(200)
      .json({ message: `Usuario ${id} actualizado con exito` });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
  next();
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await readJson(USERS_FILE);
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    const index = users.indexOf(user);

    users.splice(index, 1);
    await writeJson(USERS_FILE, users);
    return res
      .status(200)
      .json({ message: `Usuario ${id} eliminado con exito` });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
  next();
};

export const findUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await readJson(USERS_FILE);
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    return res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
  next();
};
