import { Router } from "express";

import { LoginController } from "../controllers/LoginController.js";

export const LoginRouter = Router();

LoginRouter.post("/", LoginController.Login);

LoginRouter.delete("/", LoginController.Logoff);