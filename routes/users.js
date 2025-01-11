import { Router } from "express";

import { UserController } from "../controllers/UsersController.js";

export const UsersRouter = Router();

UsersRouter.get("/", UserController.GetAllUsersData);

UsersRouter.patch("/", UserController.ChangeOwnPasswd);

UsersRouter.post("/", UserController.CreateNewUser);

UsersRouter.delete("/", UserController.DeleteUser);