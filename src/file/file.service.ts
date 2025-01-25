import path from "path"
import { db } from "../index"
import { Err } from "../lib"
import { IFIle } from "../interface"
import fs from "fs"

class FileService {
  destructuringFile(file: Express.Multer.File) {
    const {
      fieldname,
      originalname,
      mimetype,
      destination,
      filename,
      path,
      size,
    } = file

    return [
      fieldname,
      originalname,
      mimetype,
      destination,
      filename,
      path,
      size,
    ]
  }

  async save(userId?: string, file?: Express.Multer.File) {
    if (!file || !userId) throw new Err(400, "Ошибка сохранения файла!")
    const fileKeys = this.destructuringFile(file)
    const ext = path.extname(file.originalname)

    return await db.query(
      `INSERT INTO Files (fieldname, originalname, mimetype, destination, filename, path, size, extension, user_id) VALUES (?,?,?,?,?,?,?,?,?)`,
      [...fileKeys, ext, userId],
    )
  }

  async update(fileId?: string, userId?: string, file?: Express.Multer.File) {
    if (!file || !userId || !fileId)
      throw new Err(400, "Ошибка сохранения файла!")
    const fileKeys = this.destructuringFile(file)
    const ext = path.extname(file.originalname)

    return await db.query(
      `UPDATE Files SET fieldname=?, originalname=?, mimetype=?, destination=?, filename=?, path=?, size=?, extension=? WHERE user_id = ? AND id = ?`,
      [...fileKeys, ext, userId, fileId],
    )
  }

  async files(list_size: number, page: number, userId?: string) {
    const offset = (page - 1) * list_size
    const [files] = (await db.query(
      `SELECT SQL_CALC_FOUND_ROWS * FROM Files WHERE user_id = ? LIMIT ? OFFSET ?`,
      [userId, list_size, offset],
    )) as any

    const [countRows] = (await db.query(`SELECT FOUND_ROWS() AS total`)) as any
    const total = countRows[0].total
    const totalPages = Math.ceil(total / list_size)

    return {
      total,
      totalPages,
      currentPage: page,
      files,
    }
  }

  async file(fileId: string, userId?: string) {
    const [files] = (await db.query(
      `SELECT * FROM Files WHERE id = ? AND user_id = ?`,
      [fileId, userId],
    )) as any

    return files[0]
  }

  async download(fileId: string) {
    const [file] = (await db.query(
      "SELECT path, filename FROM Files WHERE id = ?",
      [fileId],
    )) as any

    return file[0]
  }

  async deleteFile(fileId: string, userId?: string) {
    const [files] = (await db.query(
      `SELECT * FROM Files WHERE id = ? AND user_id = ?`,
      [fileId, userId],
    )) as any
    if (Array.isArray(files) && !files.length)
      throw new Err(400, "Неверный идентификатор!")

    const { path } = files[0] as IFIle

    fs.rm(path, (err) => {
      if (err) throw new Err(400, "Ошибка при попытке удалить файл!")
    })
    await db.query(`DELETE from Files WHERE id = ? AND user_id = ?`, [
      fileId,
      userId,
    ])
  }
}

export default new FileService()
