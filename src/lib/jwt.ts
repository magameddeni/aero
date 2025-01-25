import jwt from "jsonwebtoken"
import { getConfig } from "./config"
import { db } from ".."
import { Err } from "./error.interceptor"
import {
  GENERATE_ACCESS_TOKEN_OPTION,
  GENERATE_REFRESH_TOKEN_OPTION,
} from "../config"

class JwtService {
  generateAccessToken(user: { id: string; email: string; phone: string }) {
    const { id, email, phone } = user

    return jwt.sign(
      { id, email, phone },
      getConfig("ACCESS_TOKEN_SECRET"),
      GENERATE_ACCESS_TOKEN_OPTION,
    )
  }

  generateRefreshToken(user: { id: string; email: string; phone: string }) {
    const { id, email, phone } = user
    return jwt.sign(
      { id, email, phone },
      getConfig("REFRESH_TOKEN_SECRET"),
      GENERATE_REFRESH_TOKEN_OPTION,
    )
  }

  async updateRefreshToken(token: string, newToken: string) {
    try {
      const [response] = (await db.query(
        `UPDATE JwtToken SET token=? WHERE token = ?`,
        [newToken, token],
      )) as any
      return response
    } catch (error) {
      throw new Err(400, "Не удалось обновить токен!")
    }
  }

  async saveRefreshToken(user_id: string, token: string) {
    return await db.query(
      `INSERT INTO JwtToken (token, user_id) VALUES (?,?)`,
      [token, user_id],
    )
  }

  async verifyAccessToken(access: string) {
    return jwt.verify(access, getConfig("ACCESS_TOKEN_SECRET"))
  }

  async verifyRefreshToken(token: string) {
    return jwt.verify(token, getConfig("REFRESH_TOKEN_SECRET"))
  }
}

export default new JwtService()
