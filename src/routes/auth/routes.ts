import type { Request, Response } from "express";

import { Router } from "express";
const authRouter = Router();

authRouter.get("/", (req, res) => res.send("auth"));

authRouter.post("/sign-up", (_req: Request, res: Response) => {
  res.send({
    title: "Sign up",
  });
});

authRouter.post("/sign-in", (_req: Request, res: Response) => {
  res.send({
    title: "Sign in",
  });
});

authRouter.post("/sign-out", (_req: Request, res: Response) => {
  res.send({
    title: "Sign out",
  });
});

export default authRouter;
