import e, { json } from "express";
import cookieParser from "cookie-parser";

import { PORT, INT } from "./config.js";
import { LoginRouter } from "./routes/login.js";
import { PanelRouter } from "./routes/panel.js";

const app = e();

app.disable("x-powered-by");

app.use(json());
app.use(cookieParser());

app.use("/public", e.static("./public"));

app.get("/favicon.ico", (_, res) => { res.sendFile("logo.webp", { root: "./public" }); });

app.get("/", (req, res) => {
    res.sendFile("login.html", { root: "./views" });
});

app.use("/login", LoginRouter)

app.use("/panel", PanelRouter);

app.listen(PORT, INT, () => {
    console.log("Server is listening on:", INT, PORT);
});
