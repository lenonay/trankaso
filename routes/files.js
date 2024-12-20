import e, { Router } from "express";
import multer from "multer";
import path from "node:path"

import { TMP_DIR, allowed_ext } from "../config.js";
import { FilesController } from "../controllers/FilesController.js";

export const FilesRouter = Router();

const storage = multer.diskStorage({
    destination: TMP_DIR,
    filename: (req, file, cb) => {

        file.originalname = file.originalname.replaceAll(" ","_");

        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    // Sacamos la extensión del archivo
    const extension = path.extname(file.originalname).slice(1).toLowerCase();

    // Si no esta en las permitidas paramos la subida.
    if (!allowed_ext.includes(extension)) {
        cb(new Error("Extensión inválida"), false);
    }

    cb(null, true);
}

const uploader = multer({ storage, fileFilter });

FilesRouter.post("/", uploader.single("file"), FilesController.Upload)

// Manejo de errores de multer
FilesRouter.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Errores específicos de multer
        return res.json({ error: err.message });
    } else if (err) {
        // Otros errores
        return res.json({ error: err.message });
    }
    next();
});