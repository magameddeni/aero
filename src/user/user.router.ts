import { Router } from "express"
import userController from "./user.controller"
import { asyncWrapper } from "../lib/error.interceptor"
import { authMiddleware } from "../middleware/auth.middleware"

const userRouter = Router()

userRouter.post("/signin", asyncWrapper(userController.signin))
userRouter.post("/signin/new_token", asyncWrapper(userController.refresh))
userRouter.post("/signup", asyncWrapper(userController.signup))
userRouter.get("/info", authMiddleware, asyncWrapper(userController.info))
userRouter.get("/logout", authMiddleware, asyncWrapper(userController.logout))

export default userRouter
