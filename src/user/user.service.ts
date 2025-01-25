import { Err } from "../lib/error.interceptor"
import bcrypt from "bcrypt"
import jwt from "../lib/jwt"
import { redis } from "../lib/redis"
import { db } from ".."
import { IUser } from "../interface/user"

class UserService {
  async signin(payload: { id: string; password: string }) {
    const { id, password } = payload
    const [rows] = (await db.query(
      `SELECT id, email, phone, password FROM User WHERE email=? OR phone=?`,
      [id, id],
    )) as any

    if (Array.isArray(rows) && !rows.length)
      throw new Err(400, "Не удалось получить пользователя!")

    const [user] = rows

    const isValidPass = await bcrypt.compare(password, user.password ?? "")
    if (!isValidPass) throw new Err(400, "Неверный пароль или логин!")

    const refreshToken = jwt.generateRefreshToken(user)
    await jwt.saveRefreshToken(user.id, refreshToken)

    const accessToken = jwt.generateAccessToken(user)
    return { accessToken, refreshToken }
  }

  async signup(payload: { id: string; password: string }) {
    const { id, password } = payload
    const [rows] = (await db.query(
      `SELECT id, email, phone FROM User WHERE email=? OR phone=?`,
      [id, id],
    )) as any

    if (rows.length)
      throw new Err(
        400,
        "Пользователь с такой почтой или номером зарегистрирован!",
      )

    const hashPassword = await bcrypt.hash(password, 10)

    const user = (await db.query(
      `INSERT INTO User (email, phone, password) VALUES (?,?,?)`,
      [id, id, hashPassword],
    )) as any

    const accessToken = jwt.generateAccessToken(user)
    const refreshToken = jwt.generateRefreshToken(user)
    return { accessToken, refreshToken }
  }

  async refresh(token: string) {
    if (!token) throw new Err(403, "Не удалось обновить токен!")

    const data = (await jwt.verifyRefreshToken(token)) as IUser
    if (!data) throw new Err(403, "Токен авторизации недействителен.")

    const accessToken = jwt.generateAccessToken(data)
    const refreshToken = jwt.generateRefreshToken(data)

    await jwt.updateRefreshToken(token, refreshToken)

    return { refreshToken, accessToken }
  }

  async logout(
    refreshToken?: string,
    accessToken?: string,
    userId?: string,
    expiresIn?: number,
  ) {
    const currentTime = Math.floor(Date.now() / 1000)
    const timeLeft = Number(expiresIn) - currentTime

    await redis.setex(
      accessToken ?? "",
      timeLeft < 1000 ? timeLeft : 10,
      "blacklist",
    )
    await db.query(`DELETE FROM JwtToken WHERE token = ? AND user_id = ?`, [
      refreshToken,
      userId,
    ])
  }
}

export default new UserService()
