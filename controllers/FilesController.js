import fs from "node:fs";
import { JSONFilePreset } from "lowdb/node";
import { execSync } from "node:child_process";

import { Archives } from "../models/archive.js";

export class FilesController {
    static async Upload(req, res) {
        // Si no hay archivo salimos
        if (!req.file) {
            res.json({ status: "error" });
            return;
        }
        // Cargamos los datos de la DB
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        // Sacamos todas las variables necesarias
        const { path, mimetype, size, originalname } = req.file;
        const { workdir, thumbpath, gamename, user } = req.session

        const CreateImageThumbnail = () => {

            const thumbnail_path = thumbpath + originalname;

            const comando = `convert -thumbnail 150 '${path}' '${thumbnail_path}'`
            // Ejecutamos el comando
            execSync(comando);

            return thumbnail_path;
        }

        const CreateVideoThumbnail = () => {
            // Creamos el nombre normal
            const filename = originalname.split(".").slice(0, -1).join(".");

            const file_pic = filename + ".png";
            const tmp_png_file = workdir + file_pic;
            const thumbnail_path = thumbpath + file_pic;

            // Crear la miniatura
            const miniatura_commando = `ffmpeg -loglevel quiet -i '${path}' -frames:v 1 '${tmp_png_file}'`;
            try {
                execSync(miniatura_commando);
            } catch { };

            // Crear thumb de la miniatura
            const thub_comando = `convert -thumbnail 150 '${tmp_png_file}' '${thumbnail_path}'`;
            try {
                execSync(thub_comando);
            } catch { }

            // Borrar miniatura
            try {
                fs.unlinkSync(tmp_png_file);
            } catch { }

            return thumbnail_path;
        }

        // Sacamos el juego que estamos usando ahora
        const current_gameDB = db.data.games.find(entry => entry.name == gamename);
        // Buscamos una entrada que tenga el mismo nombre que lo que queremos subir
        const exists = current_gameDB.files.find(entry => entry.name == originalname);

        // Si existe enviamos error y salimos
        if (exists) {
            res.json({ status: "error", error: "El archivo ya existe" });
            return;
        }

        // 1. Crear el thumbnail y llevarlo a la ruta actual de trabajo
        let thumbnail_path = "";

        // Si es video creamos el thumbnail de un frame de un video
        if (mimetype.includes("video")) {
            thumbnail_path = CreateVideoThumbnail()
        } else {
            // Si no sencillamente creamos el thumbnail de un imagen
            thumbnail_path = CreateImageThumbnail();
        }

        // 2. Mover el fichero a su destino
        try {
            fs.renameSync(path, workdir + originalname);
        } catch { }

        // 3. Crear el objeto para la DB y meterlo
        const new_file = {
            name: originalname,
            game: gamename,
            path: workdir + originalname,
            thumbnail: thumbnail_path,
            size: (size / 1024 / 1024).toFixed(2),
            type: mimetype,
            author: user,
            date: new Date().toISOString(),
            archived: false
        }

        // Intentamos guardar el fichero en la DB
        try {
            await db.update(({ games }) => {
                // Recuperamos el juego actuak
                const juego = games.find(entry => entry.name == gamename);
                // Metemos todos los archivos
                juego.files.push(new_file);
            })

            res.json({ status: "OK" });

        } catch {
            // Si hay un error borramos los ficheros y enviamos error
            try {
                fs.unlinkSync(thumbnail_path);

                fs.unlinkSync(workdir + originalname);
            } catch { }

            res.json({ status: "error", error: "No se pudo guardar la imagen" });
        }
    }

    static async SendFilesData(req, res) {
        // Cargamos la DB
        const db = await JSONFilePreset("./db/db.json", { games: [] });
        // Sacamos los filtros
        const { games, author, date, type } = req.query;

        const result = db.data.games
        // 1. Filtrar juegos por nombre si existe el parámetro
        .filter(game => !games || games.split(";").includes(game.name))
        
        // 2. Mapear estructura y aplicar filtros a archivos
        .map(game => ({
            gameName: game.name,
            files: game.files
                // Archivos no archivados
                .filter(file => !file.archived)
                // Aplicar resto de filtros
                .filter(file => {
                    return (!author || author.split(";").includes(file.author)) &&
                           (!type || type.split(";").includes(file.type.split("/")[0])) &&
                           (!date || file.date.includes(date));
                })
        }))
        // 3. Eliminar juegos sin archivos
        .filter(game => game.files.length > 0);

        res.json(result);
    }

