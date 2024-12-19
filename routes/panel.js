import { Router } from "express";

import { GamesController } from "../controllers/GamesController.js";

export const PanelRouter = Router();

PanelRouter.get("/", (req, res) => {
    if(!req.session) {
        res.redirect("../");
        return;
    }

    res.sendFile("panel.html", { root: "./views" });
});

PanelRouter.get("/games", GamesController.GetNames);

PanelRouter.post("/games", GamesController.CreateGame);