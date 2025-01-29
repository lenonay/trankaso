import { InitDB, UpdateDB } from "./db/db.js";

process.loadEnvFile("./.env");

export const {
    PORT = 3000,
    INT = "0.0.0.0",
    JWT_PASS,
    DEF_USER,
    SALT,
    TMP_DIR
} = process.env

export const allowed_ext = [
    "jpg", "png", "jpeg",
    "gif", "mov", "mp4",
    "webp", "webm"
]

InitDB();
await UpdateDB();