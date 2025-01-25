import Redis from "ioredis"
import { getConfig } from "./config"

export const redis = new Redis(getConfig("REDIS_HOST"), {
  password: getConfig("REDIS_PASSWORD"),
})
