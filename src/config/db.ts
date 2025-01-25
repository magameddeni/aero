import { Pool } from "mysql2/promise"
import { getConfig } from "../lib/config"

export const DB_CONFIG = {
  host: getConfig("DB_HOST"),
  user: getConfig("DB_USER"),
  password: getConfig("MYSQL_ROOT_PASSWORD"),
  database: getConfig("MYSQL_DATABASE"),
  // port: Number(getConfig("DB_PORT")),
}

const requests = [
  "CREATE TABLE IF NOT EXISTS `Files` (`fieldname` VARCHAR(500) NOT NULL , `originalname` VARCHAR(500) NOT NULL , `mimetype` VARCHAR(500) NOT NULL , `destination` VARCHAR(500) NOT NULL , `filename` VARCHAR(500) NOT NULL , `path` VARCHAR(500) NOT NULL , `size` INT NOT NULL , `extension` VARCHAR(50) NOT NULL , `user_id` INT NOT NULL , `id` INT NOT NULL AUTO_INCREMENT , PRIMARY KEY (`id`)) ENGINE = InnoDB;",
  "CREATE TABLE IF NOT EXISTS `JwtToken` (`id` INT NOT NULL AUTO_INCREMENT , `token` VARCHAR(500) NOT NULL , `user_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;",
  "CREATE TABLE IF NOT EXISTS `User` (`id` INT NOT NULL AUTO_INCREMENT , `email` VARCHAR(255) NOT NULL , `phone` VARCHAR(15) NOT NULL , `password` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;",
]

export const createTable = (pool: Pool) => {
  const promise = requests.map(
    (item) =>
      new Promise(async (resolve, reject) => {
        try {
          await pool.query(item)
          resolve(`Create!`)
        } catch (error) {
          reject(error)
        }
      }),
  )

  return Promise.all(promise)
}
