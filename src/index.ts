import type { Request, Response } from "express";

import authRouter from "#routes/auth/routes.js";
import subscriptionRouter from "#routes/subscription/routes.js";
import userRouter from "#routes/user/routes.js";
import express, { json } from "express";
import helmet from "helmet";
import morgan from "morgan";
const app = express();

app.use(json());
app.use(helmet());
app.use(morgan("combined"));

const port = 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Yo");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.listen(port, () => {
  console.log("app listening on ", process.env.PORT);
});
