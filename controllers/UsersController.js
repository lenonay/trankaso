import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { JSONFilePreset } from "lowdb/node";

import { SALT } from "../config.js";
import { ValidatePasswd } from "../models/validations.js";
import { ChangePasswd, CheckUser } from "../models/localDB.js";

export class UserController {
    static async GetAllUsersData(req, res) {
        // Cargamos la base de datos
        const db = await JSONFilePreset("./db/db.json", { users: [] });

        // Inicializamos el array
        let usersData = [];

        // Iteramos por cada usuarios
        db.data.users.forEach(entry => {
            // Le sacamos la contraseña a los datos del usuario
            const { passwd: _, ...data } = entry

            // Lo metemos a los datos a enviar
            usersData.push(data);
        });

        // Enviamos todos los datos de los usuarios.
        res.json(usersData);
    }

    static async ChangeOwnPasswd(req, res) {
        // Sacamos las contraseñas de las peticiones;
        const { new_passwd, old_passwd } = req.body;
        const { user } = req.session;

        // Validamos si cumple las condiciones la nueva contraseña
        if (!ValidatePasswd(new_passwd)) {
            res.json({ status: "error", error: "La contraseña no cumple los requisitos" });
            return;
        }

        // Validamos si la contraseña actual es correcta.
        const userDB = await CheckUser({ user, passwd: old_passwd });

        // Si no es correcta enviamos el error y salimos
        if (userDB.status !== "OK") {
            res.json({ status: "error", error: "La contraseña actual no es correcta" });
            return;
        }

        const resultado = await ChangePasswd(user, new_passwd);

        res.json(resultado)
    }

    static async CreateNewUser(req, res) {
        const { username } = req.body;
        // Revisamos que sea válido
        if (username.length < 4) {
            res.send({ status: "error", error: "El nombre de usuario debe ser mayor a 4 letras" });
            return;
        }

        // Validamos que no exista ya
        const db = await JSONFilePreset("./db/db.json", { users: [] });

        // Verificamos que no exista uno que se llame igual
        const exists = db.data.users.find(entry => entry.user == username);

        // Si se llama igual mandamos error
        if (exists) {
            res.send({ status: "error", error: "Ese usuario ya existe" });
            return;
        }

        const tmp_passwd = Math.random().toString(16).replace("0.", "").slice(0, 8);

        // Creamos el cuerpo del nuevo usuario
        const newUser = {
            id: crypto.randomUUID(),
            user: username,
            passwd: bcrypt.hashSync(tmp_passwd, Number(SALT)),
            creator: req.session.user
        }

        try {
            db.update(({ users }) => users.push(newUser));
            res.send({ status: "OK", tmp_passwd });

        } catch {
            res.send({ status: "error", error: "No se ha podido crear el usuario" });
        }

    }
}