import { Router } from "express";

export const PanelRouter = Router();

PanelRouter.get("/", (req, res) => {
    if(!req.session) {
        res.redirect("../");
        return;
    }

    res.sendFile("panel.html", { root: "./views" });
});