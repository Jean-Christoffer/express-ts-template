import { signIn, signOut, signUp } from "#controllers/auth.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

export default authRouter;
