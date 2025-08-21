import type { Request, Response } from "express";

import { getUser, getUsers } from "#controllers/user.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", (req: Request, res: Response) => res.send({ title: "Create new user" }));

userRouter.put("/:id", (req: Request, res: Response) => res.send({ title: "UPDATE user" }));

userRouter.delete("/:id", (req: Request, res: Response) => res.send({ title: "DELETE user" }));

export default userRouter;
