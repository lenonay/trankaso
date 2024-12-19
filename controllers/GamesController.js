import { JSONFilePreset } from "lowdb/node";

export class GamesController {
    static async GetNames(req, res) {
        if (!req.session) {
            res.status(401).send();
            return;
        }

        const db = await JSONFilePreset("./db/db.json", { games: [] });

        const game_names = db.data.games.map(entry => entry.name);

        res.json({ game_names });
    }

    static async CreateGame(req, res) {
        if (!req.session) {
            res.status(401).send();
            return;
        }
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
            path: "./vault/" + name,
            files: []
        };

        // Metemos el juego nuevo
        await db.update(({games}) => games.push(new_game));

        // Mandamos la confirmación de que todo está correcto.
        res.json({ status: "OK" });
    }
}