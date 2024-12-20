import { Router } from "express";

import { GamesController } from "../controllers/GamesController.js";

export const GamesRouter = Router();

GamesRouter.get("/", GamesController.GetNames);

GamesRouter.post("/", GamesController.CreateGame);

GamesRouter.put("/", GamesController.UseGame);