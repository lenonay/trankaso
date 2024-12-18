import { JSONFilePreset } from "lowdb/node";

export class GamesController {
    static async GetNames(req, res) {
        if (!req.session) {
            res.status(401).send();
            return;
        }

        const db = await JSONFilePreset("./db/db.json", { games: [] });

        const game_names = db.data.games.map(entry => entry.name);

        res.json({game_names});
    }
}