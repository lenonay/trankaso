import bcrypt from "bcrypt";
import { JSONFilePreset } from "lowdb/node";

import { SALT } from "../config.js";

export async function CheckUser(_data) {
    // Leemos la base de datos
    const db = await JSONFilePreset("./db/db.json", { users: [] });

    // Buscamos si existe el usuario que estamos buscando
    const userDB = db.data.users.find(entry => entry.user == _data.user);

    // Si no existe delvemos error
    if (!userDB) {
        return { status: "error" }
    };

    // Si la contraseña no coincide devolvemos error
    if (!bcrypt.compareSync(_data.passwd, userDB.passwd)) {
        return { status: "error" };
    }

    const { passwd: _, ...data } = userDB

    return { status: "OK", data };
}

export async function ChangePasswd(user, new_passwd) {
    // Cargamos la DB
    const db = await JSONFilePreset("./db/db.json", { users: [] });

    // Filtramos por el usuario
    const userDB = db.data.users.filter(entry => entry.user == user);

    // Si no hay salimos
    if (!userDB) return { status: "error", error: "El usuario no existe" };

    try {
        // Hasheamos la contraseña
        const hashed_passwd = bcrypt.hashSync(new_passwd, Number(SALT));

        // Cambiamos la contraseña del usuario creado
        userDB[0].passwd = hashed_passwd;

        // Guardamos los cambios:
        db.write();

        // Retornamos exito
        return { status: "OK" }
    } catch {
        return { status: "error", error: "No se pudo guardar la contraseña" }
    }

}