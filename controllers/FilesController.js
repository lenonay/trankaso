import fs from "node:fs";
import { JSONFilePreset } from "lowdb/node";
import { execSync } from "node:child_process";

export class FilesController {
    static async Upload(req, res) {
        // Si no hay archivo salimos
        if (!req.file) {
            res.json({ status: "error" });
            return;
        }
        const { path, mimetype, size, originalname } = req.file;
        const { workdir, thumbpath, gamename, user } = req.session

        const CreateImageThumbnail = () => {

            const thumbnail_path = thumbpath + originalname;

            const comando = `convert -thumbnail 150 ${path} ${thumbnail_path}`
            // Ejecutamos el comando
            execSync(comando);

            return thumbnail_path;
        }

        const CreateVideoThumbnail = () => {
            // Creamos el nombre normal
            const filename = originalname.split(".").slice(0, -1).join("");

            const file_pic = filename + ".png";
            const tmp_png_file = workdir + file_pic;
            const thumbnail_path = thumbpath + file_pic;

            // Crear la miniatura
            const miniatura_commando = `ffmpeg -loglevel quiet -i ${path} -frames:v 1 ${tmp_png_file}`;
            try {
                execSync(miniatura_commando);
            } catch { };

            // Crear thumb de la miniatura
            const thub_comando = `convert -thumbnail 150 ${tmp_png_file} ${thumbnail_path}`;
            try {
                execSync(thub_comando);
            } catch { }

            // Borrar miniatura
            try {
                fs.unlinkSync(tmp_png_file);
            } catch { }

            return thumbnail_path;
        }

        // 1. Crear el thumbnail y llevarlo a la ruta actual de trabajo
        let thumbnail_path = "";

        if (mimetype.includes("video")) {
            thumbnail_path = CreateVideoThumbnail()
        } else {
            thumbnail_path = CreateImageThumbnail();
        }

        // 2. Mover el fichero a su destino
        try {
            fs.renameSync(path, workdir + originalname);
        } catch {}

        // 3. Crear el objeto para la DB y meterlo
        const new_file = {
            name: originalname,
            path: workdir + originalname,
            thumbnail: thumbnail_path,
            size: Math.round((size / 1024 / 1024), 2),
            type: mimetype,
            author: user,
            date: new Date().toISOString()
        }

        const db = await JSONFilePreset("./db/db.json", { games: [] });

        await db.update(({ games }) => {
            // Recuperamos el juego actuak
            const juego = games.find(entry => entry.name == gamename);
            // Metemos todos los archivos
            juego.files.push(new_file);
        })

        res.json({ status: "OK" });
    }
}