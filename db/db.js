import fs from "node:fs";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { JSONFilePreset } from "lowdb/node";

import { DEF_USER, SALT } from "../config.js";
import { LocalFileInclusion } from "./LFI.js";

const tables = ["users", "games"];

export async function InitDB() {
    // Iniciamos la base de datos
    InitDBFile();

    // Leemos la db
    const db = await JSONFilePreset("./db/db.json", { users: [], games: [] });

    // Revisamos el tamaño del array de usuarios
    if (db.data.users.length === 0) {
        // Si no hay user metemos un básico
        await db.update(({ users }) => {
            users.push({
                id: randomUUID(),
                user: DEF_USER,
                passwd: bcrypt.hashSync(DEF_USER, Number(SALT)),
                creator: "admin",
                priv: "ascendent"
            });
        })
    }

    // Si no hay datos de juegos
    if (db.data.games.length === 0) {
        // Obtenemos todos los juegos con sus datos
        const allGames = LocalFileInclusion();

        allGames.forEach(async game => {
            await db.update(({ games }) => {
                games.push(game);
            })
        })
    }
}

export function CreateBackup() {
    // Copiamos el archivo
    fs.copyFileSync("./db/db.json", "./db/backup.json");
}

export async function UpdateDB() {
    // Cargamos la db
    const db = await JSONFilePreset("./db/db.json", { users: [], games: [] });

    // Recuperamos las tablas
    const users = db.data.users;
    const games = db.data.games;

    // Iteramos por cada usuario
    users.forEach(user => {
        // Verificamos si tiene el priv
        if (!user.hasOwnProperty('priv')) {
            user.priv = "normie";
        }
    });

    games.forEach(game => {
        // Si no tiene la propiedad archived se la añadimos a false
        if(!game.hasOwnProperty('archived')){
            game.archived = false;
        }

        // Iteramos por todos los ficheros de cada juego
        game.files.forEach(file => {
            if(!file.hasOwnProperty('archived')){
                file.archived = false;
            }
        })
    });

    // Actualizamos la DB
    db.write();
}

function InitDBFile() {
    // Verificar si existe el archivo db
    if (!fs.existsSync("./db/db.json")) {
        CreateDB();
        return;
    }
    // Leemos el contenido
    try {
        let content = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));

        tables.forEach(table => {
            // Si no esta la tabla la añadimos
            if (!content[table]) content[table] = [];
        });

        // Guardamos los cambios
        fs.writeFileSync("./db/db.json", JSON.stringify(content), "utf8");
    } catch {
        CreateDB();
    }
}

function CreateDB() {

    // Intentamos cargar la copia de seguridad
    if (fs.existsSync("./db/backup.json")) {
        const backup = fs.readFileSync("./db/backup.json");

        let valid = null;

        // Intentamos parsear el backup
        try {
            valid = JSON.parse(backup);
        } catch { }

        // Si es válido, restauramos y salimos
        if (valid) {
            fs.copyFileSync("./db/backup.json", "./db/db.json")
            return;
        }
    }

    // Creamos el cuerpo vacio
    let body = {};

    // Iteramos por cada tabla y la añadimos
    tables.forEach(table => body[table] = []);

    // Guardamos los cambios
    fs.writeFileSync("./db/db.json", JSON.stringify(body), "utf8");
}