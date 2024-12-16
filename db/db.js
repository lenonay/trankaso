import fs from "node:fs";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { JSONFilePreset } from "lowdb/node";

import { DEF_USER, SALT } from "../config.js";

const tables = ["users"];

export async function InitDB() {
    // Iniciamos la base de datos
    InitDBFile();

    // Leemos la db
    const db = await JSONFilePreset("./db/db.json", { users: [] });

    // Revisamos el tamaño del array de usuarios
    if (db.data.users.length === 0) {
        // Si no hay user metemos un básico
        await db.update(({ users }) => {
            users.push({
                id: randomUUID(),
                user: DEF_USER,
                passwd: bcrypt.hashSync(DEF_USER, Number(SALT))
            })
        })
    }
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
    // Creamos el cuerpo vacio
    let body = {};

    // Iteramos por cada tabla y la añadimos
    tables.forEach(table => body[table] = []);

    // Guardamos los cambios
    fs.writeFileSync("./db/db.json", JSON.stringify(body), "utf8");
}