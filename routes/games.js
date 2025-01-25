import { Router } from "express";

import { GamesController } from "../controllers/GamesController.js";

export const GamesRouter = Router();

GamesRouter.get("/", GamesController.GetNames);

GamesRouter.get("/data", GamesController.GetAllData);

GamesRouter.post("/", GamesController.CreateGame);

GamesRouter.put("/", GamesController.UseGame);

GamesRouter.delete("/", GamesController.DeleteGame);