import bcrypt from "bcrypt";
import { JSONFilePreset } from "lowdb/node";

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