import type { Request, Response } from "express";

import { errorHandler } from "#middlewares/errorhandler.js";
import authRouter from "#routes/auth/routes.js";
import subscriptionRouter from "#routes/subscription/routes.js";
import userRouter from "#routes/user/routes.js";
import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("combined"));

const port = 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Yo");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log("app listening on ", process.env.PORT);
});
