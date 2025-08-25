import { getUser, getUsers } from "#controllers/user.js";
import { authHandler } from "#middlewares/authHandler.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authHandler, getUser);

export default userRouter;
