import { createSubscription } from "#controllers/subscription.js";
import { authHandler } from "#middlewares/authHandler.js";
import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authHandler, createSubscription);

export default subscriptionRouter;
