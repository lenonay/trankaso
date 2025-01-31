import jwt from "jsonwebtoken";
import { JSONFilePreset } from "lowdb/node";

import { JWT_PASS } from "../config.js";

export async function token(req, res, next) {
    // Sacamos el jwt de la cookie
    const token = req.cookies.token

    // Si conseguimos recuperar el token, obtenemos sus datos
    if (token) {
        try {
            // Intentamos obtener los datos
            const data = jwt.verify(token, JWT_PASS);

            // Validamos si existe el usuario
            const existe = ValidateUser(data.user);

            // Si no existe el usuario en la DB le quitamos el acceso
            if (!existe) {
                // Borramos la cookie
                res.clearCookie("token");
                // Sacamos la sesión
                res.session = null;

                next();
            }

            // Moficamos la request y guardamos el token ahi
            req.session = data;
        } catch {
            // Si hay un error guardamos null
            req.session = null;
        }
    }

    next();
}

async function ValidateUser(user) {
    // Cargamos la base de datos
    const db = await JSONFilePreset("./db/db.json", { users: [] });

    // Buscamos si el usuario está en la base de datos
    const existe = db.data.users.filter(entry => entry.user !== user);

    // Retornamos verdadero o falso
    if (existe) {
        return true;
    } else {
        return false;
    }
}