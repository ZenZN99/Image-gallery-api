import express from "express";
import { login, me, register } from "../controller/user.controller";
import { isAuthenticate } from "../middleware/isAuthenticate";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/me", isAuthenticate, me);

export default userRouter;
