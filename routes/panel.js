import { Router } from "express";
import { GamesRouter } from "./games.js";
import { FilesRouter } from "./files.js";
import { UsersRouter } from "./users.js";

import { authorize } from "../middleware/authorize.js";
import { backupDB } from "../middleware/backupDB.js";

export const PanelRouter = Router();

PanelRouter.get("/", (req, res) => {
    // Si no hay sesison lo llevamos al panel de inicio
    if(!req.session) {
        res.redirect("../");
        return;
    }
    
    // Si hay, enviamos el panel
    res.sendFile("panel.html", { root: "./views" });
});

// Evitar accesos sin sesion válida
PanelRouter.use(authorize);

PanelRouter.use(backupDB);

PanelRouter.use("/games", GamesRouter);

PanelRouter.use("/files", FilesRouter);

PanelRouter.use("/users", UsersRouter);