    static async SendFilesFilters(req, res) {
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        const users = db.data.users.map(entry => entry.user);

        const games = db.data.games
            .filter(entry => !entry.archived)
            .map(entry => entry.name)
            ;

        res.json({ users, games });
    }

    static async DeleteSingle(req, res) {
        const { game, name } = req.body;

        // Cargamos la base de datos
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        // Sacamos el juego que estamos buscando
        const gameDB = db.data.games.find(entry => entry.name == game);

        // Sacamos el fichero si el thumbnail incluye el nombre
        const fileDB = gameDB.files.find(entry => entry.thumbnail.includes(name) || entry.name == name);

        // Borramos tanto el archivo original como el thumbnail
        try {
            // Borramos el original
            fs.unlinkSync(fileDB.path);

            // Borramos el thumbnail
            fs.unlinkSync(fileDB.thumbnail);

            // Borrar registro de la DB
            gameDB.files = gameDB.files.filter(entry => entry.thumbnail !== fileDB.thumbnail);

            // Guardamos los cambios
            await db.write();

            // Enviamos estado existoso
            res.json({ status: "OK" });
        } catch (e) {
            // Si falla el borrado marcamos que no se pudo eliminar el archivo.
            res.json({ status: "error", error: "No se pudo eliminar el archivo" });

            console.log(e);
        }
    }

    static async ArchiveFile(req, res) {
        // Sacamos el cuerpo
        const { file, game } = req.body;

        // Cargamos la db
        const db = await JSONFilePreset('./db/db.json', { games: [] });

        // Obtenemos los datos del fichero
        const fileDB = GetFileFromDB(db, file, game);

        // Si no existe el fichero mandamos error
        if (!fileDB) {
            res.json({ status: "error", error: "No existe el fichero" });
            return;
        }

        // Lo intenantamos archivar
        const archived = await Archives.file(fileDB);

        // Si ocurre un error mientras se archiva, lo enviamos
        if (archived.status !== "OK") {
            res.json({ status: "error", error: "Fallo al comprimir el fichero" });
            return;
        }

        // Cambiamos al ruta al archivo comprimido
        fileDB.path = archived.new_path;
        fileDB.archived = true;

        await db.write();

        res.json({ status: "OK" });
    }

    static async GetArchivedFiles(req, res) {
        // Obtenemos la db
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        const archived_games = db.data.games
            // Mapeamos por cada juego
            .map(game => ({
                // Guardamos el nombre del juego
                gameName: game.name,
                // Archivos que tengan marcado como archivado
                files: game.files.filter(file => file.archived)
            }))
            // Eliminamos los juegos que no tengan archivados
            .filter(game => game.files.length > 0);
        ;

        res.send({ archived_games });
    }

    static async UnarchiveFile(req, res) {
        const { name, game } = req.body;

        // Cargamos la db
        const db = await JSONFilePreset('./db/db.json', { games: [] });

        // Obtenemos los datos del archivo
        const fileDB = GetFileFromDB(db, name, game);

        // Si no existe el fichero mandamos error
        if (!fileDB) {
            res.json({ status: "error", error: "No existe el fichero" });
            return;
        }

        // Tratamos de desarchivar el fichero
        const unarchived = await Archives.unarchive_file(fileDB);

        if (unarchived.status !== "OK") {
            res.json({ status: "error", error: unarchived.error });
            return;
        }

        fileDB.path = unarchived.new_path;
        fileDB.archived = false;

        await db.write();

        res.send({ status: "OK" });
    }
}

function GetFileFromDB(db, name, game) {
    // Filtramos primero por el juego en concreto, y luego por el nombre del fichero
    return db.data.games
        // Buscamos el juego
        .find(entry => entry.name == game)
        // Accedemos a sus archivos
        .files
        // Buscamos el nombre del archivo
        .find(entry => entry.name == name)
        ;
}