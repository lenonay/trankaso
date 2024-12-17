import z from "zod";
import jwt from "jsonwebtoken";

import { JWT_PASS } from "../config.js";
import { CheckUser } from "../models/localDB.js";

export class LoginController {
    static async Login(req, res) {
        // Creamos el esquema.
        const Schema = z.object({
            user: z.string().nonempty({ message: "El usuario es requerido" }),
            passwd: z.string().nonempty({ message: "La contraseña es requerida" })
        });

        // Validamos el cuerpo
        const resultado = Schema.safeParse(req.body);

        // Si no es valido el esquema enviamos un error
        if (!resultado.success) {
            const error_msgs = resultado.error.errors.map(error => error.message);

            res.json({ status: "error", error: error_msgs[0] });
            return;
        }

        // Validamos el usuario
        const check = await CheckUser(req.body);

        // Si hubo un error enviamos el error
        if (check.status != "OK") {
            res.json({ status: "error", error: "Credenciales inválidas" });
            return;
        }

        const token = jwt.sign(check.data, JWT_PASS, {
            expiresIn: "6h"
        });

        res.cookie("token", token,
            {
                maxAge: 1000 * 60 * 60 * 6,
                sameSite: "strict",
                httpOnly: true
            }
        ).json({ status: "OK" });
    }

    static Logoff(req, res) {
        res.clearCookie("token", {
            sameSite: "strict",
            httpOnly: true
        }).json({ status: "OK" });
    }
}