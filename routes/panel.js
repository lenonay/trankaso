import { Router } from "express";
import { GamesRouter } from "./games.js";
import { FilesRouter } from "./files.js";
import { authorize } from "../middleware/authorize.js";

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

PanelRouter.use("/games", GamesRouter);

PanelRouter.use("/files", FilesRouter);