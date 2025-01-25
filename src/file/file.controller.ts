import { Response } from "express"
import { IRequest } from "../interface"
import fileService from "./file.service"
import { Err } from "../lib"
import fs from "fs"

class FileController {
  async upload(req: IRequest, res: Response) {
    const file = req.file
    const userId = req.user?.id
    await fileService.save(userId, file)
    res.status(200).json(req.file)
  }

  async update(req: IRequest, res: Response) {
    const fileId = req.params.id
    const userId = req.user?.id
    await fileService.update(fileId, userId, req.file)
    res.sendStatus(201)
  }

  async files(req: IRequest, res: Response) {
    const userId = req.user?.id
    const { list_size = 10, page = 1 } = req.query

    const files = await fileService.files(
      Number(list_size),
      Number(page),
      userId,
    )

    res.status(200).json(files)
  }

  async file(req: IRequest, res: Response) {
    const userId = req.user?.id
    const fileId = req.params.id

    const file = await fileService.file(fileId, userId)

    res.status(200).json(file)
  }

  async download(req: IRequest, res: Response) {
    const fileId = req.params.id
    const filePath = await fileService.download(fileId)
    if (!filePath) throw new Err(400, "Не удалось отработать запрос!")
    const { path, filename } = filePath

    if (!fs.existsSync(path))
      throw new Err(400, "Не удалось найти файл для скачивания!")

    res.download(path, filename, (err) => {
      if (err) throw new Err(400, "Не удалось отправить файл!")
    })
  }

  async deleteFile(req: IRequest, res: Response) {
    const fileId = req.params.id
    const userId = req.user?.id

    await fileService.deleteFile(fileId, userId)

    res.sendStatus(200)
  }
}

export default new FileController()
