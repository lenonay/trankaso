import fs from "node:fs";
import jwt from "jsonwebtoken";
import { JSONFilePreset } from "lowdb/node";

import { JWT_PASS, TMP_DIR } from "../config.js"

export class GamesController {
    static async GetNames(req, res) {
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        const game_names = db.data.games.map(entry => entry.name);

        res.json({ game_names });
    }

    static async CreateGame(req, res) {
        // Recuperamos el cuerpo del nombre
        const { name } = req.body;

        // Si no hay juego o tiene menos de dos letras devolvemos error.
        if (!name || name.length < 2) {
            res.json({
                status: "error",
                error: "El juego mínimo tiene que tener 2 letras"
            });
            return;
        }

        // Validamos que el juego no exista ya pero escrito de otra forma
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        // Buscamos un juego que sea igual que el solicitado para crear.
        const duplicado = db.data.games.find(entry => entry.name.toLowerCase() == name.toLowerCase());

        // Si hay uno enviamos error de que ya existe
        if (duplicado) {
            res.json({ status: "error", error: "Ese juego ya existe" });
            return;
        }

        // Creamos la entrada del nuevo juego
        const new_game = {
            name: name,
            author: req.session.user,
            path: "./vault/" + name + "/",
            thumbpath: "./vault/" + name + "/.thumbnails/",
            files: []
        };

        // Metemos el juego nuevo
        await db.update(({ games }) => games.push(new_game));

        // Mandamos la confirmación de que todo está correcto.
        res.json({ status: "OK" });
    }

    static async UseGame(req, res) {
        const { name } = req.body;

        const db = await JSONFilePreset("./db/db.json", { games: [] });

        // 1 Obtener la ruta de la carpeta desde la DB
        const gameDB = db.data.games.find(entry => entry.name == name);

        // Si no encuentra ninguno retorna error
        if (!gameDB) {
            res.json({ status: "error", error: "No se encontró el juego" });
            return;
        }
        // 1.1 Validar que la carpeta existe
        const { path, thumbpath } = gameDB;

        // Creamos la carpeta temporal si no existe
        CreateTMPDir();

        if (!fs.existsSync(path)) {
            // 1.1.2 Crearla si no existe
            try {
                fs.mkdirSync(path);
            } catch {
                // En caso de que falle la creación
                console.log(e);
                res.json({ status: "error", error: "No se pudo crear la ruta" });
                return;
            }
        }
        // 1.2 Verificar la carpeta de thumnails carpeta de thumbnails
        if (!fs.existsSync(thumbpath)) {
            // 1.2.1 Crear la carpeta si no existe.
            try {
                fs.mkdirSync(thumbpath);
            } catch {
                // En caso de que falle la creación
                res.json({ status: "error", error: "No se pudo crear la ruta" });
                return;
            }
        }

        // 2 Modificar la sesion del usuario y meter la carpeta que quiere usar

        // Creamos la nueva sesion
        const updated_session = {
            workdir: path,
            thumbpath: thumbpath,
            gamename: name,
            user: req.session.user,
            id: req.session.id
        };

        // Creamos el nuevo JWT
        const new_token = jwt.sign(updated_session, JWT_PASS, {
            expiresIn: "6h"
        });

        // 2.2 Actualizar la cookie
        res.cookie("token", new_token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 6,
            overwrite: true
        });

        // 3 Devolver estado
        res.json({ status: "OK" });
    }

    static async GetAllData(req, res) {
        // Cargamos la longitud
        const db = await JSONFilePreset('./db/db.json', { games: [] });

        // Devolvemos los datos de los juegos pero con la cantidad de ficheros.
        const new_Data = db.data.games.map((entry) => {
            return { ...entry, files: entry.files.length }
        });

        // Devolvemos los datos
        res.json(new_Data);
    }

    static async DeleteGame(req, res) {
        // Recuperamos valores de la sesión y el cuerpo
        const { creator } = req.session;
        const { game } = req.body;
        
        // Si no eres admin no se pueden eliminar juegos
        if(creator !== "admin") {
            res.json({status: "error", error: "No tienes permiso para eliminar juegos"});
            return;
        }

        // Cargamos la base de datos
        const db = await JSONFilePreset("./db/db.json", { games: [] });

        // Validamos si existe el juego
        const gameDB = db.data.games.filter(entry => entry.name == game)[0];

        // Si el juego no se encuentra, enviamos un error y salimos
        if (!gameDB) {
            res.json({ status: "error", error: "El juego no existe" });
            return;
        }

        // Borramos fisicamente el directorio y colocar la base de datos
        try {
            // Borramos la carpeta del juego de forma recursiva
            fs.rmSync(gameDB.path, { recursive: true });

            // Sacamos el juego de la base de datos
            await db.update(db => {
                db.games = db.games.filter(entry => entry.name != game);
            });

            // Enviamos que todo está okey
            res.json({ status: "OK" });
        } catch {
            // Si hubo un error, enviamos que no se pudo borrar el juego
            res.json({ status: "error", error: "No se pudo eliminar el juego" });
        }
    }
}

function CreateTMPDir() {
    if (!fs.existsSync(TMP_DIR)) {
        try {
            fs.mkdirSync(TMP_DIR);
        } catch (e) { console.log(e) }
    }
}