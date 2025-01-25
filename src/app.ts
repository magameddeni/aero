import express from "express"
import config from "dotenv"
config.config()
import cors from "cors"
import Cookie from "cookie-parser"
import userRouter from "./user/user.router"
import fileRouter from "./file/file.router"
import mysql, { Pool } from "mysql2/promise"
import { createTable, getDBConfig } from "./config"
import { errorHandler, errorLogger } from "./lib"

export class App {
  private app: express.Express
  private port: string | number
  private connection: Pool

  constructor() {
    this.app = express()
    this.port = process.env.APP_PORT || 3000
    this.connection = mysql.createPool(getDBConfig())
  }

  private useListen() {
    this.app.listen(this.port, async () => {
      console.log(
        `[server]: Server is running at http://localhost:${this.port}`,
      )
    })
  }

  get useDB() {
    return this.connection
  }

  private useHandlers() {
    this.app.use(cors())
    this.app.use(Cookie())
    this.app.use(express.json())
    this.app.use(express.static("public"))
    this.app.use("/", userRouter)
    this.app.use("/file", fileRouter)
  }

  private useExectionFilter() {
    this.app.use(errorLogger)
    this.app.use(errorHandler)
  }

  init() {
    console.log(`[server]: Running...`)
    createTable(this.connection)
    this.useHandlers()
    this.useExectionFilter()
    this.useListen()
  }
}
