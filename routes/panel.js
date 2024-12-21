import { Router } from "express";
import { GamesRouter } from "./games.js";
import { FilesRouter } from "./files.js";
import { authorize } from "../middleware/authorize.js";

export const PanelRouter = Router();

PanelRouter.get("/", (req, res) => {
    if(!req.session) {
        res.redirect("../");
        return;
    }
    
    res.sendFile("panel.html", { root: "./views" });
});

// Evitar accesos sin sesion
// PanelRouter.use(authorize);

PanelRouter.use("/games", GamesRouter);

PanelRouter.use("/files", FilesRouter);