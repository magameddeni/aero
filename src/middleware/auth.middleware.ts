import { Response, NextFunction } from "express"
import { IRequest } from "../interface"
import { Err } from "../lib/error.interceptor"
import jwt from "../lib/jwt"
import { redis } from "../lib/redis"

export const authMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "OPTION") next()

  try {
    const token =
      req?.cookies?.access ?? req.headers.authorization?.split(" ")[1]

    if (!token) {
      new Err(400, "Ошибка. Не удалось получить токен авторизации!")
      return
    }
    const isValid = (await jwt.verifyAccessToken(token)) as IRequest["user"]
    if (!isValid) throw new Err(401, "Истек срок действия токена.")

    const redisToken = await redis.get(token)
    if (redisToken) throw new Err(400, "Токен недействительный")

    req.user = isValid
    next()
  } catch (error) {
    res.status(400).json("Ошибка проверки токена")
  }
}
