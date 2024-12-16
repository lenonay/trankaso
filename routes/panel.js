import { Router } from "express";

export const PanelRouter = Router();

PanelRouter.get("/", (req, res) => {
    res.sendFile("panel.html", { root: "./views" });
});