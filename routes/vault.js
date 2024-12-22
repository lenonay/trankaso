import e, { Router } from "express";

import { authorize } from "../middleware/authorize.js";

export const VaultRouter = Router();

VaultRouter.use(authorize);

VaultRouter.use("/", e.static("./vault"));