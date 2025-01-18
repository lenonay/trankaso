import { CreateBackup } from "../db/db.js";

export function backupDB(req, res, next) {
    // Intentamos crear el backup
    try {
        CreateBackup();
    } catch {}

    // Pasamos al siguiente
    next();
}