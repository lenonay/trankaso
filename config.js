import { InitDB } from "./db/db.js";

process.loadEnvFile("./.env");

export const {
    PORT = 3000,
    INT = "0.0.0.0",
    JWT_PASS,
    DEF_USER,
    SALT
} = process.env

InitDB();