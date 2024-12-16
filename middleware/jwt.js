import jwt from "jsonwebtoken";

import { JWT_PASS } from "../config.js";

export function token(req, res, next){
    // Sacamos el jwt de la cookie
    const token = req.cookies.token

    // Si conseguimos recuperar el token, obtenemos sus datos
    if(token){
        try {
            // Intentamos obtener los datos
            const data = jwt.verify(token, JWT_PASS);
            // Moficamos la request y guardamos el token ahi
            req.session = data;
        } catch {
            // Si hay un error guardamos null
            req.session = null;
        }
    }

    next();
}